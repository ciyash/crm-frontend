import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminService } from 'src/app/service/admin.service';
import { AuthService } from 'src/app/service/auth.service';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent {

   form:FormGroup;
    branchdata:any;
    edata:any;
    loading:boolean=true;
    form1:FormGroup;
    visible: boolean = false;
    repd:any;
    constructor(private fb:FormBuilder, private api:AdminService,
       private messageService:MessageService, private router:Router,
        private bapi:BranchService, private auth:AuthService, private toastr: ToastrService){
        this.form = this.fb.group({
          name: ['', Validators.required],
          username: ['', Validators.required],
          branchId: [''],
          location: ['', Validators.required],
          password: ['', Validators.required],
          phone: ['', Validators.required],
          email: ['', Validators.required],
          documents: ['', Validators.required],
          role: ['', Validators.required],
          // companyName:['', Validators.required],
            });

            this.form1 = this.fb.group({
              name: ['', Validators.required],
              username: ['', Validators.required],
              branchId: [''],
              location: ['', Validators.required],
              password: ['', Validators.required],
              phone: ['', Validators.required],
              email: ['', Validators.required],
              documents: ['', Validators.required],
              role: ['', Validators.required],
              companyName:[''],

                });
    }
    ngOnInit(){
      this.branchData();

      this.api.GetEmployeesData().subscribe((res: any) => {
        console.log('empdata', res);
        this.edata = res.map((employee: any) => {
          employee.showPassword = false; // Initialize show/hide 
          return employee;
        });
        this.loading = false;
      });
    }

  showDialog(row: any) {
    this.visible = true;
    this.repd = row;
  
    console.log("employeedata:", this.repd);
  
    this.form1.patchValue({
      name: row.name,
      username: row.username,
      branchId: row.branchId?._id || '', // Assuming branchId is an object
      location: row.location,
      password: row.password,
      phone: row.phone,
      email: row.email,
      documents: Array.isArray(row.documents) ? row.documents.join(', ') : row.documents,
      role: row.role,
      companyName: row.companyId?.name || ''
    });
  }
  
    togglePassword(index: number) {
      this.edata[index].showPassword = !this.edata[index].showPassword;
    }
  

    branchData() {
      this.bapi.getData('branch').subscribe({
        next: (response: any) => {
          console.log('Branch Data:', response);
          this.branchdata = response;
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
        // companyName:this.form.value.companyName
      };
      console.log('Final Payload:', payload);
      this.api.createEmployee(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.toastr.success('Parcel loaded successfully', 'Success');

          // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Employee successfully' });
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

    // edit(id:any) {
    //   const payload = {
    //     name: this.form.value.name,
    //     username: this.form.value.username,
    //     branchId: this.form.value.branchId,
    //     location: this.form.value.location,
    //     password: this.form.value.password,
    //     phone: this.form.value.phone,
    //     email: this.form.value.email,
    //     documents: this.form.value.documents,
    //     role: this.form.value.role,
    //     companyName:this.form1.value.companyName
    //   };
    
    //   console.log('Final Payload:', payload);
      
    //   this.api.UpdateEmployee(id,payload).subscribe({
    //     next: (response: any) => {
    //       console.log('Parcel loaded successfully:', response);
    //       this.toastr.success('Parcel loaded successfully', 'Success');

    //       // this.messageService.add({ severity: 'success', summary: 'success', detail: 'Create Employee successfully' });
    //       setTimeout(() => {
    //        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //          this.router.navigate(['/createemployee']);
    //        });
    //      }, 500);
    //     },
    //     error: (error: any) => {
    //       console.error('Create Employee failed:', error);
    //       alert('Create Employee Failed. Please try again.');
    //     },
    //   });
    // }

    edit() {
      const payload = {
        name: this.form1.value.name,
        username: this.form1.value.username,
        branchId: this.form1.value.branchId,
        location: this.form1.value.location,
        password: this.form1.value.password,
        phone: this.form1.value.phone,
        email: this.form1.value.email,
        documents: this.form1.value.documents,
        role: this.form1.value.role,
        companyName: this.form1.value.companyName
      };
    
      console.log('Final Payload:', payload);
    
      this.api.UpdateEmployee(payload).subscribe({
        next: (response: any) => {
          console.log('Employee updated successfully:', response);
          this.toastr.success('Employee updated successfully', 'Success');
    
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/createemployee']);
            });
          }, 500);
        },
        error: (error: any) => {
          console.error('Update Employee failed:', error);
          alert('Update Employee Failed. Please try again.');
        },
      });
    }
    
}
