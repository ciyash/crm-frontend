import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-loading-data',
  templateUrl: './parcel-loading-data.component.html',
  styleUrls: ['./parcel-loading-data.component.scss']
})
export class ParcelLoadingDataComponent {
  data1:any;
  loading:boolean=true;
  form1:FormGroup;
  cities:any;
  constructor(private api:BranchService, private fb:FormBuilder){
            this.form1 = this.fb.group({
              fromBookingDate: ['', Validators.required],
              toBookingDate: ['', Validators.required],
              fromCity: this.fb.array([], Validators.required),
              toCity: ['', Validators.required],
            });
  }

  ngOnInit(){
    this.getCities();
  }

  getCities() {
    this.api.GetCities().subscribe({
      next: (response: any) => {
        console.log('Cities data:', response);
        this.cities = response; 
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);
        alert('Failed to fetch cities data.');
      },
    });
  
  }

  ParcelLoad() {
    const payload = {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity
    };
  
    console.log('Final Payload:', payload);
    
    this.api.ParcelOfflineReport(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        alert('Parcel Loaded Successfully!');
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('NO Parcel Loading . Please try again.');
      },
    });
  }

}
