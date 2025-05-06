import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

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
  constructor(private router: Router,private api:BranchService) {}

  ngOnInit(): void {
    setInterval(() => {
      this.currentDate = new Date();
      this.currentTime = new Date();
    }, 1000);
  
    const stateData = history.state?.data;
  
    if (stateData) {
      this.data = stateData.data;
      this.data1 = stateData; // already contains fromDate and toDate
    }

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

}