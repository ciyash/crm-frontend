import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-parcel-booking-summary',
  templateUrl: './parcel-booking-summary.component.html',
  styleUrls: ['./parcel-booking-summary.component.scss']
})
export class ParcelBookingSummaryComponent {
  today = new Date();
  pfdata: any;
  summaryData: any[] = []; // now it's always an array
  fromDate: string = '';
  toDate: string = '';
  constructor(private router: Router, private api: BranchService, private location: Location) {}
  ngOnInit(): void {
    const navState = this.location.getState() as any;
    if (navState?.data5) {
      const rawData = navState.data5;
      const dataArray = [];
      for (const key in rawData) {
        if (!isNaN(+key)) {
          dataArray.push(rawData[key]);
        }
      }
      this.summaryData = dataArray;
      this.fromDate = rawData.fromDate;
      this.toDate = rawData.toDate;
      console.log('Parsed Summary Data:', this.summaryData);
    } else {
      console.warn('No summary data found in navigation state.');
    }

    this.getProfileData();
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
              body { font-family: Arial; margin: 20px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid #000; padding: 4px; text-align: center; }
              h4, h6, p { margin: 4px 0; }
              .text-center { text-align: center; }
              .fw-bold { font-weight: bold; }
              .text-decoration-underline { text-decoration: underline; }
              .d-flex { display: flex; justify-content: space-between; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body onload="window.print(); window.close();">${printContents}</body>
        </html>
      `);
      popupWin!.document.close();
    }
  }
}
