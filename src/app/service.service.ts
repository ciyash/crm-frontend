import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private baseUrl = environment.baseUrl.replace(/\/$/, ''); // Ensure no trailing slash
  private storageKey = 'adminData';

  constructor(private http: HttpClient) {}

  // Generic function to handle all POST API calls
  postData(endpoint: string, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${endpoint}`;
    return this.http.post(apiUrl, data);
  }
  
  getData(endpoint: string, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${endpoint}`;
    return this.http.get(apiUrl, data);
  }

  // Save data to localStorage
  saveAdminData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
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
