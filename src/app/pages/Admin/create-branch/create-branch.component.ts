import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent {
  form:FormGroup;
  branchdata:any;
  constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router){
      this.form = this.fb.group({
        name: ['', Validators.required],
        branchType: ['', Validators.required],
        city: ['', Validators.required],
        location: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        pincode: ['', Validators.required],
        state: ['', Validators.required],
        country:['India'],
        alternateMobile: ['', Validators.required],
          });
  }

  ngOnInit(){

  }



  Add() {
    const payload = {
      name: this.form.value.name,
      branchType: this.form.value.branchType,
      city: this.form.value.city,
      location: this.form.value.location,
      address: this.form.value.address,
      phone: this.form.value.phone,
      email: this.form.value.email,
      pincode: this.form.value.pincode,
      state: this.form.value.state,
      country: this.form.value.country,
      alternateMobile: this.form.value.alternateMobile,
    };
  
    console.log('Final Payload:', payload);
    
    this.api.createBranch(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Branch successfully' });
        setTimeout(() => {
         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
           this.router.navigate(['/createbranch']);
         });
       }, 500);
      },
      error: (error: any) => {
        console.error('Create Branch failed:', error);
        alert('Create Branch Failed. Please try again.');
      },
    });
  }
  

}
