import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']  // Use 'styleUrls' instead of 'styleUrl'
})
export class DashboardComponent implements OnInit {
  public users: any = [];

  constructor(private api : ApiService, private auth: AuthService) {}

  ngOnInit() {
    this.api.GetUsers().subscribe(res => {  
      this.users = res;
    });
  }

  logout() {
    this.auth.signOut();
  }
}
