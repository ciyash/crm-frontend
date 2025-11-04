import { Component, OnInit } from '@angular/core';
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
export class CreateEmployeeComponent implements OnInit {
  form: FormGroup;
  form1: FormGroup;
  branchdata: any[] = [];
  edata: any[] = [];
  loading = true;
  visible = false;
  repd: any;
  updatedemployeee: any;

  constructor(
    private fb: FormBuilder,
    private api: AdminService,
    private messageService: MessageService,
    private router: Router,
    private bapi: BranchService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      branchId: [''],
      location: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      documents: ['', Validators.required],
      role: ['', Validators.required],
      companyName: ['', Validators.required]
    });

    // this.form1 = this.fb.group({
    //   name: ['', Validators.required],
    //   username: ['', Validators.required],
    //   branchId: [''],
    //   location: ['', Validators.required],
    //   password: ['', Validators.required],
    //   phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
    //   email: ['', [Validators.required, Validators.email]],
    //   documents: ['', Validators.required],
    //   role: ['', Validators.required],
    //   companyName: ['', Validators.required]
    // });
    this.form1 = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      branchId: [''],
      location: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      documents: ['', Validators.required],
      role: ['', Validators.required],
      companyName: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    this.branchData();

    // this.api.GetEmployees().subscribe({
    //   next: (res: any) => {
    //     console.log('API Response:', res);
    //     this.edata = res.map((employee: any) => {
    //       return { ...employee, showPassword: false };
    //     });
    //     this.loading = false;
    //     console.log("emplo:",this.edata)
    //   },
    //   error: (err: any) => {
    //     console.error('API Error:', err);
    //     this.loading = false;
    //   }
    // });

    this.api.GetEmployees().subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
    
        // Only keep non-admin employees
        this.edata = res
          .filter((employee: any) => employee.role !== 'admin')
          .map((employee: any, index: number) => {
            return { ...employee, showPassword: false, serialNo: index + 1 };
          });
    
        this.loading = false;
        console.log("emplo:", this.edata);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    });
    

  }

  branchData(): void {
    this.bapi.getData('branch').subscribe({
      next: (res: any) => {
        this.branchdata = res;
      },
      error: (err) => {
        console.error('Error fetching branch data:', err);
      }
    });
  }

  allowOnlyDigits(event: any): void {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  togglePassword(index: number): void {
    this.edata[index].showPassword = !this.edata[index].showPassword;
  }



  showDialog(row: any): void {
    this.visible = true;
    this.repd = row;
    this.form1.patchValue({
      _id: row._id,
  
      name: row.name,
      username: row.username,
      branchId: row.branchId?._id || '',
      location: row.location,
      password: row.password,
      phone: row.phone,
      email: row.email,
      documents: Array.isArray(row.documents) ? row.documents.join(', ') : row.documents,
      role: row.role,
      companyName: row.companyId?.name || ''
    });
  }

  Add(): void {
    if (this.form.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Warning');
      return;
    }

    const payload = this.form.value;
    console.log('Creating Employee:', payload);

    this.api.createEmployee(payload).subscribe({
      next: (res) => {
        this.toastr.success('Employee created successfully', 'Success');
        this.reload();
      },
      error: (err) => {
        console.error('Create Employee failed:', err);
        this.toastr.error('Failed to create employee', 'Error');
      }
    });
  }

  edit(): void {
    if (!this.repd || !this.repd._id) {
      this.toastr.error('No employee selected for update.', 'Error');
      return;
    }
    const payload = {
      _id: this.repd._id,
      ...this.form1.value
    };
    console.log("payload:",payload);
    this.api.UpdateEmployee(payload).subscribe({
      next: (res) => {
        this.updatedemployeee=res
        console.log("updatedemployeee:",this.updatedemployeee)
        this.toastr.success('Employee updated successfully', 'Success');
        this.reload();
      },
      error: (err) => {
        console.error('Update Employee failed:', err);
        this.toastr.error('Failed to update employee', 'Error');
      }
    });
  }

  reload(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/createemployee']);
      });
    }, 500);
  }

}
