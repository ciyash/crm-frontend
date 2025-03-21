import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  data:any;
  loading:boolean=true;
  constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router, private bapi:BranchService,private toast:ToastrService){
      this.form = this.fb.group({
        name: ['', Validators.required],
        branchType: ['', Validators.required],
        city: ['', Validators.required],
        location: ['', Validators.required],
        address: ['', Validators.required],
        
        phone: ['', [Validators.required,Validators.pattern(/^[6-9]\d{9}$/) // Ensures only numbers and starts with 6-9
      ]],
      email: ['', [Validators.required, Validators.email]],
        pincode: ['', Validators.required],
        state: ['', Validators.required],
        country:['India'],
        alternateMobile: ['', Validators.required],
          });
  }

  ngOnInit(){
    this.bapi.GetBranch().subscribe((res:any)=>{
      console.log(res);
      this.data=res;
      this.loading=false;
    })

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
        this.toast.success('Success Created Branch', 'Success!');

        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Branch successfully' });
        setTimeout(() => {
         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
           this.router.navigate(['/createbranch']);
         });
       }, 500);
      },
      error: (error: any) => {
        console.error('Create Branch failed:', error);
        this.toast.error('Create Branch Failed', 'Oops!');
      },
    });
  }


 

  sanitizePhoneNumber() {
    let phoneControl = this.form.get('phone');
    if (phoneControl) {
      phoneControl.setValue(phoneControl.value.replace(/[^0-9]/g, ''), { emitEvent: false });
    }
  }

  }



  


