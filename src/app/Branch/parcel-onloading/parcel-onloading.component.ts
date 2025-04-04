// import { Component } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MessageService } from 'primeng/api';
// import { BranchService } from 'src/app/service/branch.service';
// import { TokenService } from 'src/app/service/token.service';
// declare var $: any;
// declare const SlimSelect: any; 
// import {  ElementRef, ViewChild, AfterViewInit } from '@angular/core';

// @Component({
//   selector: 'app-parcel-onloading',
//   templateUrl: './parcel-onloading.component.html',
//   styleUrls: ['./parcel-onloading.component.scss']
// })
// export class ParcelOnloadingComponent {

//    adminData: any;
//     form!: FormGroup;
//     form1:FormGroup;
//     cities:any;
//     vehicle: any = {}; 
//     branchdata:any;
//     data:any;
//     searchTerm: string = '';       // For binding with input field
//     idselectmsg: string = '';
//     errorMessage: string = '';
//     data2:any;
//     data1:any;
//     LoadSuccess: boolean = false;
//     allSelected: boolean = false;
//     tbcdata:any;
//     @ViewChild('selectElem') selectElem!: ElementRef;
//     @ViewChild('demoSelect') demoSelect!: ElementRef;


//     constructor(private api: BranchService, private fb: FormBuilder, private messageService:MessageService, private router:Router, private activeroute:ActivatedRoute) {
//         this.form = this.fb.group({
//           fromDate: ['', Validators.required],
//           toDate: ['', Validators.required],
//           fromCity: this.fb.array([], Validators.required),
//           toCity: ['', Validators.required],
//           vehicalNumber: ['', Validators.required],
//           branch: ['', Validators.required],
//         });
  
//         this.form1 = this.fb.group({
//           fromBookingDate: ['', Validators.required],
//           toBookingDate: ['', Validators.required],
//           fromCity: this.fb.array([], Validators.required),
//           toCity: ['', Validators.required],
//           branch: ['', Validators.required],
//           vehicleNo: ['', Validators.required],
//           grnNo: this.fb.array([], Validators.required), // ✅ FormArray for GRN numbers
//           bookingType: ['Topay'],
//         });
        
        
      
//     }
//     ngOnInit() {
//       this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
//       this.getCities();
//       this. getvehicleData();
   
//     }
  
    
//     getCities() {
//       this.api.GetCities().subscribe({
//         next: (response: any) => {
//           console.log('Cities data:', response);
//           this.cities = response; 
//         },
//         error: (error: any) => {
//           console.error('Error fetching cities:', error);
//           alert('Failed to fetch cities data.');
//         },
//       });
    
//     }
  
//     get fromCityArray() {
//       return this.form.get('fromCity') as FormArray;
//     }
  
//     onToCityChange(event: any) {
//       const fromCityArray = this.form1.get('fromCity') as FormArray;
    
//       fromCityArray.clear();  
    
//       // ✅ Get all selected options
//       const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
    
//       // ✅ Add selected cities to FormArray
//       selectedOptions.forEach(cityName => fromCityArray.push(this.fb.control(cityName)));
    
//       console.log('Selected To Cities:', fromCityArray.value);
//     }
    
    

//     ngAfterViewInit(): void {
//       new SlimSelect({
//         select: this.demoSelect.nativeElement,
//       });
    
//       setTimeout(() => {
//         $(this.demoSelect.nativeElement).select2();
//         $(this.demoSelect.nativeElement).on('select2:select select2:unselect', (event: any) => {
//           const selectedCities = $(this.demoSelect.nativeElement).val(); // Get selected values
//           this.form1.patchValue({ fromCity: selectedCities }); // Update form control
//         });
//       }, 0);
//     }
    
    



   
  
//     onLoad() {
//       const formValues = this.form.value;
//       const payload = {
//         fromDate: formValues.fromDate,
//         toDate: formValues.toDate,
//         fromCity: formValues.fromCity,
//         toCity: formValues.toCity,
//         vehicalNumber: formValues.vehicalNumber,
//         branch: Array.isArray(formValues.branch) ? formValues.branch : [formValues.branch],
//       };
    
//       console.log('Final Booking Data:', payload);
    
//       this.api.FilterParcelUnLoading(payload).subscribe({
//         next: (response: any) => {
//           console.log('Booking successful:', response);
    
//           // Extract and flatten the data
//           this.data = response?.data?.map((item: any) => {
//             const booking = item.bookings?.[0] || {}; // Handle nested bookings array safely
//             return {
//               lrNumber: booking.lrNumber || [], // Ensure lrNumber is an array
//               grnNo: booking.grnNo || [], // Ensure grnNo is an array
//               fromBranch: item.pickUpBranch || 'N/A',
//               toBranch: item.dropBranch || 'N/A',
//               fromCity: item.fromCity || 'N/A',
//               toCity: item.toCity || 'N/A',
//               bookingDate: booking.bookingDate || null,
//             };
//           });
    
