import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private apiservice: BranchService, private route :Router) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  onSubmit() {
    debugger;
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid credentials';
      return;
    }
    const loginData = {
      identifier: this.loginForm.value.identifier,
      password: this.loginForm.value.password,
    };
  
    this.apiservice.postData('subadmin-auth/login', loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response); 
        this.route.navigateByUrl('/booking');
        this.apiservice.saveAdminData(response);
  
        // Redirect or show success message
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Invalid credentials. Please try again.';
      },
    });
  }
  
  
}
