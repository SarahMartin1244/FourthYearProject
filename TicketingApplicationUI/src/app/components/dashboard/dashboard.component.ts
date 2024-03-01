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
  public users: any = [];
  public tickets: any = [];

  public fullName: string = "";
  public subject: string = "";

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit() {
    this.api.GetUsers().subscribe(res => {
      this.users = res;
    });

    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.GetTicketsForUser();
  }
  

  GetTicketsForUser() {
    const userId = this.auth.getLoggedInUserId();
    console.log('userId:', userId); // Log the userId before making the API call
    if (userId) {
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
  
  
  
  
  
  
  

  logout() {
    this.auth.signOut();
  }

  CreateTicket() {
    this.auth.logTicket();
  }

  ViewTickets() {
    this.auth.viewTickets();
  }
}