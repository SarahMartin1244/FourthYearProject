import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Base URL for user-related API endpoints
  private baseUrl: string = "https://localhost:7134/api/User/";

  // Base URL for ticket-related API endpoints
  private ticketUrl = "https://localhost:7134/api/Ticket/";

  constructor(private http: HttpClient) { }

  // Method to fetch all users
  GetUsers() {
    return this.http.get<any>(this.baseUrl);
  }

  // Method to fetch tickets for a specific user
  GetTicketsForUser(userId: string) {
    // Include the userId in the URL
    return this.http.get<any>(`${this.ticketUrl}GetTicketsForUser/${userId}`);
  }
}
