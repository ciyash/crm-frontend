import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-incoming-report',
  templateUrl: './parcel-incoming-report.component.html',
  styleUrls: ['./parcel-incoming-report.component.scss']
})
export class ParcelIncomingReportComponent {
  gdata: any[] = [];
  pfdata: any;
  today = new Date();
  prow:any;


  constructor(private router: Router, private api: BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: any };

    if (state?.data) {
      console.log('Received Data:', state.data);

      this.gdata = Object.values(state.data).filter(item =>
         typeof item === 'object' && item !== null && !Array.isArray(item));
      console.log('Parsed gdata:', this.gdata);
      this.prow=state.data
      console.log("ggg:",this.prow);
      
    }
  }


  
  
  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
    });
  }

}
