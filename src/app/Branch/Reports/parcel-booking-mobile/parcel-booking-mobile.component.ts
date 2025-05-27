import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-parcel-booking-mobile',
  templateUrl: './parcel-booking-mobile.component.html',
  styleUrls: ['./parcel-booking-mobile.component.scss']
})
export class ParcelBookingMobileComponent implements OnInit {
  today = new Date();
  printBy: string = 'Unknown';
  pfdata: any;
  mdata: any;

  constructor(private api: BranchService) {}

  ngOnInit(): void {
    this.getProfileData();
  
    const storedData = localStorage.getItem('mobileBookingData');
    if (storedData) {
      this.mdata = JSON.parse(storedData);
      console.log('Loaded data (mdata) from localStorage:', this.mdata);
    } else {
      console.warn('No data found for bookingmobile report');
    }
  }
  
  

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      this.printBy = res?.name || 'Unknown';
      console.log('Profile Data:', this.pfdata);
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


ExportExcel(): void {
  const exportData: any[][] = [];

  // 1. Top Info
  if (this.pfdata) {
    exportData.push([this.pfdata.companyName]);
    exportData.push([`Address: ${this.pfdata.location} - ${this.pfdata.branchId?.name} | Phone: ${this.pfdata.phone}`]);
  }

  exportData.push([]);
  exportData.push(['Mobile Booking Details Report']);

  if (this.mdata) {
    const from = this.formatDate(this.mdata.fromDate);
    const to = this.formatDate(this.mdata.toDate);
    const printDate = this.formatDate(this.today);
    const printTime = new Date(this.today).toLocaleTimeString();

    exportData.push([`From: ${from}`, `To: ${to}`]);
    exportData.push([`Print Date: ${printDate}`, `Time: ${printTime}`]);
  }

  exportData.push([]);

  // 2. Table Headers
  exportData.push([
    'S.NO', 'GRN.NO', 'Booking Date', 'From City', 'To City',
    'Sender Name', 'Sender No', 'Receiver', 'Receiver No',
    'Delivery Date', 'Qty', 'Type', 'Total Amt'
  ]);

  // 3. Table Rows
  this.mdata?.data?.forEach((item: any, index: number) => {
    exportData.push([
      index + 1,
      item.grnNo || '-',
      this.formatDate(item.bookingDate),
      item.fromCity || '-',
      item.toCity || '-',
      item.senderName || '-',
      item.senderMobile || '-',
      item.receiverName || '-',
      item.receiverMobile || '-',
      item.deliveryDate ? this.formatDate(item.deliveryDate) : '-',
      item.totalQuantity || 0,
      item.bookingType || '-',
      item.grandTotal || 0
    ]);
  });

  // 4. Totals Row
  exportData.push([]);
  exportData.push([
    '', '', '', '', '', '', '', '', '',
    'Total Qty:', this.mdata?.allTotalQuantity || 0,
    'Total:', this.mdata?.allGrandTotal || 0
  ]);

  // 5. Export
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Mobile Booking Report': worksheet },
    SheetNames: ['Mobile Booking Report']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const fileName = `Mobile-Booking-Report-${new Date().toISOString().slice(0, 10)}.xlsx`;
  FileSaver.saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
}

// Helper to format date as dd-MM-yyyy
formatDate(date: any): string {
  if (!date) return '-';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

}
