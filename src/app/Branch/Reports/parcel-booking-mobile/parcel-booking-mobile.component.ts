import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-booking-mobile',
  templateUrl: './parcel-booking-mobile.component.html',
  styleUrls: ['./parcel-booking-mobile.component.scss']
})
export class ParcelBookingMobileComponent {
  data: any[] = []; // Renamed from data6 to data
  today = new Date();
  fromDate: string | null = null;
  toDate: string | null = null;
  printBy: string = 'Unknown';
  pfdata: any;

  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data2']; // Adjust key if needed

    // Ensure data is an array
    this.data = Array.isArray(stateData) ? stateData : stateData ? [stateData] : [];
    console.log('Received:', this.data);

    // Extract header values
    this.fromDate = navigation?.extras?.state?.['fromDate'] || null;
    this.toDate = navigation?.extras?.state?.['toDate'] || null;
    this.printBy = navigation?.extras?.state?.['printBy'] || 'Ravi';
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