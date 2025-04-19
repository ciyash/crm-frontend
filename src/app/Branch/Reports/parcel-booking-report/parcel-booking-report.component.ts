import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcel-booking-report',
  templateUrl: './parcel-booking-report.component.html',
  styleUrls: ['./parcel-booking-report.component.scss'],
})
export class ParcelBookingReportComponent implements OnInit {
  data: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Use history.state to access navigation state
    const stateData = history.state?.data;

    if (stateData?.success && stateData?.data) {
      this.data = stateData.data;
    } else if (stateData) {
      // Handle case where response doesn't have success/data structure
      this.data = stateData;
    }

    console.log('Received data:', this.data);
  }
}