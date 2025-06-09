import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';
// 
@Component({
  selector: 'app-company-login',
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.scss']
})
export class CompanyLoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private api: AuthService,
    private router: Router,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  CompanyLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }
    this.errorMessage = '';
    const payload = this.loginForm.value;

    this.api.Companylogin(payload).subscribe({
      next: (res: any) => {
        this.token.saveToken(res.token);
        this.token.setCompanyLoginFlag(); // ✅ Mark as company login (admin role)
        this.router.navigate(['/create-admin']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login failed. Please try again.';
      }
    });
    
    
    
  }

 
}
