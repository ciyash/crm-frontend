import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';


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
  constructor(private router: Router, private api: BranchService, private location: Location ,private toast:ToastrService) {}
  // ngOnInit(): void {
  //   const storedData = localStorage.getItem('bookingSummaryData');
  
  //   if (storedData) {
  //     const parsedData = JSON.parse(storedData);
  
  //     this.summaryData = parsedData.data || []; // ← FIXED ✅
  //     this.fromDate = parsedData.fromDate;
  //     this.toDate = parsedData.toDate;
  
  //     console.log('Parsed Summary Data from LocalStorage:', this.summaryData);
  //   } else {
  //     this.toast.error('No summary data found. Please generate the report again.');
  //     this.router.navigate(['/home']);
  //   }
  
  //   this.getProfileData();
  // }
  
  ngOnInit(): void {
    const storedData = localStorage.getItem('bookingSummaryData');
  
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        this.summaryData = Array.isArray(parsedData.data) ? parsedData.data : [];
        this.fromDate = parsedData.fromDate || '';
        this.toDate = parsedData.toDate || '';
  
        console.log('Parsed Summary Data from LocalStorage:', this.summaryData);
      } catch (err) {
        this.toast.error('Invalid report data format. Please try again.');
        this.router.navigate(['/home']);
      }
    } else {
      this.toast.error('No summary data found. Please generate the report again.');
      this.router.navigate(['/home']);
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

  Exportexcel(): void {
    const header: any[][] = [];
  
    // Add Company Info
    if (this.pfdata) {
      header.push([this.pfdata.companyName]);
      header.push([
        `Address: ${this.pfdata.location} - ${this.pfdata.branchId?.name} | Phone No: ${this.pfdata.phone}`,
      ]);
    }
  
    // Report Title
    header.push(['Parcel Booking Summary Report']);
  
    // Date Info
    const fromDate = this.fromDate ? new Date(this.fromDate).toLocaleDateString() : '';
    const toDate = this.toDate ? new Date(this.toDate).toLocaleDateString() : '';
    const today = new Date();
    header.push([`From: ${fromDate}`, `To: ${toDate}`]);
    header.push([
      `Print Date: ${today.toLocaleDateString()}`,
      `Time: ${today.toLocaleTimeString()}`,
    ]);
  
    // Printed By
    if (this.pfdata?.name) {
      header.push([`Print By: ${this.pfdata.name}`]);
    }
  
    // Empty Row
    header.push([]);
  
    // Table Header
    header.push([
      'S.No',
      'Date',
      'From Branch Name',
      'Total LR',
      'Total Qty',
      'Credit For',
      'Hamali Paid',
      'ToPaid',
      'Hamali ToPaid',
      'Total',
    ]);
  
    // Table Data
    const rows = this.summaryData.map((item: any, index: number) => [
      index + 1,
      new Date(item.bookingDate).toLocaleDateString(),
      item.pickUpBranchname,
      item.lrNumber,
      item.totalQuantity,
      item.bookingType,
      item.hamaliCharges,
      item.grandTotal,
      item.hamaliCharges,
      item.grandTotal,
    ]);
  
    const fullData = [...header, ...rows];
  
    // Create Worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(fullData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Summary Report': worksheet },
      SheetNames: ['Summary Report'],
    };
  
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
  
    const fileName = `Parcel-Booking-Summary-${today.toISOString().slice(0, 10)}.xlsx`;
    FileSaver.saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
  }
  
}
