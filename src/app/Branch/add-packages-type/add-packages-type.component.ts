import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { HeaderComponent } from "../../USER/header/header.component";

@Component({
  selector: 'app-add-packages-type',
  templateUrl: './add-packages-type.component.html',
  styleUrls: ['./add-packages-type.component.scss'],
})
export class AddPackagesTypeComponent {

   form:FormGroup;
   form1:FormGroup;
    branchdata:any;
    data:any;
    loading:boolean=true;
    id:any;
    ubdata:any;
    errorsMessage:string='';
    msg:string='';
    visible: boolean = false;
    repd:any;
    showDialog(row:any) {
        this.visible = true;
        this.repd=row;
    }
    constructor(private fb:FormBuilder, private api:BranchService, private messageService:MessageService, private router:Router, private bapi:BranchService, private activeroute:ActivatedRoute){
        this.form = this.fb.group({
          name: ['', Validators.required],
            });
            this.form1 = this.fb.group({
              name: ['', Validators.required],
                });
    }
  
    ngOnInit(){
      this.bapi.GetPAckagesType().subscribe((res:any)=>{
        console.log('packages',res);
        this.data=res;
        this.loading=false;
      })
  
    }
  
 
  
    Add() {
      const payload = {
        name: this.form.value.name,
      };
      console.log('Final Payload:', payload);
      this.api.packageType(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Packages Type successfully' });
          
          setTimeout(() => {
           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
             this.router.navigate(['/addpackagestype']);
           });
         }, 500);
        },
        error: (error: any) => {
          console.error('Create Packages Type failed:', error);
          alert('Create Packages Type Failed. Please try again.');
        },
      });
    }


    edit(id:any) {
      console.log(this.form1.value);
      if (this.form1.valid) {
        const val = {
          name: this.form1.value.name,
        };
        this.api.UpdatePackagestype(id, val).subscribe(
          (a: any) => {
            if (a?.data) {
              console.log(a);
              this.messageService.add({ severity: 'success', summary: 'success', detail: 'Packages Type Update Successfully' });
             
            } else {
              console.log(a);
              // this.errorMessage = a.msg.message;
              this.msg = 'Packages Type Successfully Updated !!!';
              setTimeout(() => {
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/addpackagestype']);
                });
                }, 1000);
            }
          },
          (err: any) => {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Packages Type not added' });
            this.errorsMessage = err.error.message;
          },
        );
      }
  
      return false;
    }

    Delete(id:any) {
      this.api.DeletePackagesType(id).subscribe(
        (a: any) => {
          if (a) {
            console.log('deletedid',a);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Delete Packages Type Successfully' });
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/addpackagestype']);
              });
              }, 1000);
          } else {
            console.log(a);
            // this.errorMessage = a.msg.message;
            this.msg = 'Products Successfully Updated !!!';
          }
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Delete Packages Type Somthing wrong' });
        },
      );
    return false;
  }
  



}
