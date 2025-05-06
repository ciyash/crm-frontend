import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-regularcustomer-booking',
  templateUrl: './regularcustomer-booking.component.html',
  styleUrls: ['./regularcustomer-booking.component.scss']
})
export class RegularcustomerBookingComponent {
  data7: any;
  data: any[] = [];
  fromDate: any;
  toDate: any;
  message: string = '';
  today = new Date();
  pfdata: any;

  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    this.data7 = navigation?.extras?.state?.['data7'];
    console.log('Received customer:', this.data7);

    if (this.data7?.data?.length) {
      this.data = this.data7.data;
      this.fromDate = this.data[0].bookingDate;
      this.toDate = this.data[this.data.length - 1].bookingDate;
    } else {
      this.message = this.data7?.message || 'No parcel booking data available.';
    }
  }
  ngOnInit(){
    this.getProfileData()
  }
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.pfdata = res;
        console.log( 'profiledata:',this.pfdata);
      });
    }
}
