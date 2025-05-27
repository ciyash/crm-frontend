import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
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

      if (stateData) {
        this.data2 = stateData.data || [];
        this.fromDate = stateData.fromDate;
        this.toDate = stateData.toDate;
      
        // Don't remove here to persist after refresh
        // localStorage.removeItem('parcelReportData');
      }
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



ExportEXcel(): void {
  const headerData = [];

  // Add company details
  if (this.pfdata) {
    headerData.push([this.pfdata.companyName]);
    headerData.push([
      `Address: ${this.pfdata.location} - ${this.pfdata.branchId?.name} | Phone No: ${this.pfdata.phone}`
    ]);
  }

  // Add title and date
  headerData.push(['Parcel Loading Offline Report']);
  headerData.push([
    `From: ${this.formatDate(this.fromDate)} To: ${this.formatDate(this.toDate)}`
  ]);
  headerData.push([
    `Print Date: ${this.formatDate(this.today)} Time: ${this.formatTime(this.today)}`
  ]);
  headerData.push([]); // Blank row

  // Add table headers
  const tableHeaders = [
    'S.No',
    'LR No',
    'Book by Branch',
    'Drop Branch',
    'Sender Name',
    'Receiver',
    'City Name',
    'Transaction Date',
    'Paid Type',
    'Qty',
    'Charge'
  ];
  headerData.push(tableHeaders);

  // Add table rows
  const tableRows = this.data2.map((item: any, index: number) => [
    index + 1,
    item.lrNumber,
    item.pickUpBranchname,
    item.dropBranchname,
    item.senderName,
    item.receiverName,
    item.toCity,
    this.formatDate(item.bookingDate),
    item.bookingType,
    item.totalQuantity,
    item.grandTotal
  ]);

  const fullSheetData = [...headerData, ...tableRows];

  // Generate worksheet and workbook
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(fullSheetData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Report': worksheet },
    SheetNames: ['Report']
  };

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  FileSaver.saveAs(blob, 'Parcel_Loading_Offline_Report.xlsx');
}
formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getFullYear()}`;
}

formatTime(date: Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}


}
