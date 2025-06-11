import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-parcel-booking-report',
  templateUrl: './parcel-booking-report.component.html',
  styleUrls: ['./parcel-booking-report.component.scss'],
})
export class ParcelBookingReportComponent implements OnInit {
  data: any ;
  data1: any ;
  currentDate: Date = new Date();
currentTime: Date = new Date();
fromDate:any;
toDate:any;
  pfdata: any;
  parcelReportData:any;
  reportData: any;
  constructor(private router: Router,private api:BranchService) {
  const nav = this.router.getCurrentNavigation();
  this.reportData = nav?.extras?.state?.['reportData'];
  }
  ngOnInit(): void {
    // setInterval(() => {
    //   this.currentDate = new Date();
    //   this.currentTime = new Date();
    // }, 1000);
console.log('Report Data:', this.reportData);

    const key = 'parcelReportData';
    const storedData = localStorage.getItem(key);

    if (storedData) {
      this.parcelReportData = JSON.parse(storedData);
      console.log('Loaded Parcel Report Data:', this.parcelReportData);
    } else {
      console.warn('No report data found in localStorage');
    }
    this.data = this.parcelReportData.data;
    this.data1 = this.parcelReportData; 
    console.log('Received data:', this.data);
    this.getProfileData();

  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log( 'profiledata:',this.pfdata);
    });
  }




  getBookingStatus(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Confirmed';
      case 2: return 'Delivered';
      default: return 'Unknown';
    }
  }

  getTotalWeight(packages: any[]): number {
    if (!packages) return 0;
    return packages
      .map(p => p.weight || 0)
      .reduce((a, b) => a + b, 0);
  }

  print() {
    const printContents = document.getElementById('printableArea')?.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents || '';
    setTimeout(() => {
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Optional: Reload to restore original content
    }, 500); // Adjust delay as needed
  }
  


  // downloadAsPDF() {
  //   const element = document.getElementById('printableArea');
  //   if (element) {
  //     const opt = {
  //       margin: 1,
  //       filename: 'parcel_booking_report.pdf',
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  //     };
  //     import('html2pdf.js').then((html2pdf) => {
  //       html2pdf().from(element).set(opt).save();
  //     });
  //   }
  // }
  
  


  
    Export(): void {
      const wb = XLSX.utils.book_new();
  
      // Add company info and report header as the first sheet
      const headerData = [
        [this.pfdata?.companyName || ''],
        [`Address: ${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''} | Phone No: ${this.pfdata?.phone || ''}`],
        [],
        ['Parcel Booking Report'],
        [],
        [
          `From: ${this.formatDate(this.data1?.fromDate)}`,
          `To: ${this.formatDate(this.data1?.toDate)}`
        ],
        [`Print Date: ${this.formatDate(this.currentDate)} ${this.formatTime(this.currentTime)}`],
        []
      ];
  
      const wsHeader = XLSX.utils.aoa_to_sheet(headerData);
      XLSX.utils.book_append_sheet(wb, wsHeader, 'Report Info');
  
      // For each category, add a sheet with its bookings
      const categories = ['toPay', 'paid', 'credit', 'FOC', 'CLR'];
      categories.forEach(category => {
        const bookings = this.data[category]?.bookings || [];
        if (bookings.length === 0) {
          // Add a sheet with "No bookings found"
          const wsEmpty = XLSX.utils.aoa_to_sheet([['No bookings found for ' + category]]);
          XLSX.utils.book_append_sheet(wb, wsEmpty, category);
          return;
        }
  
        // Prepare header row for the bookings table
        const tableHeader = [
          'S.No', 'GRN No', 'Status', 'Date', 'From Branch', 'To Branch',
          'Booked By', 'Sender Name', 'Receiver Name', 'Agent', 'Quantity',
          'Weight', 'Charge', 'Hamali', 'Value of Goods', 'E-way Bill No'
        ];
  
        // Prepare bookings data rows
        const dataRows = bookings.map((booking: any, i: number) => ([
          i + 1,
          booking.grnNo || '-',
          this.getBookingStatus(booking.bookingStatus),
          this.formatDate(booking.bookingDate, 'dd/MM/yyyy'),
          booking.pickUpBranchname || '-',
          booking.dropBranchname || '-',
          booking.bookedBy?.name || '-',
          booking.senderName || '-',
          booking.receiverName || '-',
          booking.agentName || '-',
          booking.totalQuantity || 0,
          this.getTotalWeight(booking.packages),
          booking.grandTotal || 0,
          booking.hamali || 0,
          booking.valueOfGoods || 0,
          booking.eWayBillNo || '-',
        ]));
  
        // Add totals row
        const totalRow = [
          '', '', '', '', '', '', '', '', '', 'Total',
          this.data[category].allTotalQuantity || 0,
          '',
          this.data[category].allGrandTotal || 0,
          '', '', ''
        ];
  
        const worksheetData = [tableHeader, ...dataRows, totalRow];
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  
        XLSX.utils.book_append_sheet(wb, ws, category);
      });
  
      // Export file
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'ParcelBookingReport.xlsx');
    }
  
    private formatDate(date: any, format = 'dd-MM-yyyy'): string {
      if (!date) return '';
      const d = new Date(date);
      // Simple date formatting - adjust if needed
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      if (format === 'dd/MM/yyyy') return `${day}/${month}/${year}`;
      return `${day}-${month}-${year}`;
    }
  
    private formatTime(date: any): string {
      if (!date) return '';
      let d = new Date(date);
      let hours = d.getHours();
      let minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const strTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      return strTime;
    }
    
}