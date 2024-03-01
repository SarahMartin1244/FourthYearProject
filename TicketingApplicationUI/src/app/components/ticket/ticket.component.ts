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
    // Initialize the ticket form with validation rules
    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {}

  // Function to handle ticket creation
  onCreateTicket() {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      
      // Send ticket data to the backend
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

  // Function to navigate to the dashboard
  toDashboard() {
    this.auth.onDashboard();
  }
}
