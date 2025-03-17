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
  constructor(private fb: FormBuilder, private authService: AuthService, private token:TokenService, private route :Router) {
 
  }

  ngOnInit(){
    this.form = new FormGroup({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
    });
  }
 
  onSubmit(): void {
    const f = this.form.value;
    this.authService.login(f.identifier, f.password).subscribe((res) => {
        this.token.saveToken(res.token);
        this.token.saveUser(res);
        console.log(res);
        this.reloadPage();
        // this.router.navigate(['/dashboard']);
        // this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoggedIn = false;
      }
    );
  }
  reloadPage(): void {
    this.route.navigateByUrl('/booking');
  }
  
}
