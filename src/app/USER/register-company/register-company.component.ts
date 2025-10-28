import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent implements OnInit {
    Form: FormGroup;
    companyname:any;
    constructor(
      private fb: FormBuilder,
      private api: AdminService,
      private toastr: ToastrService,
    ) {
      this.Form = this.fb.group({
        phone: ['', Validators.required],
        address: ['', Validators.required],
        state: ['', Validators.required],
        customerName: ['', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        parentCompanyId: ['', Validators.required]
      });
    }
  
    ngOnInit(): void {
    }
    createCompany(): void {
      try {
        if (this.Form.invalid) {
          this.toastr.error('Please fill all required fields');
          return;
        }
        const payload = this.Form.value; 
        console.log('payload:', payload);
    
        this.api.AddCompany(payload).subscribe({
          next: (res) => {
            console.log("companyData:", res);
            this.companyname=res
            console.log("companyData:", this.companyname);


            this.toastr.success('Company created successfully!');
            this.Form.reset();
          },
          error: (err) => {
            console.error('HTTP error:', err);
            // Show specific backend message if available
            const errorMsg = err?.error?.msg || 'Error creating company';
            this.toastr.error(errorMsg);
          }
        });
      } catch (error) {
        this.toastr.error('Unexpected error occurred');
        console.error('Caught error:', error);
      }
    }
    
    
    
  }

  
