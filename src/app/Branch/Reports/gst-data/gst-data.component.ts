import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gst-data',
  templateUrl: './gst-data.component.html',
  styleUrls: ['./gst-data.component.scss']
})
export class GstDataComponent {

  gstdata: any; // entire state object
  bookings: any[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data'];
    
    this.gstdata = stateData;
    this.bookings = stateData?.bookings || [];
    

    console.log("Bookings:", this.bookings);
  }

  calculateTotalAmount(): number {
    return this.bookings.reduce((sum, item) => sum + (item.grandTotal || 0), 0);
  }
}
