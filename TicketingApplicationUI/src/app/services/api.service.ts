// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private baseUrl: string = "https://localhost:7134/api/User/";
  constructor(private http: HttpClient) { }
 
  GetUsers() {
    return this.http.get<any>(this.baseUrl);
  }
  }
