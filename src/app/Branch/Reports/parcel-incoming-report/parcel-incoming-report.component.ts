import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-parcel-incoming-report',
  templateUrl: './parcel-incoming-report.component.html',
  styleUrls: ['./parcel-incoming-report.component.scss']
})
export class ParcelIncomingReportComponent {
  gdata: any[] = [];
  pfdata: any;
  today = new Date();
  prow: any;
  totalGrand: number = 0;
  totalQuantity: number = 0;

  constructor(private router: Router, private api: BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: any };
  
    if (state?.data) {
      console.log('Received from state:', state.data);
      this.prow = state.data;
      this.gdata = this.extractGData(state.data);
      localStorage.setItem('incomingReportData', JSON.stringify(state.data));
    } else {
      const localData = localStorage.getItem('incomingReportData');
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log('Received from localStorage:', parsedData);
        this.prow = parsedData;
        this.gdata = this.extractGData(parsedData);
      } else {
        console.warn('No report data found in router state or localStorage');
      }
    }
  }
  

  ngOnInit() {
    this.getProfileData();
    this.calculateTotal();
  }

  extractGData(data: any): any[] {
    return Object.values(data).filter(
      item => typeof item === 'object' && item !== null && !Array.isArray(item)
    );
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

  calculateTotal() {
    this.totalGrand = 0;
    this.totalQuantity = 0;

    this.gdata.forEach(item => {
      this.totalGrand += item.grandTotal || 0;

      if (item.packages && Array.isArray(item.packages)) {
        item.packages.forEach((pkg: { quantity: any }) => {
          this.totalQuantity += pkg.quantity || 0;
        });
      }
    });
  }



  exportToExcel(): void {
    const excelData: any[] = [];

    // Add Header Info
    excelData.push(
      { A: `Company Name: ${this.pfdata?.companyName || ''}` },
      { A: `Address: ${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''}` },
      { A: `Phone No: ${this.pfdata?.phone || ''}` },
      {},
      { A: 'ALL Branch Incoming Luggages Report' },
      {},
      { A: `From: ${this.formatDate(this.prow?.fromDate)} To: ${this.formatDate(this.prow?.toDate)}` },
      { A: `Print Date: ${this.formatDate(this.today)} Time: ${this.formatTime(this.today)}` },
      { A: `Print By: ${this.pfdata?.name || ''}` },
      {}
    );

    // Add Table Header
    excelData.push({
      'S No': 'S No',
      'LR No': 'LR No',
      'LR Date': 'LR Date',
      'Bus No': 'Bus No',
      'Sender Name': 'Sender Name',
      'Receiver Name': 'Receiver Name',
      'Item(s)': 'Item(s)',
      'Status': 'Status',
      'Delivery Receiver Name': 'Delivery Receiver Name',
      'Delivery Receiver No': 'Delivery Receiver No',
      'Amount': 'Amount',
      'SIGN': 'SIGN'
    });

    // Add Table Rows
    this.gdata.forEach((item, index) => {
      excelData.push({
        'S No': index + 1,
        'LR No': item.lrNumber,
        'LR Date': this.formatDate(item.bookingDate),
        'Bus No': item.vehicalNumber || '-',
        'Sender Name': item.senderName,
        'Receiver Name': item.receiverName,
        'Item(s)': item.packages?.map((p: { packageType: any; quantity: any; totalPrice: any; }) =>
          `${p.packageType} (Qty: ${p.quantity}, ₹${p.totalPrice})`).join('; ') || '',
        'Status': item.bookingType,
        'Delivery Receiver Name': item.deliveryEmployee || '-',
        'Delivery Receiver No': item.receiverMobile,
        'Amount': item.grandTotal,
        'SIGN': ''
      });
    });

    // Add Footer Totals
    excelData.push({});
    excelData.push({
      'S No': '',
      'LR No': '',
      'LR Date': '',
      'Bus No': '',
      'Sender Name': '',
      'Receiver Name': '',
      'Item(s)': `Total Quantity: ${this.totalQuantity}`,
      'Status': '',
      'Delivery Receiver Name': '',
      'Delivery Receiver No': 'Total Amount:',
      'Amount': `₹${this.totalGrand}`,
      'SIGN': ''
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });
    const workbook: XLSX.WorkBook = { Sheets: { 'Report': worksheet }, SheetNames: ['Report'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `Incoming_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName);
  }

  private formatDate(date: any): string {
    return date ? new Date(date).toLocaleDateString('en-GB') : '';
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';


