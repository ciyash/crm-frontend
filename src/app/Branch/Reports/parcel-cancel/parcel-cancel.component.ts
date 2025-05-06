import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-cancel',
  templateUrl: './parcel-cancel.component.html',
  styleUrls: ['./parcel-cancel.component.scss']
})
export class ParcelCancelComponent {
  data4: any[] = []; // Renamed to 'data4' for consistency and clarity
  today = new Date();
  fromDate: string | null = null;
  toDate: string | null = null;
  printBy: string = 'Unknown'; // Default value, can be dynamic
  pfdata: any;

  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data4'];

    // Ensure data4 is an array
    this.data4 = Array.isArray(stateData) ? stateData : stateData ? [stateData] : [];
    console.log('Received:', this.data4);

    // Extract fromDate and toDate from navigation state (if passed from form7)
    this.fromDate = navigation?.extras?.state?.['fromDate'] || null;
    this.toDate = navigation?.extras?.state?.['toDate'] || null;
    // Set printBy dynamically if available (e.g., from user session)
    this.printBy = navigation?.extras?.state?.['printBy'] || 'Ravi'; // Fallback to 'Ravi'
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