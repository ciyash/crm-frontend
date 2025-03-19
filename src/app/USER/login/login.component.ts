import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form!: FormGroup;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
 
  constructor(private fb: FormBuilder, private authService: AuthService, private token:TokenService, private router :Router) {
 
  }

  ngOnInit(){
    this.form = this.fb.group({
      identifier: ['', Validators.required], // Set default value as empty string
      password: ['', Validators.required]
    });
  }
 
  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
  
    const { identifier, password } = this.form.value;
  
    this.authService.login(identifier, password).subscribe({
      next: (response: any) => {
        // ✅ Save token
        this.token.saveToken(response.token);
  
        // ✅ Save role as user object
        const user = {
          role: response.role, // Save role properly
          location: response.location || null, // Optional fields
          branchName: response.branchName || null, // Optional fields
          branchLocation: response.branchLocation || null, // Optional fields
        };
        this.token.saveUser(user);
  
        // ✅ Get the role and navigate
        const role = this.token.getRole();
        console.log('Role:', role);
  
        switch (role) {
          case 'admin':
            this.router.navigate(['/createbranch']);
            break;
          case 'subadmin':
            this.router.navigate(['/subdashboard']);
            break;
          case 'employee':
            this.router.navigate(['/booking']);
            break;
          default:
            this.router.navigate(['/login']);
            break;
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed';
      },
    });
  }
  
  
  
}
