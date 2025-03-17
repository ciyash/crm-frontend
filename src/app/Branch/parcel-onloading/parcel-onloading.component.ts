import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-parcel-onloading',
  templateUrl: './parcel-onloading.component.html',
  styleUrls: ['./parcel-onloading.component.scss']
})
export class ParcelOnloadingComponent {

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
    constructor(private api: BranchService, private fb: FormBuilder, private messageService:MessageService, private router:Router, private activeroute:ActivatedRoute) {
        this.form = this.fb.group({
          fromDate: ['', Validators.required],
          toDate: ['', Validators.required],
          fromCity: this.fb.array([], Validators.required),
          toCity: ['', Validators.required],
          vehicleNo: ['', Validators.required],
          branch: ['', Validators.required],
        });
  
        this.form1 = this.fb.group({
          fromBookingDate: ['', Validators.required],
          toBookingDate: ['', Validators.required],
          fromCity: this.fb.array([], Validators.required),
          toCity: ['', Validators.required],
          branch:['', Validators.required],
          vehicleNo: ['', Validators.required],
          grnNo: this.fb.array([], Validators.required),
          bookingType:["Topay"],
        });
      
    }
    ngOnInit() {
      this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
      this.getCities();
      this. getvehicleData();
      this.branchData();
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
  
    get fromCityArray() {
      return this.form.get('fromCity') as FormArray;
    }
  
    onToCityChange(event: any, cityName: string) {
      if (event.target.checked) {
        // ✅ Push value to FormArray if checked
        this.fromCityArray.push(this.fb.control(cityName));
      } else {
        // ✅ Remove value from FormArray if unchecked
        const index = this.fromCityArray.controls.findIndex(control => control.value === cityName);
        if (index >= 0) {
          this.fromCityArray.removeAt(index);
        }
      }
      console.log('Selected To Cities:', this.fromCityArray.value);
    }
   
    onLoad() {
      const formValues = this.form.value;
      const payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        vehicleNo: this.form.value.vehicleNo,
        branch: this.form.value.branch,
      };
      
      console.log('Final Booking Data:', payload);
      
      this.api.FilterParcelUnLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Booking successful:', response);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Load successfully' });
          this.data = response || [];
          // alert('Booking Successful!');
          this.LoadSuccess = true;
          // ✅ Assign loaded data to form1 fields
          if (this.data.length > 0) {
            this.form1.patchValue({
              branch: this.data[0].branch,
              fromBookingDate: this.form.value.fromDate,
              toBookingDate: this.form.value.toDate,
              toCity: this.form.value.toCity,
              vehicleNo: this.form.value.vehicleNo,
            });
    
            // ✅ Set `toCity`, `grnNo`, and `lrNumber` as FormArray
            this.setFormArray('fromCity', this.data.map((d: any) => d.fromCity));
            // this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
            this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo).flat());
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
    
      values.flat().forEach(value => { // ✅ Flatten the array and push values
        formArray.push(this.fb.control(value));
      });
    }
    
  
    ParcelLoad() {
      const payload = {
        fromBookingDate: this.form1.value.fromBookingDate,
        toBookingDate: this.form1.value.toBookingDate,
        fromCity: this.form1.value.fromCity,
        toCity: this.form1.value.toCity,
        branch: this.data[0]?.branch || this.form.value.branch,
        vehicleNo: this.form1.value.vehicleNo,
        grnNo: this.form1.value.grnNo,
        bookingType:this.form1.value.bookingType,
      };
    
      console.log('Final Payload:', payload);
      
      this.api.ParcelUnLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          // alert('Parcel Loaded Successfully!');
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/parcelunloading']);
            });
          }, 1000);
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          alert('Parcel Loading Failed. Please try again.');
        },
      });
    }
    
  
  
    getvehicleData() {
      this.api.VehicleData().subscribe({
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
