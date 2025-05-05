import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-all-parcel-booking-report',
  templateUrl: './all-parcel-booking-report.component.html',
  styleUrls: ['./all-parcel-booking-report.component.scss']
})
export class AllParcelBookingReportComponent {
  data1: any;
  pfdata: any;
  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    this.data1 = navigation?.extras?.state?.['data1'];

    console.log('Received:', this.data1);
  }
  today = new Date();
  
  // ngoninit(){
  //   this.getProfileData()
  // }
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log( 'profiledata:',this.pfdata);
    });
  }

}
