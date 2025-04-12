import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcel-booking-report',
  templateUrl: './parcel-booking-report.component.html',
  styleUrls: ['./parcel-booking-report.component.scss']
})
export class ParcelBookingReportComponent {
  data: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'];

    console.log('Received data:', this.data);
  }
}
