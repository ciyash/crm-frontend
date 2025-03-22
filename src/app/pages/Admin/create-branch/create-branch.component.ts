import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  id:any;
  ubdata:any;
  form1:FormGroup;
  errorsMessage:string='';
  msg:string='';
  visible: boolean = false;
  repd:any;
  showDialog(row:any) {
      this.visible = true;
      this.repd=row;
  }
  constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router, private bapi:BranchService, private activeroute:ActivatedRoute){
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

          this.form1 = this.fb.group({
            name: ['', ],
            branchType: ['',],
            city: ['',],
            location: ['',],
            address: ['',],
            phone: ['',],
            email: ['', ],
            pincode: ['', ],
            state: ['', ],
            country:['India'],
            alternateMobile: ['', ],
              });
  }

  ngOnInit(){
    this.id = this.activeroute.snapshot.params['name'];
    this.bapi.GetBranch().subscribe((res:any)=>{
      console.log('branch',res);
      this.data=res;
      this.loading=false;
    })

  }

getbranchemployees(id:any){
  this.api.GetUnderBranchEmployees(id).subscribe((res:any)=>{
    console.log('underbranch',res);
    this.ubdata=res;
  });
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


  edit(id:any) {
    console.log(this.form1.value);
    if (this.form1.valid) {
      const val = {
        name: this.form1.value.name,
      branchType: this.form1.value.branchType,
      city: this.form1.value.city,
      location: this.form1.value.location,
      address: this.form1.value.address,
      phone: this.form1.value.phone,
      email: this.form1.value.email,
      pincode: this.form1.value.pincode,
      state: this.form1.value.state,
      country: this.form1.value.country,
      alternateMobile: this.form1.value.alternateMobile,
      };
      this.api.UpdateBranch(id, val).subscribe(
        (a: any) => {
          if (a?.data) {
            console.log(a);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Branch Update Successfully' });
           
          } else {
            console.log(a);
            // this.errorMessage = a.msg.message;
            this.msg = 'Branch Successfully Updated !!!';
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/createbranch']);
              });
              }, 1000);
          }
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Branch not added' });
          this.errorsMessage = err.error.message;
        },
      );
    }

    return false;
  }

  Delete(id:any) {
    this.api.DeleteBranch(id).subscribe(
      (a: any) => {
        if (a) {
          console.log('deletedid',a);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Delete Branch Type Successfully' });
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/createbranch']);
            });
            }, 1000);
        } else {
          console.log(a);
          // this.errorMessage = a.msg.message;
          this.msg = 'Branch Successfully Updated !!!';
        }
      },
      (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Delete Branch Type Somthing wrong' });
      },
    );
  return false;
}


}
