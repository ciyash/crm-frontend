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
  totalGrand: number = 0;


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
    this.calculateTotal();

  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
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



  totalQuantity: number = 0;

  calculateTotal() {
    this.totalGrand = 0;
    this.totalQuantity = 0;
  
    this.gdata.forEach(item => {
      this.totalGrand += item.grandTotal || 0;
  
      if (item.packages && Array.isArray(item.packages)) {
        item.packages.forEach((pkg: { quantity: any; }) => {
          this.totalQuantity += pkg.quantity || 0;
        });
      }
    });
  }
  



}
