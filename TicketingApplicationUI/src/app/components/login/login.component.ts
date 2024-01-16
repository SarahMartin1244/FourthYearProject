import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] 
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye";
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? "fa-eye-slash" : "fa-eye";
    this.type = this.isText ? "text" : "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)

      // Send object to the database
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            alert(res.message);
            this.loginForm.reset();
            this.router.navigate(['dashboard']);
          },
          error: (err) => {
            alert(err?.error.message);
          }
        });
    } else {
      // Show error message
      console.log("Invalid form");
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Invalid form");
    }
  }
}
