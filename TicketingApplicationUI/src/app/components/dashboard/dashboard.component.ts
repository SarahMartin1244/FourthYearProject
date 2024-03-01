import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']

})

export class DashboardComponent implements OnInit {
 isDropdownOpen = false;
  public users: any = [];
  public tickets: any = [];
  public departments: any = [];

  public fullName: string = "";
  public subject: string = "";

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit() {
    // Fetch users from API
    this.api.GetUsers().subscribe(res => {
      this.users = res;
    });

    // Fetch full name of user from store
    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    // Fetch tickets for the logged-in user
    this.GetTicketsForUser();
  }

  GetTicketsForUser() {
    // Get the user ID of the logged-in user
    const userId = this.auth.getLoggedInUserId();
    console.log('userId:', userId); // Log the userId before making the API call
    if (userId) {
      // Fetch tickets for the user
      this.api.GetTicketsForUser(userId).subscribe(
        res => {
          console.log('res:', res); // Log the response from the API
          this.tickets = res;
        },
        error => {
          console.error('Error fetching tickets:', error); // Log any errors that occur during the subscription
        }
      );
    }
  }

  

  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = event.type === 'mouseenter';
  }

  // Logout the user
  logout() {
    this.auth.signOut();
  }

  // Log a ticket
  CreateTicket() {
    this.auth.logTicket();
  }

  // View tickets
  ViewTickets() {
    this.auth.viewTickets();
  }
}
