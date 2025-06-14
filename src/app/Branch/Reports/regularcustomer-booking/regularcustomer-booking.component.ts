import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-regularcustomer-booking',
  templateUrl: './regularcustomer-booking.component.html',
  styleUrls: ['./regularcustomer-booking.component.scss']
})
export class RegularcustomerBookingComponent implements OnInit {
  data7: any;
  message: string = '';
  today = new Date();
  pfdata: any;

  constructor(private router: Router, private api: BranchService) {}
  ngOnInit(): void {
    this.getProfileData();
    const storedData = localStorage.getItem('regularcustmerData'); // ✅ Corrected key
    if (storedData) {
      this.data7 = JSON.parse(storedData);
      console.log('Customer data from localStorage:', this.data7);
    } else {
      console.warn('No customer data found in localStorage');
    }
  }
  getProfileData(): void {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('Profile data:', this.pfdata);
    });
  }
  printReport(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin!.document.open();
      popupWin!.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
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
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin!.document.close();
    }
  }

  ExportExcel(): void {
    const aoa: any[][] = [];

    aoa.push([this.pfdata?.companyName || '']);
    aoa.push([`Address: ${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''} | Phone: ${this.pfdata?.phone || ''}`]);
    aoa.push([]);
    aoa.push(['Regular Customer Booking']);
    aoa.push([]);
    aoa.push([`From: ${this.formatDate(this.data7?.fromDate)}    To: ${this.formatDate(this.data7?.toDate)}`]);
    aoa.push([`Print Date: ${this.formatDate(this.today)}    Time: ${this.formatTime(this.today)}`]);
    aoa.push([`Printed By: ${this.pfdata?.name || ''}`]);
    aoa.push([]);

    aoa.push([
      'S.NO', 'From City', 'From Branch', 'To City', 'To Branch',
      'Book Date', 'From Party', 'To Party', 'Total Qty', 'Total Charge'
    ]);

    this.data7?.data?.forEach((item: any, index: number) => {
      aoa.push([
        index + 1,
        item.fromCity,
        item.pickUpBranchname,
        item.toCity,
        item.dropBranchname,
        this.formatDate(item.bookingDate),
        item.senderName,
        item.receiverName,
        item.totalQuantity,
        item.grandTotal
      ]);
    });

    aoa.push([
      '', '', '', '', '', '', '', 'Grand Total',
      this.data7?.allTotalQuantity,
      this.data7?.allGrandTotal
    ]);

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'RegularCustomerBooking': worksheet },
      SheetNames: ['RegularCustomerBooking']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blobData: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blobData, `RegularCustomerBooking_${Date.now()}.xlsx`);
  }

  formatDate(dateStr: any): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US');
  }
}
