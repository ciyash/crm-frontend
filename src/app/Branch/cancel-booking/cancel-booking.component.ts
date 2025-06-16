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
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.scss'],
})
export class CancelBookingComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
 
  searchTerm: string = '';
  searchResult: any[] = [];
  data2: any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  updata: any;
  form: FormGroup;
  emplooyee: any;
  todayDate: string = '';
  employee: any;
  branchdata: any;
  citydata: any;
  onPickupBranchSelect: any;
  pdata: any;
  tbcdata: any;
  form1!:FormGroup;
  showReceiptToPrint = false;
  pfdata: any;
  today=new Date

  
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
  }

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toLocaleDateString('en-GB'); 
    this.form1 = this.fb.group({
      refundCharge: ['', Validators.required],
      refundAmount: ['', Validators.required],
      cancelDate: [this.todayDate, Validators.required], // ✅ Now this will work
      cancelByUser: ['', Validators.required],
      cancelBranch: ['', Validators.required],
      cancelCity: ['', Validators.required],
      remarks: ['']
    });

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
    this.getProfileData();
  }
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('Profile Data:', this.pfdata);
    });
  }
 

  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('Search Term:', this.searchTerm);

      this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log('API Response:', res);

          // If `res` is an object, extract the data into an array
          // if (res && Array.isArray(res.data)) {
          //   this.data2 = res.data;
          //   console.log('data2:', this.data2);
          //   this.errorMessage = '';
          // } else if (res && typeof res === 'object') {
          //   this.data2 = [res]; // Wrap the object into an array
          //   this.errorMessage = '';
          if (res && res.booking) {
            this.data2 = [res.booking]; // Now each item is booking itself
          } else {
            this.data2 = [];
          }
          
          // } else {
          //   this.data2 = [];
          //   this.errorMessage = 'No results found for the given search term.';
          // }
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
    this.admin.GetEmployees().subscribe({
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


  // cancelbooking() {
  //   const payload1 = {
  //     ...this.form1.value,
  //     grnNo: this.searchTerm 
  //   };
  //   console.log('Cancel Payload:', payload1);
  //   this.api.BookingCancel(payload1, this.searchTerm).subscribe(
  //     (res) => {
  //       console.log('Booking cancelled successfully:', res);
  //       this.toast.success("Parcel successfully cancelled");
  //     },
  //     (err) => {
  //       console.error('Error cancelling booking:', err);
  //     }
  //   );
  // }
  cancelbooking() {
    const payload1 = {
      ...this.form1.value,
      grnNo: this.searchTerm 
    };
    console.log('Cancel Payload:', payload1);
  
    this.api.BookingCancel(payload1, this.searchTerm).subscribe(
      (res) => {
        console.log('Booking cancelled successfully:', res);
        this.toast.success("Parcel successfully cancelled");
  
        // Reset the form and other related fields
        this.form1.reset();
        this.searchTerm = '';  // Optional: clear the search term input
      },
      (err) => {
        console.error('Error cancelling booking:', err);
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
  
  
  
  printReceipt() {
    this.showReceiptToPrint = true;

    setTimeout(() => {
      const printContents = document.getElementById('printSection')?.innerHTML;
      const originalContents = document.body.innerHTML;

      if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload(); // Reset Angular bindings
      }
    }, 100);
  }
  

  
}











  
  

   
   


  
 








  










 



  
 

 



 
  


  


  
  
