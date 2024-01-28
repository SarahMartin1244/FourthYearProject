import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import ValidateForm from '../../helpers/validateform';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  ticketForm: FormGroup;
  ticketCreated: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private userStore: UserStoreService) {
    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {}

  // onCreateTicket() {
  //   if (this.ticketForm.valid) {
  //     const ticketData = this.ticketForm.value;
  //     console.log('Creating ticket:', ticketData);

  //     this.auth.createTicket(ticketData).subscribe(
  //       data => {
  //         console.log('Ticket created successfully');
  //         this.ticketCreated = true; // Set the flag to true
  //         this.ticketForm.reset();
  //         // Optionally, you can redirect to another page after successful creation.
  //         // this.router.navigate(['dashboard']);
  //       },
  //       err => {
  //         console.error('Error creating ticket:', err);
  //       }
  //     );
  //   }
  // }

  // onLogin() {
  //   if (this.loginForm.valid) {
  //     console.log(this.loginForm.value)

  //     // Send object to the database
  //     this.auth.login(this.loginForm.value)
  //       .subscribe({
  //         next: (res) => {
  //           alert(res.message);
  //           this.loginForm.reset();
  //           this.auth.storeToken(res.token);
  //           const tokenPayload = this.auth.decodedToken();
  //           this.userStore.setFullNameForStore(tokenPayload.name);
  //           this.userStore.setRoleForStore(tokenPayload.role);
  //           this.router.navigate(['dashboard']);
  //         },
  //         error: (err) => {
  //           alert(err?.error.message);
  //         }
  //       });
  //   } else {
  //     // Show error message
  //     console.log("Invalid form");
  //     ValidateForm.validateAllFormFields(this.loginForm);
  //     alert("Invalid form");
  //   }
  // }


  onCreateTicket() {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      
      this.auth.createTicket(ticketData).subscribe(
        (res) => {
          alert(res.message);
          this.ticketForm.reset();
        },
        (err) => {
          console.error('Error creating ticket:', err);
        }
      );
    }
  }
  

  toDashboard() {
    this.auth.onDashboard();
  }
}
