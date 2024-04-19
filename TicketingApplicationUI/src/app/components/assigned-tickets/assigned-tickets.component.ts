import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assigned-tickets',
  templateUrl: './assigned-tickets.component.html',
  styleUrls: ['./assigned-tickets.component.scss']
})
export class AssignedTicketsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  isDropdownOpen = false;
  public fullName: string = "";
  public searchTerm: string = '';
  public dataSource = new MatTableDataSource<any>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Fetch full name of user from store
    this.userStore.getFullNameFromStore().subscribe(val => {
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    // Fetch tickets for the logged-in user
    this.fetchAssignedTickets();
  }

  fetchAssignedTickets() {
    this.api.updateassignqueue().subscribe((data: any) => {
      this.dataSource.data = data;
    });
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

  resolveTicket(ticketId: number | null) {
    if (ticketId !== null) {
      this.api.resolveTicket(ticketId).subscribe(
        res => {
          console.log('Ticket resolved successfully:', res);
          // Update the ticket status to "Resolved"
          const ticketIndex = this.dataSource.data.findIndex((ticket: any) => ticket.ticketID === ticketId);
          if (ticketIndex !== -1) {
            this.dataSource.data[ticketIndex].status = 'Resolved';
            // Show a snackbar notification
            this.snackBar.open('Ticket resolved successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        },
        error => {
          console.error('Error resolving ticket:', error);
          // Show an error snackbar notification
          this.snackBar.open('Failed to resolve ticket. Please try again later.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      );
    } else {
      console.error('Invalid ticket ID');
    }
  }

  displayedColumns: string[] = ['ticketId', 'owner', 'description', 'priority', 'assignedTo', 'dateCreated', 'dateResolved', 'status', 'resolve'];
}
