import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']  // Use 'styleUrls' instead of 'styleUrl'
})
export class DashboardComponent implements OnInit {
  public users: any = [];

  public fullName : string = "";
  constructor(private api : ApiService, private auth: AuthService, private userStore : UserStoreService) {}

  ngOnInit() {
    this.api.GetUsers().subscribe(res => {  
      this.users = res;
    });

    this.userStore.getFullNameFromStore()
    .subscribe(val => {
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken
    })
  }

  logout() {
    this.auth.signOut();
  }

  CreateTicket() {
   this.auth.logTicket();
  }
}
