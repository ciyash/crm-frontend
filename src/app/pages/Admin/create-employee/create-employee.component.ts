import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent {

   form:FormGroup;
    branchdata:any;
    constructor(private fb:FormBuilder, private api:AdminService, private messageService:MessageService, private router:Router, private bapi:BranchService){
        this.form = this.fb.group({
          name: ['', Validators.required],
          username: ['', Validators.required],
          branchId: ['', Validators.required],
          location: ['', Validators.required],
          password: ['', Validators.required],
          phone: ['', Validators.required],
          email: ['', Validators.required],
          documents: ['', Validators.required],
          role: ['', Validators.required],
            });
    }
  
    ngOnInit(){
      this.branchData();
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
        name: this.form.value.name,
        username: this.form.value.username,
        branchId: this.form.value.branchId,
        location: this.form.value.location,
        password: this.form.value.password,
        phone: this.form.value.phone,
        email: this.form.value.email,
        documents: this.form.value.documents,
        role: this.form.value.role,
      };
    
      console.log('Final Payload:', payload);
      
      this.api.createEmployee(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Employee successfully' });
          setTimeout(() => {
           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
             this.router.navigate(['/createemployee']);
           });
         }, 500);
        },
        error: (error: any) => {
          console.error('Create Employee failed:', error);
          alert('Create Employee Failed. Please try again.');
        },
      });
    }

}
