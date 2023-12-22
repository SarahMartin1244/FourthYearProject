// app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    // Perform authentication logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    // Add authentication logic, e.g., call a service to validate credentials
  }
}
