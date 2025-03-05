import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private baseUrl = environment.baseUrl
  private storageKey = 'adminData';

  constructor(private http: HttpClient ,private route:Router ) {}

  // Generic function to handle all POST API calls
  postData(endpoint: string, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${endpoint}`;
    return this.http.post(apiUrl, data);
  }

  getData(endpoint: string, paramsObj?: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`; // Ensure no leading slash
    let params = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach((key) => {
        params = params.append(key, paramsObj[key]);
      });
    }
  
    return this.http.get(apiUrl, { params });
  }

  // Save data to localStorage
  saveAdminData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));

  }
  signout(){
  window.localStorage.clear();
  this.route.navigateByUrl('/login')
  }

  // Get data from localStorage
  getAdminData(): any {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : null;
  }

  // Clear data from localStorage
  clearAdminData() {
    localStorage.removeItem(this.storageKey);
  }
}


