import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// chandu api 
const AUTH_API = 'https://cargo-logistics-zsqp.onrender.com/';
const login_API = 'https://cargo-logistics-zsqp.onrender.com/';



                      // new api
// const login_API = 'https://cargobackend-9kxq.onrender.com/';
// const AUTH_API = 'https://cargobackend-9kxq.onrender.com/';

// const AUTH_API = 'http://3.109.182.152:4000/';
// const login_API = 'http://3.109.182.152:4000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
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
 
  Companylogin(payload:
    { email: string; password: string }): Observable<any> {
    return this.http.post(
      login_API + 'company/subsidiary/login',
      payload,
      httpOptions
    );
  }

  

}