import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcel-booking-summary',
  templateUrl: './parcel-booking-summary.component.html',
  styleUrls: ['./parcel-booking-summary.component.scss']
})
export class ParcelBookingSummaryComponent {
  data5: any;
  today = new Date();

  // ✅ Declare missing properties
  fromDate: Date | undefined;
  toDate: Date | undefined;
  printBy: string | undefined;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;

    this.data5 = state?.['data5'];
    this.fromDate = state?.['fromDate'];
    this.toDate = state?.['toDate'];
    this.printBy = state?.['printBy'];

    console.log('summary:', this.data5);
  }
}
