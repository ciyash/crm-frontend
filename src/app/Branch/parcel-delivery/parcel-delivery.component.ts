import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { AdminService } from 'src/app/service/admin.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 
import {  ElementRef, ViewChild, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-parcel-delivery',
  templateUrl: './parcel-delivery.component.html',
  styleUrls: ['./parcel-delivery.component.scss']
})
export class ParcelDeliveryComponent {
  searchTerm: string = '';
  searchResult: any[] = [];
  data2: any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  updata: any;
  form: FormGroup;
  form2:FormGroup
  emplooyee: any;
  todayDate: string = '';
  employee: any;
  branchdata: any;
  citydata: any;
  onPickupBranchSelect: any;
  pdata: any;
  tbcdata: any;
  form1!:FormGroup
  
  constructor(
    private api: BranchService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private admin: AdminService,
    private toast:ToastrService,
  ) {

    this.form = this.fb.group({
      grnNo: ['', Validators.required],
    });
    this.form2 = this.fb.group({
      grnNo: ['', Validators.required],
      receiverName1: [''],
      receiverMobile1: [''],
      lrNumber: [''],

    });
  }

  ngOnInit(): void {
    this.searchTerm = this.activeroute.snapshot.params['grnNo'];
    this.api.GetCities().subscribe((res:any)=>{
      console.log('citys',res);
      this.citydata=res;
    });
    //get branches
    this.api.GetBranch().subscribe((res:any)=>{
      console.log(res);
      this.branchdata=res;
      
    });

    this.GetAllEmployee();
  }
 

  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('Search Term:', this.searchTerm);

      this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log('API Response:', res);

          // If `res` is an object, extract the data into an array
          if (res && Array.isArray(res.data)) {
            this.data2 = res.data;
            console.log('data2:', this.data2);
            this.errorMessage = '';
          } else if (res && typeof res === 'object') {
            this.data2 = [res]; // Wrap the object into an array
            this.errorMessage = '';
          } else {
            this.data2 = [];
            this.errorMessage = 'No results found for the given search term.';
          }
        },
        (err: any) => {
          this.errorMessage =
            err.error?.message || 'An error occurred while searching.';
          this.data2 = [];
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid search term.';
      this.data2 = [];
    }
  }
  getStatusLabel(status: number): string {
    const statusLabels = [
      'booking',
      'loading',
      'unloading',
      'missing',
      'delivery',
      'cancel',
    ];
    return statusLabels[status] || 'unknown';
  }

  GetAllEmployee() {
    this.admin.GetEmployeesData().subscribe({
      next: (res) => {
        console.log('Employee data:', res);
        this.employee = res;
        console.log('employeeData:', this.employee);
      },
      error: (err) => {
        console.error('Error fetching employee data:', err);
        this.errorMessage = 'Failed to fetch employee data.';
      },
    });
  }

  updateParcelStatus() {
    const payload = {
      grnNo: this.form2.value.grnNo,
      receiverName1: this.form2.value.receiverName1,
      receiverMobile1: this.form2.value.receiverMobile1,
    };
    console.log('Final Payload:', payload);
  
    this.api.ReceivedParcelUpdate(payload).subscribe(
      (res: any) => {
        console.log('Update Status:', res);
        this.updata = res;
        if (res.message) {
          this.toast.success(res.message, 'Success');
        } else {
          this.toast.success('Parcel status updated successfully', 'Success');
        }
      },
      (error) => {
        console.error('Error updating status:', error);
  
        if (error.error && error.error.message) {
          this.toast.error(error.error.message, 'Error');
        } else {
          this.toast.error('Failed to update parcel status', 'Error');
        }
      }
    );
  }


  onFromcitySelect(event: any) {
    const selectedCity = event.target.value;
    console.log('Selected City:', selectedCity);
    if (selectedCity) {
      this.api.GetBranchbyCity(selectedCity).subscribe(
        (res: any) => {
          console.log('Branches for selected city:', res);
          this.pdata = res;
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    }
  }
  
  
  
  

  
}











  
  

   
   


  
 








  










 



  
 

 



 
  


  


  
  

