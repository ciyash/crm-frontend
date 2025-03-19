import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const AUTH_API = 'https://cargo-backend-bpq4.onrender.com/'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient ,private route:Router, private token:TokenService) { }

  createBranch(value: {
    name: string;
    branchType: string;
    city: string;
    location: string;
    address: string;
    phone: number;
    email: string;
    pincode: number;
    state: string;
    country: string;
    alternateMobile: number;
  }) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
  
    return this.http.post(
      AUTH_API + 'branch',  
      { 
        name: value.name,
        branchType: value.branchType,
        city: value.city,
        location: value.location,
        address: value.address,
        phone: value.phone,
        email: value.email,
        pincode: value.pincode,
        state: value.state,
        country: value.country,
        alternateMobile: value.alternateMobile
      },
      httpOptions 
    );
  }


  createEmployee(value: {
    name: string;
    username: string;
    branchId: string;
    location: string;
    phone: number;
    email: string;
    password: string;
    documents: string;
    role: string;
  }) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
  
    return this.http.post(
      AUTH_API + 'subadmin-auth/signup',  
      { 
        name: value.name,
        username: value.username,
        branchId: value.branchId,
        location: value.location,
        phone: value.phone,
        email: value.email,
        password: value.password,
        documents: value.documents,
        role: value.role,
      },
      httpOptions 
    );
  }

  
  




}
