import { Component } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-vocher-details-report',
  templateUrl: './vocher-details-report.component.html',
  styleUrls: ['./vocher-details-report.component.scss']
})
export class VocherDetailsReportComponent {
  pfdata: any;
  today= new Date;
  vocherReport:any;
  constructor(private api:BranchService){
  }

  ngOnInit(): void {
    const data = localStorage.getItem('voucherDetails');
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('Loaded voucher data:', parsedData);
      this.vocherReport=parsedData
      console.log("vocherReport:",this.vocherReport)
      

    } else {
      console.warn('No voucher data found in localStorage');
    }
    this.getProfileData();

  }
  
getProfileData() {
  this.api.GetProfileData().subscribe((res: any) => {
    this.pfdata = res;
  });
}

}
