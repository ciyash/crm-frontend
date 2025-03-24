import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

const AUTH_API = 'https://cargo-backend-bpq4.onrender.com/'
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  constructor(private http:HttpClient) { }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'subadmin-auth/login',
      {
        identifier: identifier,
        password: password,
      },
      httpOptions
    );
  }

  decodeToken(token: string) {
    return this.jwtHelper.decodeToken(token);
  }

  
}
