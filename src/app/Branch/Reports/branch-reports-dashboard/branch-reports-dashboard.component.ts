import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-branch-reports-dashboard',
  templateUrl: './branch-reports-dashboard.component.html',
  styleUrls: ['./branch-reports-dashboard.component.scss']
})
export class BranchReportsDashboardComponent {
  form:FormGroup;
  citydata:any;
  data:any;
    constructor(private api: BranchService, private fb: FormBuilder, private router:Router) {
          this.form = this.fb.group({
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            fromCity: ['', Validators.required],
            toCity: ['', Validators.required],
            bookingStatus: ['', Validators.required],
            bookingType: ['', Validators.required],
          });
        }

  ngOnInit(){
    this.api.GetCities().subscribe((res:any)=>{
      console.log('citydata',res);
      this.citydata=res;
  });
  }

  VoucherLoad() {
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      bookingStatus: this.form.value.bookingStatus,
      bookingType: this.form.value.bookingType,
    };
  
    console.log('Final Payload:', payload);
    
    this.api.ParcelBookingReport(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        // alert('Parcel Loaded Successfully!');
        this.data=response;
        
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('Parcel Loading Failed. Please try again.');
      },
    });
  }

  printgrnData(id:any){
    this.router.navigateByUrl('/printvouchersdata/'+id);
  }

}
