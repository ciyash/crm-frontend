import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-loading-offline-report',
  templateUrl: './parcel-loading-offline-report.component.html',
  styleUrls: ['./parcel-loading-offline-report.component.scss']
})
export class ParcelLoadingOfflineReportComponent implements OnInit {
  data2: any[] = []; 
  today = new Date();
  pfdata: any;
  printTable: any;
  fromDate: any;
  toDate: any;

  constructor(private router: Router, private api: BranchService) {}

  ngOnInit() {
    this.getProfileData();

    const localData = localStorage.getItem('parcelReportData');
    if (localData) {
      const stateData = JSON.parse(localData);
      console.log("Loaded from localStorage:", stateData);
      this.data2 = stateData?.data || [];
      this.fromDate = stateData.fromDate;
      this.toDate = stateData.toDate;

      // Optional: Clear the storage if it's one-time use
      localStorage.removeItem('parcelReportData');
    } else {
      console.warn("No report data found in localStorage.");
    }
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
