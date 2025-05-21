import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Toast, ToastrService } from 'ngx-toastr';

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
  today: Date = new Date();
  readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';




  constructor(
    private api: BranchService,
    private router: Router,
    private toast: ToastrService // Inject ToastrService
  ) {
    const gstDataString = localStorage.getItem('gstData');
  
    if (gstDataString) {
      try {
        const parsedData = JSON.parse(gstDataString);
        this.reportData = parsedData?.data || {};
        console.log("Received data:", this.reportData);
  
        this.toast.success(parsedData?.message || 'Report loaded successfully.');
      } catch (e) {
        console.error("Parsing error:", e);
        this.toast.error('Failed to parse stored report data.');
      }
    } else {
      this.toast.warning('No report data found in local storage.');
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

  exportFullReportToExcel(): void {
    const rows: any[][] = [];

    // Header: Company Info
    if (this.pfdata) {
      rows.push([this.pfdata.companyName]);
      rows.push([`Address: ${this.pfdata.location} - ${this.pfdata.branchId?.name} | Phone No: ${this.pfdata.phone}`]);
    }

    rows.push(['']);
    rows.push(['CATEGORY SUMMARY']);
    rows.push(['CATEGORY', 'TOTAL LR', 'TOTAL QUANTITY', 'TOTAL AMOUNT']);

    const summary = this.reportData?.byBookingType || {};
    rows.push(['Credit', summary.credit?.totalRecords || 0, summary.credit?.totalQuantity || 0, summary.credit?.grandTotal || 0]);
    rows.push(['FOC', summary.foc?.totalRecords || 0, summary.foc?.totalQuantity || 0, summary.foc?.grandTotal || 0]);
    rows.push(['Paid', summary.paid?.totalRecords || 0, summary.paid?.totalQuantity || 0, summary.paid?.grandTotal || 0]);
    rows.push(['ToPay', summary.toPay?.totalRecords || 0, summary.toPay?.totalQuantity || 0, summary.toPay?.grandTotal || 0]);

    if (this.reportData.total) {
      rows.push(['Total', this.reportData.total.totalRecords, this.reportData.total.totalQuantity, this.reportData.total.grandTotal]);
    }

    rows.push(['']);
    rows.push(['DETAILED REPORT']);
    rows.push(['Sr. No', 'WB No.', 'Manual TicketNo.', 'Received Date', 'Source', 'Destination', 'Consignor', 'Consignee', 'WB Type', 'Amount', 'Pkgs', 'Days']);

    this.paginatedBookings.forEach((item: any, index: number) => {
      rows.push([
        (this.currentPage - 1) * this.itemsPerPage + index + 1,
        item['WB No.'],
        item['Manual TicketNo.'],
        item['Received Date'],
        item['Source'],
        item['Destination'],
        item['Consignor'],
        item['Consignee'],
        item['WB Type'],
        item['Amt'],
        item['Pkgs'],
        item['Days']
      ]);
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Delivery Report': worksheet },
      SheetNames: ['Delivery Report']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `Delivery_Report_${this.formatDate(this.today)}.xlsx`;
    const blob: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
    FileSaver.saveAs(blob, fileName);
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().slice(0, 10);
  }
}
