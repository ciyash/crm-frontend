import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-parcel-booking-report',
  templateUrl: './all-parcel-booking-report.component.html',
  styleUrls: ['./all-parcel-booking-report.component.scss']
})
export class AllParcelBookingReportComponent {
  data1: any;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.data1 = navigation?.extras?.state?.['data1'];

    console.log('Received:', this.data1);
  }
  today = new Date();



}