//           console.log(this.data, 'Processed booking data');
//           this.LoadSuccess = true;
//         },
//         error: (error: any) => {
//           console.error('Booking failed:', error);
//           alert('Booking Failed. Please try again.');
//         },
//       });
//     }
    
//     setFormArray(controlName: string, values: any[]) {
//       const formArray = this.form1.get(controlName) as FormArray;
//       formArray.clear(); // ✅ Clear previous values
    
//       values.flat().forEach(value => { // ✅ Flatten the array and push values
//         formArray.push(this.fb.control(value));
//       });
//     }
    
//     onGrnNoChange(event: any, grnNo: string) {
//       const formArray = this.form1.get('grnNo') as FormArray;
    
//       if (event.target.checked) {
//         // Add if not already selected
//         if (!formArray.value.includes(grnNo)) {
//           formArray.push(this.fb.control(grnNo));
//         }
//       } else {
//         // Remove if unchecked
//         const index = formArray.value.indexOf(grnNo);
//         if (index > -1) {
//           formArray.removeAt(index);
//         }
//       }
    
//       // ✅ Update "Select All" status based on selected values
//       this.allSelected = this.data.length === formArray.value.length;
//       console.log('Selected GRN Numbers:', formArray.value);
//     }
    
//     // ✅ Handle "Select All" checkbox
//     onSelectAllChange(event: any) {
//       const formArray = this.form1.get('grnNo') as FormArray;
    
//       if (event.target.checked) {
//         // ✅ Select all if checked
//         this.data.forEach((row:any) => {
//           if (!formArray.value.includes(row.grnNo)) {
//             formArray.push(this.fb.control(row.grnNo));
//           }
//         });
//       } else {
//         // ✅ Deselect all if unchecked
//         formArray.clear();
//       }
    
//       // ✅ Update "Select All" status
//       this.allSelected = event.target.checked;
//       console.log('All GRN Numbers Selected:', formArray.value);
//     }

//     // onTocitySelect(event: any) {
//     //   const cityName = event.target.value;
//     //   if (cityName) {
//     //     this.api.GetBranchbyCity(cityName).subscribe(
//     //       (res: any) => {
//     //         console.log('Branches for selected city:', res);
//     //         this.tbcdata = res;
//     //       },
//     //       (error: any) => {
//     //         console.error('Error fetching branches:', error);
//     //       }
//     //     );
//     //   } else {
//     //     this.tbcdata = [];
//     //   }
//     // }
    
  
//     ParcelLoad() {
//       const payload = {
//         fromBookingDate: this.form1.value.fromBookingDate,
//         toBookingDate: this.form1.value.toBookingDate,
//         fromCity: this.form1.value.fromCity,
//         toCity: this.form1.value.toCity,
//         branch: this.data[0]?.branch || this.form.value.branch,
//         vehicleNo: this.form1.value.vehicleNo,
//         grnNo: this.form1.value.grnNo, // ✅ Only selected GRN numbers
//         bookingType: this.form1.value.bookingType,
//       };
    
//       console.log('Final Payload:', payload);
    
//       this.api.ParcelUnLoading(payload).subscribe({
//         next: (response: any) => {
//           console.log('Parcel loaded successfully:', response);
//           setTimeout(() => {
//             this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//               this.router.navigate(['/parcelunloading']);
//             });
//           }, 1000);
//         },
//         error: (error: any) => {
//           console.error('Parcel loading failed:', error);
//           alert('Parcel Loading Failed. Please try again.');
//         },
//       });
//     }
    
    
    
  
  
//     getvehicleData() {
//       this.api.VehicleData().subscribe({
//         next: (response: any) => {
//           console.log('Vehicle:', response);
//           this.vehicle = response; 
//         },
//         error: (error: any) => {
//           console.error('Error fetching vehicle data:', error);
//         }
//       });
//     }
  
  



// onTocitySelect(cityName: string) {
//   if (cityName) {
//     this.api.GetBranchbyCity(cityName).subscribe(
//       (res: any) => {
//         console.log('Branches for selected city:', res);
//         this.tbcdata = res;
//         console.log(this.tbcdata,"jjdfiydsgfisdyufgydsgf");
        
//       },
//       (error: any) => {
//         console.error('Error fetching branches:', error);
//       }
//     );
//   } else {
//     this.tbcdata = [];
//   }
// }
// }





