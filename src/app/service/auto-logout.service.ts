import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

 
  private timeoutId: any;
  private readonly timeoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor(private router: Router, private tokenStorageService: TokenService) {
    this.initListeners();
  }

  // Initialize event listeners for user activity
  private initListeners() {
    window.addEventListener('mousemove', this.resetTimeout.bind(this));
    window.addEventListener('keypress', this.resetTimeout.bind(this));
    window.addEventListener('click', this.resetTimeout.bind(this));

    this.startTimeout();
  }

  // Reset the inactivity timer when user performs an action
  private resetTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.startTimeout();
  }

  // Start the inactivity timer
  private startTimeout() {
    this.timeoutId = setTimeout(() => {
      this.logoutUser();
    }, this.timeoutDuration);
  }

  // Log out the user after inactivity
  private logoutUser() {
    console.log('Session expired due to inactivity. Logging out...');
    this.tokenStorageService.signOut(); // Clear token/session
    this.router.navigate(['/login']); // Redirect to login page
  }

}
