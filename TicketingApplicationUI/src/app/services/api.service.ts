import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = "https://localhost:7134/api/User/";
  private ticketUrl = "https://localhost:7134/api/Ticket/";

  constructor(private http: HttpClient) { }

  GetUsers() {
    return this.http.get<any>(this.baseUrl);
  }

  GetTicketsForUser(userId: string) {
    // Include the userId in the URL
    return this.http.get<any>(`${this.ticketUrl}GetTicketsForUser/${userId}`);
  }
}
