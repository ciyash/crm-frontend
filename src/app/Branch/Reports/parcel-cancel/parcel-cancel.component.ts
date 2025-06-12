import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parcel-cancel',
  templateUrl: './parcel-cancel.component.html',
  styleUrls: ['./parcel-cancel.component.scss']
})
export class ParcelCancelComponent implements OnInit {
  today = new Date();
  fromDate: string | null = null;
  toDate: string | null = null;
  printBy: string = 'Unknown';
  pfdata: any;
  data4: any;
  datedata: any;

  constructor(private api: BranchService, private toast:ToastrService) {}

  ngOnInit(): void {
    this.loadLocalStorageData();
    this.getProfileData();
  }

  loadLocalStorageData(): void {
    const dataString = localStorage.getItem('CancelData');
    if (dataString) {
      try {
        const stateData = JSON.parse(dataString);
        this.data4 = stateData.data || stateData;
        this.datedata = stateData;
  
        console.log('Loaded from localStorage:', stateData);
  
        this.toast.success(stateData.message || 'Cancel report data loaded successfully!');
      } catch (e) {
        console.error('Failed to parse localStorage data', e);
        this.toast.error('Failed to load cancel report data. Please try again.');
      }
    } else {
      console.warn('No cancel report data found in localStorage.');
      this.toast.warning('No cancel report data found.');
    }
  }
  
  
  
  getProfileData(): void {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
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
    const excelData: any[] = [];

    // Header
    excelData.push(
      { A: `Company Name: ${this.pfdata?.companyName || ''}` },
      { A: `Address: ${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''}` },
      { A: `Phone No: ${this.pfdata?.phone || ''}` },
      {},
      { A: 'Parcel Cancel Report' },
      {},
      { A: `From: ${this.formatDate(this.datedata?.fromDate)} To: ${this.formatDate(this.datedata?.toDate)}` },
      { A: `Print Date: ${this.formatDate(this.today)} Time: ${this.formatTime(this.today)}` },
      { A: `Print By: ${this.pfdata?.name || ''}` },
      {}
    );

    excelData.push({
      'No.': 'No.',
      'GRN No': 'GRN No',
      'Manual Ticket No': 'Manual Ticket No',
      'Booking Date': 'Booking Date',
      'Cancel Date': 'Cancel Date',
      'From City': 'From City',
      'To City': 'To City',
      'Sender Name': 'Sender Name',
      'Receiver Name': 'Receiver Name',
      'Qty': 'Qty',
      'Amount': 'Amount',
      'Can. Charge': 'Can. Charge',
      'Net Amount': 'Net Amount',
      'Cancel By': 'Cancel By'
    });

    this.data4?.forEach((item: any, index: number) => {
      excelData.push({
        'No.': index + 1,
        'GRN No': item.grnNo || 'N/A',
        'Manual Ticket No': item.manualTicketNo || 'N/A',
        'Booking Date': this.formatDate(item.bookingDate),
        'Cancel Date': this.formatDate(item.cancelDate),
        'From City': item.fromCity,
        'To City': item.toCity,
        'Sender Name': item.senderName,
        'Receiver Name': item.receiverName,
        'Qty': item.totalQuantity,
        'Amount': item.grandTotal,
        'Can. Charge': item.cancelCharge,
        'Net Amount': item.refundAmount,
        'Cancel By': item.cancelBy
      });
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });
    const workbook: XLSX.WorkBook = { Sheets: { 'ParcelCancelReport': worksheet }, SheetNames: ['ParcelCancelReport'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    const fileName = `Parcel_Cancel_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  }

  private formatTime(date: any): string {
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}

  
  
