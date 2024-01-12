import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup
  constructor(private fb: FormBuilder) { }
  

  ngOnInit(): void {
    this.loginForm = this.fb.group({
     username: ['', Validators.required],
     password: ['', Validators.required]
    })
  }
  hideShowPass(){

    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";

  }

  onSubmit(){
    if(this.loginForm.valid) {
// send object to database
console.log(this.loginForm.value)
    }
      else{



        // show error message

        console.log("Invalid form")

        ValidateForm.validateAllFormFields(this.loginForm);
        alert("Invalid form")
  
      }

  }

 

}

