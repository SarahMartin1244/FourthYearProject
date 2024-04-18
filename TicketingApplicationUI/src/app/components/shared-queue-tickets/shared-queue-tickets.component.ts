import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-shared-queue-tickets',
  templateUrl: './shared-queue-tickets.component.html',
  styleUrls: ['./shared-queue-tickets.component.scss']
})
export class SharedQueueTicketsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  isDropdownOpen = false;
  public tickets: any[] = [];
  public dataSource = new MatTableDataSource<any>(); // Create a new MatTableDataSource

  public fullName: string = "";
  public searchTerm: string = ''; // Search term input by the user

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // Fetch full name of user from AuthService
    this.fullName = this.auth.getfullNameFromToken();

    // Fetch shared queue tickets
    this.getSharedQueueTickets();
  }

  getSharedQueueTickets() {
    // Call the API to fetch shared queue tickets
    this.api.getSharedQueueTickets().subscribe(
      res => {
        console.log('Shared queue tickets:', res); // Log the response from the API
        this.tickets = res;
        this.dataSource.data = this.tickets; // Update dataSource with fetched tickets
        if (this.paginator) {
          this.dataSource.paginator = this.paginator; // Set paginator after receiving tickets data
        }
      },
      error => {
        console.error('Error fetching shared queue tickets:', error); // Log any errors that occur during the subscription
      }
    );
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

  displayedColumns: string[] = ['ticketId', 'subject', 'owner', 'description', 'priority', 'assignedTo', 'dateCreated', 'dateResolved', 'status'];
}