import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
declare var $: any;
declare const SlimSelect: any; 
import {  ElementRef, ViewChild, AfterViewInit } from '@angular/core';

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
    allSelected: boolean = false;
    tbcdata:any;
    @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('branch') branch!: ElementRef;
  // @ViewChild('selectElem2') selectElem2!: ElementRef;
  // @ViewChild('droupbranch') droupbranch!: ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  selectedbranch: any;
    constructor(private api: BranchService, private fb: FormBuilder, private messageService:MessageService, private router:Router, private activeroute:ActivatedRoute) {
      this.form = this.fb.group({
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        fromCity: this.fb.array([], Validators.required),
        toCity: ['', Validators.required],
        vehicalNumber: ['', Validators.required],
        branch: this.fb.array([]),  // ✅ Ensure branch is an array
      });
        this.form1 = this.fb.group({
          fromBookingDate: ['', Validators.required],
          toBookingDate: ['', Validators.required],
          fromCity: this.fb.array([], Validators.required),  
          toCity: ['', Validators.required],  // ✅ Ensure toCity is a FormControl, NOT a FormArray
          branch: ['', Validators.required],
          vehicleNo: ['', Validators.required],
          grnNo: this.fb.array([], Validators.required),
          bookingType: ['Topay'],
        });
    }
    ngOnInit() {
      this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
      this.getCities();
      this.getvehicleData();


      this.form1 = this.fb.group({
        branch: new FormArray([]), // Initialize as FormArray
        fromCity: new FormArray([])})
      
    }
    
    
    ngAfterViewInit(): void {
      new SlimSelect({
        select: this.demoSelect.nativeElement
      });  
      setTimeout(() => {
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
          const selectedCity = event.params.data.id;
          const fromCityArray = this.form1.get('fromCity') as FormArray;
          fromCityArray.clear(); // ✅ Clear previous selections
          fromCityArray.push(new FormControl(selectedCity)); // ✅ Push new value
          console.log('Updated From City:', this.form1.value.fromCity);
          this.onTocitySelect({ target: { value: selectedCity } });
        });

        $(this.branch.nativeElement).select2();

      $(this.branch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        const branchArray = this.form1.get('branch') as FormArray;
        branchArray.clear(); // Clear previous selections
        branchArray.push(new FormControl(selectedBranch)); // Push new value
        console.log('Updated Branch:', this.form1.value.branch);
        this.selectedbranch({ target: { value: selectedBranch } });

      });
      }, 0);




    }
    onTocitySelect(event: any) {
      console.log('Event triggered:', event);
      console.log('Selected City:', event.target.value);
      const cityName = event.target.value;
      if (cityName) {
        this.api.GetBranchbyCity(cityName).subscribe(
          (res: any) => {
            console.log('Branches for selected city:', res);
            this.tbcdata = res;
          },
          (error: any) => {
            console.error('Error fetching branches:', error);
          }
        );
      } else {
        this.tbcdata = [];
      }
      
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



    onFromCityChange(event: any) {
      const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
      const fromCityArray = this.form.get('fromCity') as FormArray;
      fromCityArray.clear(); // Clear previous selections
    
      selectedOptions.forEach(city => {
        fromCityArray.push(new FormControl(city));
      });
      console.log('Selected From Cities:', fromCityArray.value);
    }
    
    onLoad() {
      const formValues = this.form.value;
      console.log('Form Values before sending:', formValues); // Debugging
      const payload = {
        fromDate: formValues.fromDate,
        toDate: formValues.toDate,
        fromCity: formValues.fromCity.length ? formValues.fromCity : [], // Ensure array
        toCity: formValues.toCity || '', // Ensure it's a string
        vehicalNumber: formValues.vehicalNumber,
        branch: formValues.branch// ✅ Ensure a string
      };
    
      console.log('Final Booking Data:', payload); 
      this.api.FilterParcelUnLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Booking successful:', response);
          this.LoadSuccess = true;
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
    
    onGrnNoChange(event: any, grnNo: string) {
      const formArray = this.form1.get('grnNo') as FormArray;
    
      if (event.target.checked) {
        // Add if not already selected
        if (!formArray.value.includes(grnNo)) {
          formArray.push(this.fb.control(grnNo));
        }
      } else {
        // Remove if unchecked
        const index = formArray.value.indexOf(grnNo);
        if (index > -1) {
          formArray.removeAt(index);
        }
      }
    
      // ✅ Update "Select All" status based on selected values
      this.allSelected = this.data.length === formArray.value.length;
      console.log('Selected GRN Numbers:', formArray.value);
    }
    
    // ✅ Handle "Select All" checkbox
    onSelectAllChange(event: any) {
      const formArray = this.form1.get('grnNo') as FormArray;
    
      if (event.target.checked) {
        // ✅ Select all if checked
        this.data.forEach((row:any) => {
          if (!formArray.value.includes(row.grnNo)) {
            formArray.push(this.fb.control(row.grnNo));
          }
        });
      } else {
        // ✅ Deselect all if unchecked
        formArray.clear();
      }
    
      // ✅ Update "Select All" status
      this.allSelected = event.target.checked;
      console.log('All GRN Numbers Selected:', formArray.value);
    }
    ParcelLoad() {
      const payload = {
        fromBookingDate: this.form1.value.fromBookingDate,
        toBookingDate: this.form1.value.toBookingDate,
        fromCity: this.form1.value.fromCity,
        toCity: this.form1.value.toCity,
        branch: this.data[0]?.branch || this.form.value.branch,
        vehicleNo: this.form1.value.vehicleNo,
        grnNo: this.form1.value.grnNo, // ✅ Only selected GRN numbers
        bookingType: this.form1.value.bookingType,
      };
    
      console.log('Final Payload:', payload);
    
      this.api.ParcelUnLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
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
  
 
    

   


 




    

}
