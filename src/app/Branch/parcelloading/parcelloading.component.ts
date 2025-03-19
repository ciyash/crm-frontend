import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'app-parcelloading',
  templateUrl: './parcelloading.component.html',
  styleUrls: ['./parcelloading.component.scss'],
})
export class ParcelloadingComponent implements OnInit {
  adminData: any;
  form!: FormGroup;
  form1:FormGroup;
  cities:any;
  vehicle: any = {}; 
  branchdata:any;
  data:any;
  searchTerm: string = '';       // For binding with input field
  idselectmsg: string = '';
  errorMessage: string = '';
  data2:any;
  data1:any;
  LoadSuccess: boolean = false;
  constructor(private api: BranchService, private token:TokenService, private fb: FormBuilder, private messageService:MessageService, private router:Router, private activeroute:ActivatedRoute) {
      this.form = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        fromCity: ['', Validators.required],
        toCity: this.fb.array([], Validators.required),
        pickUpBranch: ['', Validators.required],
      });

      this.form1 = this.fb.group({
        fromBranch: ['', Validators.required],
        toBranch: ['', Validators.required],
        loadingDate: ['', Validators.required],
        vehicalNumber: ['', Validators.required],
        driverName: ['', Validators.required],
        driverNo: ['', Validators.required],
        fromBookingDate: ['', Validators.required],
        toBookingDate: ['', Validators.required],
        fromCity: ['', Validators.required],
        userName:['Test'],
        toCity: this.fb.array([], Validators.required),
        grnNo: this.fb.array([], Validators.required),
        lrNumber: this.fb.array([], Validators.required),
      });
    
  }
  ngOnInit() {
    this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
    this.adminData = this.token.getToken();
    console.log('Admin Data:', this.adminData);
    this.getCities();
    this. getVehicleData();
    this.branchData();
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
    return this.form.get('toCity') as FormArray;
  }

  onToCityChange(event: any, cityName: string) {
    if (event.target.checked) {
      // ✅ Push value to FormArray if checked
      this.toCityArray.push(this.fb.control(cityName));
    } else {
      // ✅ Remove value from FormArray if unchecked
      const index = this.toCityArray.controls.findIndex(control => control.value === cityName);
      if (index >= 0) {
        this.toCityArray.removeAt(index);
      }
    }
    console.log('Selected To Cities:', this.toCityArray.value);
  }
 
  onLoad() {
    const formValues = this.form.value;
    const payload = {
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      pickUpBranch: this.form.value.pickUpBranch
    };
    
    console.log('Final Booking Data:', payload);
    
    this.api.FilterParcelLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Booking successful:', response);
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Load successfully' });
        this.data = response || [];
        // alert('Booking Successful!');
        this.LoadSuccess = true;
        // ✅ Assign loaded data to form1 fields
        if (this.data.length > 0) {
          this.form1.patchValue({
            fromBranch: this.data[0].pickUpBranch,
            toBranch: this.data[0].dropBranch,
            fromBookingDate: this.form.value.startDate,
            toBookingDate: this.form.value.endDate,
            fromCity: this.form.value.fromCity,
            loadingDate: '', // You can keep it empty for user input
            vehicalNumber: '',
            driverName: '',
            driverNo: '',
          });
  
          // ✅ Set `toCity`, `grnNo`, and `lrNumber` as FormArray
          this.setFormArray('toCity', this.data.map((d: any) => d.toCity));
          this.setFormArray('grnNo', this.data.map((d: any) => d.grnNumber));
          this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
        }
      },
      error: (error: any) => {
        console.error('Booking failed:', error);
        alert('Booking Failed. Please try again.');
      },
    });
  }

  setFormArray(controlName: string, values: any[]) {
    const formArray = this.form1.get(controlName) as FormArray;
    formArray.clear(); // ✅ Clear previous values
  
    values.forEach(value => {
      formArray.push(this.fb.control(value));
    });
  }

  ParcelLoad() {
    const payload = {
      fromBranch: this.form1.value.fromBranch,
      toBranch: this.form1.value.toBranch,
      loadingDate: this.form1.value.loadingDate,
      vehicalNumber: this.form1.value.vehicalNumber,
      driverName: this.form1.value.driverName,
      driverNo: this.form1.value.driverNo,
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      userName: this.form1.value.userName,
      toCity: this.form1.value.toCity,
      grnNo: this.form1.value.grnNo,
      lrNumber: this.form1.value.lrNumber,
    };
  
    console.log('Final Payload:', payload);
    
    this.api.ParcelLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        alert('Parcel Loaded Successfully!');
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('Parcel Loading Failed. Please try again.');
      },
    });
  }
  

 

  getVehicleData() {
    this.api.getData('Vehicle').subscribe({
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
    this.api.getData('branch').subscribe({
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


