import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.scss']
})
export class CreateVehicleComponent {

   form:FormGroup;
      branchdata:any;
      vdata:any;
      loading:boolean=true;
      form1:FormGroup;
      errorsMessage:string='';
      msg:string='';
      visible: boolean = false;
      repd:any;
      showDialog(row:any) {
          this.visible = true;
          this.repd=row;
      }
      constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router, private bapi:BranchService){
          this.form = this.fb.group({
            vehicleNo: ['', Validators.required],
            vehicleType: ['', Validators.required],
            registrationNo: ['', Validators.required],
            date: ['', Validators.required],
            RC: ['', Validators.required],
            polutionExpDate: ['', Validators.required],
            fuelType: ['', Validators.required],
            branch: ['', Validators.required],
            vehicleStatus: ['active'],
              });

              this.form1 = this.fb.group({
                vehicleNo: [''],
                vehicleType: [''],
                registrationNo: [''],
                date: [''],
                RC: [''],
                polutionExpDate: [''],
                fuelType: [''],
                branch: [''],
                vehicleStatus: ['active'],
                  });
      }
    
      ngOnInit(){
        this.branchData();
        this.bapi.VehicleData().subscribe((res:any)=>{
          console.log('vdata',res);
          this.vdata=res;
          this.loading=false;
        })
      }
    
      branchData() {
        this.bapi.getData('branch').subscribe({
          next: (response: any) => {
            console.log('Branch Data:', response);
            this.branchdata = response; // Ensure response contains an array of branches
          },
          error: (error: any) => {
            console.error('Error fetching branch data:', error);
          }
        });
      }
    
      Add() {
        const payload = {
          vehicleNo: this.form.value.vehicleNo,
          vehicleType: this.form.value.vehicleType,
          registrationNo: this.form.value.registrationNo,
          date: this.form.value.date,
          RC: this.form.value.RC,
          polutionExpDate: this.form.value.polutionExpDate,
          fuelType: this.form.value.fuelType,
          branch: this.form.value.branch,
          vehicleStatus: this.form.value.vehicleStatus,
        };
      
        console.log('Final Payload:', payload);
        
        this.api.createVehicle(payload).subscribe({
          next: (response: any) => {
            console.log('Parcel loaded successfully:', response);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Vehicle successfully' });
            setTimeout(() => {
             this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
               this.router.navigate(['/createvehicle']);
             });
           }, 500);
          },
          error: (error: any) => {
            console.error('Create Vehicle failed:', error);
            alert('Create Vehicle Failed. Please try again.');
          },
        });
      }

      edit(id:any) {
        console.log(this.form1.value);
        if (this.form1.valid) {
          const val = {
            vehicleNo: this.form1.value.vehicleNo,
          vehicleType: this.form1.value.vehicleType,
          registrationNo: this.form1.value.registrationNo,
          date: this.form1.value.date,
          RC: this.form1.value.RC,
          polutionExpDate: this.form1.value.polutionExpDate,
          fuelType: this.form1.value.fuelType,
          branch: this.form1.value.branch,
          vehicleStatus: this.form1.value.vehicleStatus,
          };
          this.api.UpdateVehicle(id, val).subscribe(
            (a: any) => {
              if (a?.data) {
                console.log(a);
                this.messageService.add({ severity: 'success', summary: 'success', detail: 'Vehicle Update Successfully' });
                setTimeout(() => {
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['/createvehicle']);
                  });
                  }, 1000);
              } else {
                console.log(a);
                // this.errorMessage = a.msg.message;
                this.msg = 'Vehicle Successfully Updated !!!';
              }
            },
            (err: any) => {
              this.messageService.add({ severity: 'error', summary: 'error', detail: 'Vehicle not added' });
              this.errorsMessage = err.error.message;
            },
          );
        }
    
        return false;
      }

}
