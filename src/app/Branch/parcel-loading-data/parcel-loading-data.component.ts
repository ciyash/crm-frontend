import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-loading-data',
  templateUrl: './parcel-loading-data.component.html',
  styleUrls: ['./parcel-loading-data.component.scss']
})
export class ParcelLoadingDataComponent {
  data1:any;
  // loading:boolean=true;
  form1:FormGroup;
  cities:any;
  constructor(private api:BranchService, private fb:FormBuilder, private cd: ChangeDetectorRef){
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
  
      this.api.ParcelOfflineReport(payload).subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
  
          if (response?.bookingDetails?.length > 0) {
            // Merge `bookingDetails` with `parcelLoadingDetails`
            this.data1 = response.bookingDetails.map((booking:any) => {
              // Find driver details for the corresponding booking
              const driverData = response.parcelLoadingDetails.find(
                (parcel:any) => parcel.grnNo.includes(parseInt(booking.lrNumber.split('/').pop())) // Extract GRN No from `lrNumber`
              );
  
              return {
                ...booking,
                driverName: driverData ? driverData.driverName : 'N/A' // Add `driverName`
              };
            });
          } else {
            this.data1 = [];
          }
  
          this.cd.detectChanges(); // 🔄 Trigger Change Detection
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          alert('No Parcel Loading. Please try again.');
          this.data1 = []; // Clear table on error
        }
      });
    }
  

}
