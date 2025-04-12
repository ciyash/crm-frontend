import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcelbooking-serialno',
  templateUrl: './parcelbooking-serialno.component.html',
  styleUrls: ['./parcelbooking-serialno.component.scss']
})
export class ParcelbookingSerialnoComponent {
  data2: any[] = []; // Explicitly define data2 as an array
  today = new Date();

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data2'];

    // Ensure data2 is an array
    this.data2 = Array.isArray(stateData) ? stateData : stateData ? [stateData] : [];
    console.log('Received serial:', this.data2);
  }
}