import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-add-cfmaster',
  templateUrl: './add-cfmaster.component.html',
  styleUrls: ['./add-cfmaster.component.scss'],
})
export class AddCfmasterComponent {

  form:FormGroup;
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
            gst: ['',],
            country: ['India'],
            state:['', Validators.required],
            city:['', Validators.required],
            code:['', ],
            name:['', Validators.required],
            // phone:['', Validators.required],
            email:['', Validators.required],
            address:['', Validators.required],
            senderName:['', Validators.required],
            // senderMobile:['', Validators.required],
            senderMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            creditDaysLimit:['', Validators.required],
            exDate:['', Validators.required],
              });
      }
    
      ngOnInit(){
      }
      allowOnlyNumbers(event: KeyboardEvent): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
          event.preventDefault();
          return false;
        }
        return true;
      }
      
      
    
      Add() {
        const payload = {
          gst: this.form.value.gst,
          country: this.form.value.country,
          state : this.form.value.state,
          city: this.form.value.city,
          code : this.form.value.code,
          name: this.form.value.name,
          email : this.form.value.email,
          phone: this.form.value.phone,
          address : this.form.value.address,
          senderName: this.form.value.senderName,
          senderMobile : this.form.value.senderMobile,
          creditDaysLimit: this.form.value.creditDaysLimit,
          exDate : this.form.value.exDate,
        };
        console.log('Final Payload:', payload);
        this.api.AddCfmaster(payload).subscribe({
          next: (response: any) => {
            console.log('Master successfully:', response);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create CF Master Type successfully' });
            
            setTimeout(() => {
             this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
               this.router.navigate(['/getcfmasterdata']);
             });
           }, 500);
          },
          error: (error: any) => {
            console.error('Create Master Type failed:', error);
            alert('Create Master Type Failed. Please try again.');
          },
        });
      }
  
  
     

}
