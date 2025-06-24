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
  selector: 'app-all-report',
  templateUrl: './all-report.component.html',
  styleUrls: ['./all-report.component.scss']
})
export class AllReportComponent {

    data: any[] = [];
    collectionReport: any;
    pfdata: any;
    today = new Date();
    collectionData: any;
  
    constructor(private router: Router, private api: 
      BranchService, private toast: ToastrService,private route: ActivatedRoute) {
      }
  
      ngOnInit() {
        this.getProfileData();
   const data = localStorage.getItem('collectiondata');
      if (data) {
        this.collectionData = JSON.parse(data);
        console.log("Received collection data:", this.collectionData);
      } else {
        console.warn('No collection data found in localStorage');
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
    
        if (popupWin) {
          popupWin.document.open();
          popupWin.document.write(`
            <html>
              <head>
                <title>Parcel Collection Report</title>
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
    
                  .mb-2 {
                    margin-bottom: 0.5rem;
                  }
    
                  .text-end {
                    text-align: right;
                  }
    
                  .bg-light {
                    background-color: #f8f9fa;
                  }
    
                  @media print {
                    .no-print {
                      display: none !important;
                    }
                  }
                </style>
              </head>
              <body onload="window.print(); window.close();">
                ${printContents}
              </body>
            </html>
          `);
          popupWin.document.close();
        } else {
          console.error('Popup blocked or failed to open.');
        }
      } else {
        console.error('Print section not found.');
      }
    }
  
    exportToExcel(): void {
      const exportData: any[] = [];
      // Company Info
      exportData.push(['Company Information']);
      exportData.push([this.pfdata?.companyId?.name || '']);
      exportData.push([`${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''}`]);
      exportData.push([`Phone No: ${this.pfdata?.phone || ''}`]);
      exportData.push([]);
    
      // Report Metadata
      exportData.push(['Report Period & Printed Info']);
      exportData.push([
        `From Date: ${this.collectionData?.fromDate || ''}`,
        `To Date: ${this.collectionData?.toDate || ''}`
      ]);
      exportData.push([`Print By: ${this.pfdata?.name || ''}`]);
      exportData.push([
        `Print Date: ${new Date().toLocaleDateString()}`,
        `Print Time: ${new Date().toLocaleTimeString()}`
      ]);
      exportData.push([]);
    
      // Table Headers
      exportData.push([
        'S.No',
        'Branch Name',
        'Paid Amount',
        'ToPay Amount',
        'Delivery Amount',
        'Cancel Amount',
        'Net Amount'
      ]);
    
      // Branch rows
      this.collectionData?.branches?.forEach((item: any, index: number) => {
        exportData.push([
          index + 1,
          item.branchName || '',
          item.paidAmount || 0,
          item.toPayAmount || 0,
          item.deliveryAmount || 0,
          item.cancelAmount || 0,
          item.netAmount || 0
        ]);
      });
    
      // Summary footer row
      exportData.push([]);
      exportData.push([
        '',
        'Total:',
        this.collectionData?.finalPaidAmount || 0,
        this.collectionData?.finalToPayAmount || 0,
        this.collectionData?.finalDeliveryAmount || 0,
        this.collectionData?.finalCancelAmount || 0,
        this.collectionData?.finalNetAmount || 0
      ]);
    
      // Convert to worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Parcel Collection Report': worksheet },
        SheetNames: ['Parcel Collection Report']
      };
    
      // Export
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `Parcel_Collection_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
    
    
  
  
  
    
  }
  
  
