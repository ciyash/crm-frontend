import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-delivery-stock-report',
  templateUrl: './delivery-stock-report.component.html',
  styleUrls: ['./delivery-stock-report.component.scss']
})
export class DeliveryStockReportComponent implements OnInit {
  reportData: any = { formattedBookings: [] };
  pfdata: any;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private api: BranchService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: any };
    this.reportData = state?.data?.data || { formattedBookings: [] };
    console.log('pending stock:', this.reportData);
  }

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
    });
  }

  get paginatedBookings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.reportData?.formattedBookings?.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil((this.reportData?.formattedBookings?.length || 0) / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
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


