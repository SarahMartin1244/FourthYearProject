import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import ValidateForm from '../../helpers/validateform';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
  
})
export class TicketComponent implements OnInit {

  ticketForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
  
  }

  onCreateTicket() {
    if (this.ticketForm.valid) {
     
    const ticketData = this.ticketForm.value;
    console.log('Creating ticket:', ticketData);
    this.auth.createTicket(ticketData).subscribe(
      data => {
        console.log('Ticket created successfully');
        this.ticketForm.reset();
      },
      err => {
        console.error('Error creating ticket:', err);
      }
    );
   
  }
}

  toDashboard() {
    this.auth.onDashboard();
   }
}
