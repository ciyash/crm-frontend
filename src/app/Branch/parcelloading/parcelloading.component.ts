import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-parcelloading',
  templateUrl: './parcelloading.component.html',
  styleUrls: ['./parcelloading.component.scss'],
})
export class ParcelloadingComponent implements OnInit {
  adminData: any;
  bookingParcel!: FormGroup;
  cities: { cityName: string }[] = []; 
    vehicle:any

  constructor(private service: ServiceService, private fb: FormBuilder) {}
  ngOnInit() {
    this.adminData = this.service.getAdminData();
    console.log('Admin Data:', this.adminData);
    this.getCities();
    this.initForm();
    this. getvehicle()
  }
  initForm() {
    this.bookingParcel = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fromCity: ['', Validators.required],
      toCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
    });
  }
  onLoad() {
    const formValues = this.bookingParcel.value;
    const bookingParcel = {
      startDate: formValues.startDate? new Date(formValues.startDate).toISOString(): null,
      endDate: formValues.endDate ? new Date(formValues.endDate).toISOString(): null,
      fromCity: [''] ,
      toCity: formValues.toCity,
      pickUpBranch: formValues.pickUpBranch,
    };
    console.log('Final Booking Data:', bookingParcel);
    this.service
      .postData('booking/startDate/endDate/fromCity/toCity', bookingParcel)
      .subscribe({
        next: (response: any) => {
          console.log('Booking successful:', response);
          alert('Booking Successful!');
        },
        error: (error: any) => {
          console.error('Booking failed:', error);
          alert('Booking Failed. Please try again.');
        },
      });
  }
  // shbhzbchbdcbzcgit
  getCities() {
    this.service.getData('multi-router/cities', { country: 'USA' }).subscribe({
      next: (response: any) => {
        console.log('Cities data:', response);
        // alert('Data fetched successfully!');
        this.cities = response; // ✅ Assign response to the `cities` array
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);
        alert('Failed to fetch cities data.');
      },
    });
  
  }
  getvehicle() {
    this.service.getData('vehicle', this.vehicle).subscribe({
      next: (response: any) => {
        console.log('vehicle:', response);
        // alert('Data fetched successfully!');
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);
        alert('Failed to fetch cities data.');
      }
    });
      };
    }


