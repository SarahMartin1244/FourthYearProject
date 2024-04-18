import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
    private userStore: UserStoreService
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
// get the assigned tickets from the api called updateassignqueue and display them in the table 
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

  displayedColumns: string[] = ['ticketId', 'owner', 'description', 'priority', 'assignedTo', 'dateCreated', 'dateResolved', 'status'];
}
