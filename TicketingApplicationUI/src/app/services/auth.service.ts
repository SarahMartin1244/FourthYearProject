import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7134/api/User/";
  constructor(private http: HttpClient, private router: Router) { }
  signUp(userObj: any) {
     return this.http.post<any>(`${this.baseUrl}SignUp`, userObj);
   // return this.http.post<any>(this.baseUrl+'register',userObj); 
  }
  

login(loginObj: any){
  return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);

}
storeToken(tokenValue: string) {
  localStorage.setItem('token', tokenValue);
}

getToken() {
  return localStorage.getItem('token');
}

isLoggedIn(): boolean {
  return !!localStorage.getItem('token') 
}

signOut() {
  localStorage.clear();
  this.router.navigate(['login']);
}


  // Add getUsers method to fetch users
  GetUsers() {
    return this.http.get<any[]>(`${this.baseUrl}GetUsers`);
  }
}
