import { Component } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  // loginForm: FormGroup;
  // errorMessage: string = '';

  // constructor(private fb: FormBuilder, private apiservice: ServiceService) {
  //   this.loginForm = this.fb.group({
  //     identifier: ['', Validators.required],
  //     password: ['', Validators.required],
  //   });
  // }
  // Submit() {
  //   debugger;
  //   if (this.loginForm.valid) {
  //     this.apiservice
  //       .branch(this.loginForm.value.identifier, this.loginForm.value.password)
  //       .subscribe({
  //         next: (response) => {
  //           console.log('Login successful', response);
  //           localStorage.setItem('token', response.token);
  //         },
  //         error: (error) => {
  //           console.error('Login failed', error);
  //           this.errorMessage = 'Invalid credentials. Please try again.';
  //         },
  //       });
  //   }
  // }
}
