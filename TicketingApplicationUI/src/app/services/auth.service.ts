import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "https://localhost:7134/api/User/";
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}SignUp`, userObj);
  }

  login(loginObj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  // Add getUsers method to fetch users
  GetUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetUsers`);
  }

decodedToken(){
 const jwtHelper = new JwtHelperService();
const token = this.getToken()!;
 return jwtHelper.decodeToken(token)
}

  getfullNameFromToken() {

    if(this.userPayload) {
      return this.userPayload.name;
    }

  }

  getRoleFromToken() {

    if(this.userPayload) {
    return this.userPayload.role;
    }

  }


  // getfullNameFromToken(): string | null {
  //   const firstName = this.userPayload ? this.userPayload.FirstName : null;
  //   const lastName = this.userPayload ? this.userPayload.LastName : null;
  
  //   return firstName && lastName ? `${firstName} ${lastName}` : null;
  // }
}
