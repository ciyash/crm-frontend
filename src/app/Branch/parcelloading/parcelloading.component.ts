import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
@Component({
  selector: 'app-parcelloading',
  templateUrl: './parcelloading.component.html',
  styleUrls: ['./parcelloading.component.scss'],
})
export class ParcelloadingComponent implements OnInit {
  adminData: any;
  bookingParcel!: FormGroup;
  cities: { cityName: string }[] = []; 
  vehicle: any = {}; 
  branchdata: any;


  constructor(private service: BranchService, private fb: FormBuilder) {
    
      this.bookingParcel = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        fromCity: ['', Validators.required],
        toCity: ['', Validators.required],
        pickUpBranch: ['', Validators.required],
      });
    
  }
  ngOnInit() {
    this.adminData = this.service.getAdminData();
    console.log('Admin Data:', this.adminData);
    this.getCities();
    this. getVehicleData()
    this.branchData()
    this.branchData();
  }
 
  onLoad() {
    const formValues = this.bookingParcel.value;
    const bookingParcel = {
      startDate: formValues.startDate? new Date(formValues.startDate).toISOString(): null,
      endDate: formValues.endDate ? new Date(formValues.endDate).toISOString(): null,
      fromCity:formValues.fromCity ,
      toCity: formValues.toCity,
      pickUpBranch:formValues.pickUpBranch,
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

  getCities() {
    this.service.getData('multi-router/cities', { country: 'USA' }).subscribe({
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

  getVehicleData() {
    this.service.getData('Vehicle').subscribe({
      next: (response: any) => {
        console.log('Vehicle:', response);
        this.vehicle = response; 
      },
      error: (error: any) => {
        console.error('Error fetching vehicle data:', error);
      }
    });
  }

  branchData() {
    this.service.getData('branch').subscribe({
      next: (response: any) => {
        console.log('Branch Data:', response);
        this.branchdata = response; // Ensure response contains an array of branches
      },
      error: (error: any) => {
        console.error('Error fetching branch data:', error);
      }
    });
  }
  
    }


