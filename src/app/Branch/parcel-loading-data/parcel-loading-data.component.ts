import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
              fromCity: ['', Validators.required],
              toCity: this.fb.array([], Validators.required),
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

   get toCityArray() {
      return this.form1.get('toCity') as FormArray;
    }

    onToCityChange(event: any, cityName: string) {
      const currentCities = this.toCityArray.value;
      
      if (event.target.checked) {
        if (!currentCities.includes(cityName)) {
          this.toCityArray.push(this.fb.control(cityName));
        }
      } else {
        const index = currentCities.indexOf(cityName);
        if (index !== -1) {
          this.toCityArray.removeAt(index);
        }
      }
    
      console.log('Selected To Cities:', this.toCityArray.value);
    }
    

  ParcelLoad() {
    const payload = {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity
    };
  
    console.log('Final Payload:', payload);
  
    this.loading = true; // ✅ Show loading state
    
    this.api.ParcelOfflineReport(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        this.data1 = response; // ✅ Assign API response directly to data1
        this.loading = false; // ✅ Stop loading state
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('NO Parcel Loading. Please try again.');
        this.loading = false;
      }
    });
  }
  

}
