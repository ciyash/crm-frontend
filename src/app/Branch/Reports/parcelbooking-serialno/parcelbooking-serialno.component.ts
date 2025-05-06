import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcelbooking-serialno',
  templateUrl: './parcelbooking-serialno.component.html',
  styleUrls: ['./parcelbooking-serialno.component.scss']
})
export class ParcelbookingSerialnoComponent {
  data2: any[] = []; // Explicitly define data2 as an array
  today = new Date();
  pfdata: any;
  paidBookings: any;
  creditBookings: any;
  topayBookings: any;
  focBookings: any;
  clrBookings: any;

  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data2'];
    this.data2=stateData
    console.log("datareciverd:",this.data2);
    this.paidBookings = stateData.data.paid.bookings;
this.creditBookings = stateData.data.credit.bookings;
this.focBookings = stateData.data.FOC.bookings;
this.clrBookings = stateData.data.CLR.bookings;
this.topayBookings = stateData.data.topay?.bookings || []; // Add topay if exists


    

    
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