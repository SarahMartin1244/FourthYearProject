import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  isDropdownOpen = false;
  public users: any = [];
  public tickets: any = [];
  public dataSource = new MatTableDataSource<any>(); // Create a new MatTableDataSource

  public fullName: string = "";
  public searchTerm: string = ''; // Search term input by the user

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) { }

  ngOnInit() {
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
          this.dataSource.data = this.tickets; // Update dataSource with fetched tickets
          if (this.paginator) {
            this.dataSource.paginator = this.paginator; // Set paginator after receiving tickets data
          }
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

  logout() {
    this.auth.signOut();
  }

  CreateTicket() {
    this.auth.logTicket();
  }

  ViewTickets() {
    this.auth.viewTickets();
  }

  applyFilter() {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => {
      return data.subject.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
    
    // Reset paginator to first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  displayedColumns: string[] = ['ticketId', 'subject', 'owner', 'priority', 'assignedTo', 'dateCreated', 'dateResolved', 'status'];
}
