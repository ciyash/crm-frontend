import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

declare module 'file-saver';
declare var $: any;
declare const SlimSelect: any;


@Component({
  selector: 'app-collection-data',
  templateUrl: './collection-data.component.html',
  styleUrls: ['./collection-data.component.scss']
})
export class CollectionDataComponent {
  data: any[] = [];
  collectionReport: any;
  pfdata: any;
  today = new Date();

  constructor(private router: Router, private api: 
    BranchService, private toast: ToastrService,private route: ActivatedRoute) {
    }

    ngOnInit() {
      this.getProfileData();
          const rawData = localStorage.getItem('collectiondata');
      if (rawData) {
        try {
          const parsedData = JSON.parse(rawData);
          console.log('Loaded Collection Data from localStorage:', parsedData);
          this.collectionReport = parsedData;
        } catch (error) {
          console.error('Error parsing collection data from localStorage:', error);
        }
      } else {
        this.toast.error('No collection data found.');
      }
    }
    
  
    
  
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log( 'profiledata:',this.pfdata);
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

exportToExcel(): void {
  const exportData: any[] = [];

  // 1. Header Information
  exportData.push({ Section: 'Company Information' });
  exportData.push({ 'Company Name': this.pfdata?.companyName });
  exportData.push({ Address: `${this.pfdata?.location} - ${this.pfdata?.branchId?.name}` });
  exportData.push({ 'Phone No': this.pfdata?.phone });
  exportData.push({}); // Empty row

  // 2. Report Range Info
  exportData.push({ Section: 'Report Period & Printed Info' });
  exportData.push({
    'From Date': this.collectionReport?.fromDate,
    'To Date': this.collectionReport?.toDate
  });
  exportData.push({ 'Printed By': this.pfdata?.name });
  exportData.push({
    'Print Date': new Date().toLocaleDateString(),
    'Print Time': new Date().toLocaleTimeString()
  });
  exportData.push({}); // Empty row

  // 3. Summary Totals
  exportData.push({ Section: 'Summary Totals' });
  exportData.push({
    'Total Grand Total': this.collectionReport?.totals?.finalGrandTotal,
    'Total Cancel Amount': this.collectionReport?.totals?.finalCancelAmount,
    'Total Quantity': this.collectionReport?.totals?.finalTotalQty
  });
  exportData.push({}); // Empty row

  // 4. Branch-wise Details
  exportData.push({ Section: 'Branch-wise Details' });

  this.collectionReport?.branches?.forEach((branch: any) => {
    exportData.push({
      'Branch Name': branch.branchName,
      'Branch Grand Total': branch.branchGrandTotal,
      'Branch Cancel Amount': branch.branchCancelAmount,
      'Branch Total Quantity': branch.branchTotalQty
    });

    // Add header for booking types
    exportData.push({
      'Booking Type': 'Type',
      'Booking Total': 'Count',
      'Cancel Amount': 'Cancel Amt',
      'Grand Total': 'Amount',
      'Total Quantity': 'Qty'
    });

    branch.bookingTypes.forEach((booking: any) => {
      exportData.push({
        'Booking Type': booking.bookingType,
        'Booking Total': booking.bookingCount,
        'Cancel Amount': booking.cancelAmount,
        'Grand Total': booking.grandTotal,
        'Total Quantity': booking.totalQuantity
      });
    });

    exportData.push({}); // Spacer after each branch
  });

  // Create worksheet and save
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Parcel Collection Report': worksheet },
    SheetNames: ['Parcel Collection Report']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, `Parcel_Collection_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}



  
}

