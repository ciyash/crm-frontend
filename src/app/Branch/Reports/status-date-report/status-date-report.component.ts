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
  

  printReport() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin!.document.open();
      popupWin!.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              /* You can include more styles here as needed */
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
  
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
              }
  
              th, td {
                border: 1px solid #000;
                padding: 4px;
                text-align: center;
              }
  
              h4, h6, p {
                margin: 4px 0;
              }
  
              .text-center {
                text-align: center;
              }
  
              .fw-bold {
                font-weight: bold;
              }
  
              .text-decoration-underline {
                text-decoration: underline;
              }
  
              .d-flex {
                display: flex;
                justify-content: space-between;
              }
  
              @media print {
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin!.document.close();
    }
  }
}  
