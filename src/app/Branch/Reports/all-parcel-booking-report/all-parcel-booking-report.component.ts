import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-all-parcel-booking-report',
  templateUrl: './all-parcel-booking-report.component.html',
  styleUrls: ['./all-parcel-booking-report.component.scss']
})
export class AllParcelBookingReportComponent {
  data1: any;
  pfdata: any;
  today = new Date();

  constructor(private router: Router,private api:BranchService,private toast:ToastrService) {

  }
  
  ngOnInit(): void {
    this.getProfileData();
    const storedData = localStorage.getItem('allParcelBookingData');
    if (storedData) {
      this.data1 = JSON.parse(storedData);
      console.log('Received:', this.data1);
    } else {
      this.toast.error('No booking data found!');
    }
  }
  
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log( 'profiledata:',this.pfdata);
    });
  }


 printPage(): void {
  const printContents = document.getElementById('print-section')?.innerHTML;
  if (printContents) {
    const popupWin = window.open();
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }
            h4, h6, p {
              margin: 4px 0;
            }
            .text-center { text-align: center; }
            .fw-bold { font-weight: bold; }
            .text-decoration-underline { text-decoration: underline; }
            .d-flex { display: flex; justify-content: space-between; }

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

            @media print {
              .no-print { display: none; }
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



ExpoetExcel(): void {
  const element = document.getElementById('print-section');
  if (!element) {
    console.error('print-section not found!');
    return;
  }

  // Clone the element to preserve original DOM
  const clonedElement = element.cloneNode(true) as HTMLElement;

  // Remove unwanted Angular-specific tags if any
  clonedElement.querySelectorAll('ng-container').forEach(el => el.remove());

  // Convert HTML tables to sheet(s)
  const tables = clonedElement.querySelectorAll('table');

  // Create new workbook and worksheet
  const wb = XLSX.utils.book_new();
  let ws: XLSX.WorkSheet;

  // Start data array with static info
  const data: any[][] = [];

  // Header: Company Info
  const companyName = this.pfdata?.companyName || '';
  const location = this.pfdata?.location || '';
  const branchName = this.pfdata?.branchId?.name || '';
  const phone = this.pfdata?.phone || '';
  data.push([companyName]);
  data.push([`Address: ${location} - ${branchName} | Phone No: ${phone}`]);
  data.push([]);

  // Report title
  data.push(['All Parcel Booking Details Report']);
  data.push([]);

  // Dates
  const startDate = this.data1?.startDate ? new Date(this.data1.startDate).toLocaleDateString() : '';
  const endDate = this.data1?.endDate ? new Date(this.data1.endDate).toLocaleDateString() : '';
  const today = new Date();
  const printDate = today.toLocaleDateString();
  const printTime = today.toLocaleTimeString();
  data.push([`From: ${startDate}`, `To: ${endDate}`, `Print Date: ${printDate}`, `Time: ${printTime}`]);
  data.push([]);

  // Add tables group-wise
  this.data1.data.forEach((group: any, groupIndex: number) => {
    if (group.vehicalNumber) {
      data.push([`Vehicle Number: ${group.vehicalNumber}`]);
    }

    // Table headers
    data.push([
      'No',
      'GRN No',
      'Date',
      'Status',
      'From City',
      'To City',
      'Type',
      'From Branch',
      'To Branch',
      'Sender Name',
      'Receiver Name',
      'Qty',
      'Amount',
      'Hamali Charge'
    ]);

    // Table body
    group.bookings.forEach((row: any, i: number) => {
      data.push([
        i + 1,
        row.grnNo,
        new Date(row.bookingDate).toLocaleDateString(),
        row.bookingStatus === 0 ? 'Loading' : 'Unknown',
        row.fromCity,
        row.toCity,
        row.bookingType,
        row.pickUpBranchname,
        row.dropBranchname || 'N/A',
        `${row.senderName} ${row.senderMobile || ''}`,
        `${row.receiverName} ${row.receiverMobile || ''}`,
        row.totalQuantity,
        row.grandTotal,
        row.hamaliCharges
      ]);
    });

    // Table footer
    data.push([
      '', '', '', '', '', '', '', '', '', '', 'Total',
      group.totalQuantity,
      group.totalGrandTotal,
      group.totalHamaliCharge
    ]);

    data.push([]); // Add empty row after each group
  });

  // Convert to worksheet and export
  ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Parcel Report');

  const excelBuffer: any = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  FileSaver.saveAs(blob, `Parcel_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

  
}
