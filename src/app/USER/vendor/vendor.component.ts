import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent {
  Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: AdminService,
    private toastr: ToastrService,
  ) {
    this.Form = this.fb.group({
      name: ['', Validators.required],
      companyName: ['', Validators.required],
      displayName: ['', Validators.required],
      address: ['', Validators.required],
      workPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      bankDetails: this.fb.group({
        accountNumber: ['', Validators.required],
        accountName: ['', Validators.required],
        bankName: ['', Validators.required],
        branchName: ['', Validators.required],
        ifscCode: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      })
    });
  }

  createVendor() {
    if (this.Form.invalid) {
      this.toastr.error('Please fill all required fields correctly!', 'Form Invalid');
      return;
    }

    this.api.vendorCreation(this.Form.value).subscribe({
      next: (res) => {
        this.toastr.success('Vendor created successfully!', 'Success');
        this.Form.reset();
      },
      error: (err) => {
        this.toastr.error('Failed to create vendor. Try again!', 'Error');
        console.error(err);
      }
    });
  }






  

}
