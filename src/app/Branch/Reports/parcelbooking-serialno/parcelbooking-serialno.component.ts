import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-parcelbooking-serialno',
  templateUrl: './parcelbooking-serialno.component.html',
  styleUrls: ['./parcelbooking-serialno.component.scss']
})
export class ParcelbookingSerialnoComponent implements OnInit {
  data2: any; // hold the parsed data from localStorage
  today = new Date();
  pfdata: any;
  paidBookings: any;
  creditBookings: any;
  topayBookings: any;
  focBookings: any;
  clrBookings: any;

  constructor(private router: Router, private api: BranchService) {}

  ngOnInit(): void {
    // Retrieve data from localStorage
    const dataString = localStorage.getItem('bookingSerialData');
    if (dataString) {
      this.data2 = JSON.parse(dataString);
      console.log("Data received from localStorage:", this.data2);

      // Extract booking categories safely (check if data2.data exists)
      const data = this.data2.data || {};

      this.paidBookings = data.paid?.bookings || [];
      this.creditBookings = data.credit?.bookings || [];
      this.focBookings = data.FOC?.bookings || [];
      this.clrBookings = data.CLR?.bookings || [];
      this.topayBookings = data.toPay?.bookings || [];

      // Optionally clear localStorage if you don't want stale data
      // localStorage.removeItem('bookingSerialData');
    } else {
      // Handle missing data scenario
      console.error('No booking serial data found in localStorage.');
      // e.g., show toast or redirect to a safe page
      // this.toast.error('No booking serial data found.');
      // this.router.navigate(['/somewhere']);
    }

    this.getProfileData();
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('Profile data:', this.pfdata);
    });
  }
  Print(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // reload to reset the page properly after printing
    } else {
      alert('Nothing to print!');
    }
  }




  
    exportToExcel() {
      const wb = XLSX.utils.book_new();
  
      // Company Info Sheet
      const companyInfo = [
        ['Company Name', this.pfdata?.companyName || 'N/A'],
        ['Address', `${this.pfdata?.location || 'Location not available'} - ${this.pfdata?.branchId?.name || 'Branch not available'}`],
        ['Phone', this.pfdata?.phone || 'Phone not available'],
        [],
        ['Report Period', `${this.data2?.fromDate ? new Date(this.data2.fromDate).toLocaleDateString() : 'N/A'} - ${this.data2?.toDate ? new Date(this.data2.toDate).toLocaleDateString() : 'N/A'}`],
        ['Print Date', this.today.toLocaleDateString()],
        ['Print Time', this.today.toLocaleTimeString()]
      ];
      const wsCompany = XLSX.utils.aoa_to_sheet(companyInfo);
      XLSX.utils.book_append_sheet(wb, wsCompany, 'Company Info');
  
      // Helper to convert booking array to sheet data
      const createSheetData = (bookings: any[], title: string) => {
        if (!bookings || bookings.length === 0) return null;
  
        const header = [
          'S.NO', 'GRN No', 'Date', 'Source', 'Destination', 'Package Details', 'Pkgs', 'Amount'
        ];
        const data = bookings.map((item, index) => {
          const pkgDetails = item.packages
            .map((p: any) => `${p.packageType} - Qty: ${p.quantity}, Wt: ${p.weight}kg`)
            .join('\n');
          return [
            index + 1,
            item.grnNo,
            new Date(item.bookingDate).toLocaleDateString(),
            item.pickUpBranchname,
            item.dropBranchname,
            pkgDetails,
            item.totalQuantity,
            item.grandTotal.toFixed(2),
          ];
        });
        // Add title row, empty row, header and data
        const sheetData = [[title], [], header, ...data];
        return sheetData;
      };
  
      // Add sheets for each booking type if data exists
      const paidSheetData = createSheetData(this.paidBookings, 'Paid Bookings');
      if (paidSheetData) {
        const wsPaid = XLSX.utils.aoa_to_sheet(paidSheetData);
        XLSX.utils.book_append_sheet(wb, wsPaid, 'Paid Bookings');
      }
  
      const creditSheetData = createSheetData(this.creditBookings, 'Credit Bookings');
      if (creditSheetData) {
        const wsCredit = XLSX.utils.aoa_to_sheet(creditSheetData);
        XLSX.utils.book_append_sheet(wb, wsCredit, 'Credit Bookings');
      }
  
      const focSheetData = createSheetData(this.focBookings, 'FOC Bookings');
      if (focSheetData) {
        const wsFOC = XLSX.utils.aoa_to_sheet(focSheetData);
        XLSX.utils.book_append_sheet(wb, wsFOC, 'FOC Bookings');
      }
  
      const clrSheetData = createSheetData(this.clrBookings, 'CLR Bookings');
      if (clrSheetData) {
        const wsCLR = XLSX.utils.aoa_to_sheet(clrSheetData);
        XLSX.utils.book_append_sheet(wb, wsCLR, 'CLR Bookings');
      }
  
      const topaySheetData = createSheetData(this.topayBookings, 'To Pay Bookings');
      if (topaySheetData) {
        const wsTopay = XLSX.utils.aoa_to_sheet(topaySheetData);
        XLSX.utils.book_append_sheet(wb, wsTopay, 'To Pay Bookings');
      }
  
      // Generate Excel file and trigger download
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'ParcelBookingReport.xlsx');
    
  }
  

}

  