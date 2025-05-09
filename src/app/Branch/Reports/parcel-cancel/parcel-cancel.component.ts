import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-cancel',
  templateUrl: './parcel-cancel.component.html',
  styleUrls: ['./parcel-cancel.component.scss']
})
export class ParcelCancelComponent {
  today = new Date();
  fromDate: string | null = null;
  toDate: string | null = null;
  printBy: string = 'Unknown'; // Default value, can be dynamic
  pfdata: any;
  data4: any;

  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data4'];
    this.data4=stateData.data

    console.log('Received:', stateData);
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