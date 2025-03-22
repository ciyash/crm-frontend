import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-cityname',
  templateUrl: './create-cityname.component.html',
  styleUrls: ['./create-cityname.component.scss']
})
export class CreateCitynameComponent {
        bdata:any;
        form:FormGroup;
        loading:boolean=true;
        constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router, private bapi:BranchService,private toastr:ToastrService){
            this.form = this.fb.group({
              cityName: ['', Validators.required],
              state: ['', Validators.required],
                });
        }
      
        ngOnInit(){
          this.bapi.GetCities().subscribe((res:any)=>{
            console.log('cities', res);
            this.bdata=res;
            this.loading=false;
          })
        }
      
        Add() {
          const payload = {
            cityName: this.form.value.cityName,
            state: this.form.value.state,
          };
        
          console.log('Final Payload:', payload);
          
          this.api.createCityname(payload).subscribe({
            next: (response: any) => {
              console.log('Parcel loaded successfully:', response);

              this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create City successfully' });
              this.toastr.success('Create City successfully', 'Success');

              setTimeout(() => {
               this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                 this.router.navigate(['/createcity']);
               });
             }, 500);
            },
            error: (error: any) => {
              console.error('Create City failed:', error);
              // alert('Create City Failed. Please try again.');
              this.toastr.error('Create City Failed!', 'Error');

            },
          });
        }

}
