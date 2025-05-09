import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-status-date-report',
  templateUrl: './status-date-report.component.html',
  styleUrls: ['./status-date-report.component.scss']
})
export class StatusDateReportComponent {
    pfdata: any;
    gdata: any[] = [];
    fromDate: any;
    toDate: any;
    today = new Date(); 
  
    constructor(private router: Router, private api: BranchService) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras?.state as { data: any };
  
      console.log('Received data:', state?.data);
  
      const fullData = state?.data;
      this.gdata = fullData?.data || [];
      this.fromDate = fullData?.fromDate;
      this.toDate = fullData?.toDate;
    }
  
    ngOnInit() {
      this.getProfileData();
  
      if (this.gdata?.length) {
        this.gdata = this.gdata.map((item: any) => {
          const bookingDate = new Date(item.bookingDate);
          const loadingDate = new Date(item.loadingDate);
          const unloadingDate = new Date(item.unloadingDate);
          const deliveryDate = new Date(item.deliveryDate);
  
          return {
            ...item,
            status: item.deliveryDate ? 'Delivered' : 'In Progress',
            days1: this.dateDiffInDays(bookingDate, loadingDate),
            days2: this.dateDiffInDays(loadingDate, unloadingDate),
            days3: this.dateDiffInDays(unloadingDate, deliveryDate)
          };
        });
      }
    }
  
    dateDiffInDays(d1: Date, d2: Date): number {
      const diff = Math.abs(d2.getTime() - d1.getTime());
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
  
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.pfdata = res;
        console.log('profiledata:', this.pfdata);
      });
    
  }
}  
