import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private apiservice: ServiceService) {
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
        // Save login data if needed
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
