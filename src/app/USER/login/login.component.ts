import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
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
  form1:FormGroup;
  form2:FormGroup;
  otpFormVisible = false; 
  errorMessage: string = '';
  isLoggedIn: boolean = false;
 
  constructor(private fb: FormBuilder, private authService: AuthService, private token:TokenService, private router :Router, private api:AdminService) {
    this.form1=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.form2=this.fb.group({
      email: ['', Validators.required],
      otp:['', Validators.required],
      newPassword:['', Validators.required],
    });
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
  

  forgotpassword() {
    const payload = { email: this.form1.value.email };
    console.log('Final Payload:', payload);

    this.api.Forgotemailentry(payload).subscribe({
      next: (response: any) => {
        console.log('OTP Mail sent successfully:', response);
        alert('OTP Mail sent Successfully!');

        // Set email value in form2 and show OTP form
        this.form2.patchValue({ email: this.form1.value.email });
        this.otpFormVisible = true;
      },
      error: (error: any) => {
        console.error('Incorrect Mail failed:', error);
        alert('Incorrect Mail. Please try again.');
      },
    });
  }

  resetpassword() {
    const payload = {
      email: this.form2.value.email,
      otp: this.form2.value.otp,
      newPassword: this.form2.value.newPassword
    };

    console.log('Final Payload:', payload);

    this.api.resetPassword(payload).subscribe({
      next: (response: any) => {
        console.log('Reset Password successfully:', response);
        alert('Reset Password Successfully!');

        // Close modal after reset
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
          (modal as any).classList.remove('show');
          (modal as any).setAttribute('aria-hidden', 'true');
          document.body.classList.remove('modal-open');
          document.querySelector('.modal-backdrop')?.remove();
        }

        // Reset form and switch back to email form
        this.otpFormVisible = false;
        this.form1.reset();
        this.form2.reset();
      },
      error: (error: any) => {
        console.error('Reset Password failed:', error);
        alert('Reset Password failed. Please try again.');
      },
    });
  }
  
  
}
