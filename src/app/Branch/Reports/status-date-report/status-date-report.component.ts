
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-status-date-report',
  templateUrl: './status-date-report.component.html',
  styleUrls: ['./status-date-report.component.scss']
})
export class StatusDateReportComponent implements OnInit {
  pfdata: any;
  gdata: any[] = [];
  today = new Date();
  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(
    private router: Router,
    private api: BranchService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('dateReportData');

    if (data) {
      try {
        const parsedData = JSON.parse(data);
        console.log('Received data:', parsedData);

        this.fromDate = parsedData.fromDate ? new Date(parsedData.fromDate) : null;
        this.toDate = parsedData.toDate ? new Date(parsedData.toDate) : null;
        this.gdata = parsedData.data || [];

        if (this.gdata.length) {
          this.gdata = this.gdata.map((item: any) => {
            const bookingDate = new Date(item.bookingDate);
            const loadingDate = new Date(item.loadingDate);
            const unloadingDate = new Date(item.unloadingDate);
            const deliveryDate = new Date(item.deliveryDate);

            return {
              ...item,
              status: item.deliveryDate ? 'Delivered' : 'In Progress',
              days1: this.dateDiffInDays(bookingDate, loadingDate),
              days2: this.dateDiffInDays(loadingDate, unloadingDate),
              days3: this.dateDiffInDays(unloadingDate, deliveryDate)
            };
          });
        }

        this.toast.success('Status report loaded successfully');
      } catch (err) {
        console.error('JSON parse error:', err);
        this.toast.error('Failed to parse status report data.');
      }
    } else {
      this.toast.warning('No status report data found in storage.');
    }

    this.getProfileData();
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('Profile data:', this.pfdata);
    });
  }

  dateDiffInDays(d1: Date, d2: Date): number {
    if (!d1 || !d2) return 0;
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
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
              .text-center { text-align: center; }
              .fw-bold { font-weight: bold; }
              .text-decoration-underline { text-decoration: underline; }
              .d-flex {
                display: flex;
                justify-content: space-between;
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

  exportToExcel(): void {
    const worksheetData = this.gdata.map((item: any, index: number) => ({
      No: index + 1,
      'GRN No': item.grnNo,
      Status: item.status,
      'Booking To Loading': `${this.formatDate(item.bookingDate)} - ${this.formatDate(item.loadingDate)} (${item.days1})`,
      'Loading To Unloading': `${this.formatDate(item.loadingDate)} - ${this.formatDate(item.unloadingDate)} (${item.days2})`,
      'Unloading To Delivery': `${this.formatDate(item.unloadingDate)} - ${this.formatDate(item.deliveryDate)} (${item.days3})`,
    }));

    const companyInfo = [
      [`${this.pfdata?.companyName || ''}`],
      [`Address: ${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''} | Phone: ${this.pfdata?.phone || ''}`],
      ['Parcel Status Date Difference Report'],
      [`From: ${this.formatDate(this.fromDate)}  To: ${this.formatDate(this.toDate)}`],
      [`Print Date: ${this.formatDate(this.today)}  Time: ${this.formatTime(this.today)}`],
      [],
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(companyInfo);
    XLSX.utils.sheet_add_json(worksheet, worksheetData, { origin: -1 });

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Report': worksheet },
      SheetNames: ['Report']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'Parcel-Status-Report.xlsx');
  }

  formatDate(date: string | Date | null): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
  }

  formatTime(date: string | Date | null): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

