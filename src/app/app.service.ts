import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({providedIn: "root"})
export class AppService {

  constructor(private http: HttpClient) {}

  isValidEmail(email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/isValidEmail?email=${email}`);
  }

  isValidMobileNumber(mobileNumber: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/isValidMobileNumber?mobileNumber=${mobileNumber}`);
  }

  register(body: any): Observable<any> {
    return  this.http.post(`${environment.apiUrl}/register`, body);
  }
}
