import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  id: any;
  isEditable: boolean = false;

  data: any;
  form: FormGroup;
  form1: FormGroup;
  ALLbranchdata: any[] = [];
  msg1: string = '';
  errorMessage1: string = '';
  errorsMessage: any;
  msg: any;

  constructor(
    private api: AdminService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      companyName: [''],
      name: [''],
      username: [''],
      location: [''],
      address: [''],
      email: [''],
      phone: [''],
      branchId: ['']
    });

    this.form1 = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.activeroute.snapshot.params['id'];

    this.api.GetProfileData().subscribe((res: any) => {
      this.data = res;
      this.form.patchValue({
        companyName: res.companyId?.name,
        name: res.name,
        username: res.username,
        location: res.location,
        address: res.address,
        email: res.email,
        phone: res.phone,
        branchId: res.branchId?._id
      });
      this.form.disable(); // Disable form initially
    });
  
    this.api.ALLGetBranch().subscribe((res: any) => {
      this.ALLbranchdata = res;
    });
  }
  
  enableEditing() {
    this.isEditable = true;
    this.form.enable(); // Enables all controls
  }
  

  edit() {
    if (this.form.valid) {
      const val = {
        companyName: this.form.value.companyName,
        name: this.form.value.name,
        username: this.form.value.username,
        location: this.form.value.location,
        address: this.form.value.address,
        phone: this.form.value.phone,
        email: this.form.value.email,
        branchId: this.form.value.branchId,
      };
  
      this.api.UpdateAdminProfile(val).subscribe(
        (a: any) => {
          if (a?.data) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile Updated Successfully' });
            
            // ✅ Reset to read-only mode
            this.isEditable = false;
            this.form.disable();
          } else {
            this.msg = 'Profile Successfully Updated !!!';
            this.toastr.success('Profile Successfully Updated', 'Success');
  
            // ✅ Reset to read-only mode
            this.isEditable = false;
            this.form.disable();
          }
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Profile update failed' });
          this.errorsMessage = err.error.message;
        }
      );
    }
    return false;
  }
  

  changePassword() {
    this.errorMessage1 = ''; // clear previous error
  
    if (this.form1.valid) {
      const { oldPassword, newPassword } = this.form1.value;
  
      // Check if old and new passwords are the same
      if (oldPassword === newPassword) {
        this.errorMessage1 = 'New password must be different from old password.';
        return; // prevent API call
      }
  
      this.api.ChangePassword({ oldPassword, newPassword }).subscribe({
        next: (res) => {
          this.form1.reset();
          this.toastr.success('Password Successfully Updated!', 'Success');
        },
        error: (err) => {
          this.errorMessage1 = err.error.message || 'Password update failed';
          this.toastr.error(this.errorMessage1, 'Error');
        }
      });
    }
  }
  
  
}
