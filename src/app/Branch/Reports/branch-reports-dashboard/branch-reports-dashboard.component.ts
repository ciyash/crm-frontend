import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
// jsdhdfbhddshn
@Component({
  selector: 'app-branch-reports-dashboard',
  templateUrl: './branch-reports-dashboard.component.html',
  styleUrls: ['./branch-reports-dashboard.component.scss'],
})
export class BranchReportsDashboardComponent implements AfterViewInit {
  // ViewChild regular cuscomer
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('selectElem2') selectElem2!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
  @ViewChild('droupbranch') droupbranch!: ElementRef;

  @ViewChild('summaryfromcity') summaryfromcity!: ElementRef;
  @ViewChild('summarytocity') summarytocity!: ElementRef;
  @ViewChild('summarypickup') summarypickup!: ElementRef;
  @ViewChild('summarydroup') summarydroup!: ElementRef;

  searchResults: any[] = []; // To store search results


  // @ViewChild('allParcelfromcity') allParcelfromcity!: ElementRef;
  // @ViewChild('allParceltocity') allParceltocity!: ElementRef;
  // @ViewChild('allParcelPickupbranch') allParcelPickupbranch!: ElementRef;
  // @ViewChild('allParcelDroupBranch') allParcelDroupBranch!: ElementRef;

  // @ViewChild('vechicle') vechicle!: ElementRef;
  // @ViewChild('allparecleserial') allparecleserial!: ElementRef;
  // @ViewChild('allparcelcity') allparcelcity!: ElementRef;
  // @ViewChild('cancelfromcity') cancelfromcity!: ElementRef;
  // @ViewChild('canceltocity') canceltocity!: ElementRef;
  // @ViewChild('cancelpickup') cancelpickup!: ElementRef;
  // @ViewChild('canceldrop') canceldrop!: ElementRef;
  // @ViewChild('customerfromcity') customerfromcity!: ElementRef;
  // @ViewChild('customertocity') customertocity!: ElementRef;
  // @ViewChild('customerPickupbranch') customerPickupbranch!: ElementRef;
  // @ViewChild('customerDroupBranch') customerDroupBranch!: ElementRef;

  // Form groups
  form: FormGroup;
  form1: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  form5!: FormGroup;
  form6: FormGroup;
  form7: FormGroup;

  // Data properties
  citydata: any;
  branchdata: any;
  allgetvechicle: any;
  seriesdata: any;
  mobiledata: any;
  customerdata: any;
  summaryData: any;
  parcelBookingData: any;
  data: any = [];
  pdata: any;
  tbcdata: any;
  onPickupBranchSelect: any;
  onDropBranchSelect: any;

  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService
  ) {
    // Parcel Booking Report
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      bookingStatus: [''],
      bookingType: [''],
    });

    // All Parcel Booking Report
    this.form1 = this.fb.group({
      startDate: [this.getTodayDateString(), Validators.required],
      endDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
      bookingStatus: [''],
      vehicalNumber: [''],
    });

    // Parcel Booking Report With Serial No
    this.form3 = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
    });

    // Parcel Booking Details On Mobile Number
    this.form3 = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      senderMobile: [''],
      receiverMobile: [''],
      bookingType: [''],
      bookingStatus: [''],
    });

    // Regular Customer Booking
    this.form5 = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
      name: [''],
    });

    // Parcel Booking Summary Report
    this.form6 = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
    });

    // Parcel Cancel Report
    this.form7 = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      bookingType: [''],
    });
    // mobile
    this.form4 = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      mobile: ['', Validators.required],
      reportType: ['ALL', Validators.required],
      bookingType: [''],
      bookingStatus: [''],
    });
  }

  ngOnInit() {
    // Fetch cities
    this.api.GetCities().subscribe((res: any) => {
      console.log('citydata', res);
      this.citydata = res;
    });

    // Fetch branches
    this.api.GetBranch().subscribe((res: any) => {
      console.log('allbranch:', res);
      
      this.branchdata = res;
    });

    // Fetch vehicles
    this.api.VehicleData().subscribe((res: any) => {
      console.log('allvechicle:', res);
      this.allgetvechicle = res;
    });
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      // From City
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form5.get('fromCity')?.setValue(selectedCity);
        this.onFromcitySelect({ target: { value: selectedCity } });
      });
  
      // To City
      $(this.selectElem2.nativeElement).select2();
      $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form5.get('toCity')?.setValue(selectedCity);
        this.onTocitySelect({ target: { value: selectedCity } });
      });
  
      // Pickup Branch
      $(this.pickupbranch.nativeElement).select2();
      $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form5.get('pickUpBranch')?.setValue(selectedBranch);
      });
  
      // Drop Branch
      $(this.droupbranch.nativeElement).select2();
      $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form5.get('dropBranch')?.setValue(selectedBranch);
      });

      // summary

      $(this.summaryfromcity.nativeElement).select2();
      $(this.summaryfromcity.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form6.get('fromCity')?.setValue(selectedCity);
        this.onFromcitySelect({ target: { value: selectedCity } });
      });
  
      // To City
      $(this.summarytocity.nativeElement).select2();
      $(this.summarytocity.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form6.get('toCity')?.setValue(selectedCity);
        this.onTocitySelect({ target: { value: selectedCity } });
      });
  
      // Pickup Branch
      $(this.summarypickup.nativeElement).select2();
      $(this.summarypickup.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form6.get('pickUpBranch')?.setValue(selectedBranch);
      });
  
      // Drop Branch
      $(this.summarydroup.nativeElement).select2();
      $(this.summarydroup.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form6.get('dropBranch')?.setValue(selectedBranch);
      });


    }, 0);
  }
  
  

  // onPickupBranchSelect(event: any) {
  //   const branchId = event.target.value;
  //   console.log('Pickup Branch selected:', branchId);
  //   // Add any logic here if needed
  // }
  
  // onDropBranchSelect(event: any) {
  //   const branchId = event.target.value;
  //   console.log('Drop Branch selected:', branchId);
  //   // Add any logic here if needed
  // }
  

  onFromcitySelect(event: any) {
    const cityName = event.target.value;
    if (cityName) {
      this.api.GetBranchbyCity(cityName).subscribe(
        (res: any) => {
          console.log('Branches for selected city:', res);
          this.pdata = res;
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    } else {
      this.pdata = [];
    }
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


  // PARCEL BOOKING REPORT

  parcelbooking() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      bookingStatus: this.form.value.bookingStatus,
      bookingType: this.form.value.bookingType,
    };
    console.log('parcelbooing:', payload);

    this.api.ParcelBookingReport(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel reports1:', response);
        const finalData = {
          ...response,
          fromDate: this.form.value.fromDate,
          toDate: this.form.value.toDate,
        };
        this.router.navigateByUrl('/reports', { state: { data: finalData } });
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again.');
      },
    });
  }
  // All Parcel Booking Report
  AllParcelBooking() {
    const payload1 = {
      startDate: this.form1.value.startDate,
      endDate: this.form1.value.endDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity,
      pickUpBranch: this.form1.value.pickUpBranch,
      dropBranch: this.form1.value.dropBranch,
      bookingStatus: this.form1.value.bookingStatus,
      vehicalNumber: this.form1.value.vehicalNumber || null,
    };
    console.log('All Parcel Booking Payload:', payload1);
    this.api.AllParcelBookingReport(payload1).subscribe({
      next: (response: any) => {
        console.log('All Parcel loaded successfully:', response);
        const finalData1 = {
          ...response,
          startDate: this.form1.value.startDate,
          endDate: this.form1.value.endDate,
        };
        this.router.navigateByUrl('/allpercelbooking', {
          state: { data1: finalData1 },
        });
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again.');
      },
    });
  }

  // Parcel Booking Report With Serial No
  parcelbookingserieno(): void {
    if (this.form3.invalid) {
      this.form3.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }
    const payload2 = {
      fromDate: this.form3.value.fromDate,
      toDate: this.form3.value.toDate,
      fromCity: this.form3.value.fromCity,
      toCity: this.form3.value.toCity,
    };
    console.log('Serial No Report Payload:', payload2);
    this.api.ParcelReportSno(payload2).subscribe({
      next: (response: any) => {
        this.seriesdata = response;
        console.log('Parcel Booking Series Data:', this.seriesdata);
        this.router.navigateByUrl('/bookingserial', {
          state: { data2: response },
        });
      },
      error: (error: any) => {
        console.error('Parcel Serial No Report loading failed:', error);
        this.toast.error(
          'Parcel Serial No Report Loading Failed. Please try again.'
        );
      },
    });
  }



  // Parcel Booking Summary Report
  // BookingSummeryReport(): void {
  //   const payload5 = {
  //     fromDate: this.form6.value.fromDate,
  //     toDate: this.form6.value.toDate,
  //     fromCity: this.form6.value.fromCity,
  //     toCity: this.form6.value.toCity,
  //     pickUpBranch: this.form6.value.pickUpBranch,
  //     dropBranch: this.form6.value.dropBranch,
  //   };
  //   console.log('Booking Summary Report Payload:', payload5);

  //   this.api.ParcelBookingSummeryReport(payload5).subscribe({
  //     next: (response: any) => {
  //       this.summaryData = response;

  //       // Assuming your backend sends success message as response.message or similar
  //       const successMessage =
  //         response.message || 'Booking summary report loaded successfully!';
  //       this.toast.success(successMessage);

  //       console.log('Booking Summary Report Response:', this.summaryData);

  //       const finalData9 = {
  //         ...response,
  //         fromDate: this.form6.value.fromDate,
  //         toDate: this.form6.value.toDate,
  //       };
  //       this.router.navigateByUrl('/bookingsummary', {
  //         state: { data5: finalData9 },
  //       });
  //     },
  //     error: (error: any) => {
  //       console.error('Parcel Summary Report loading failed:', error);

  //       // Extract error message from backend response
  //       // This depends on your API error structure; examples:
  //       // const errorMessage = error.error?.message || error.message || 'Loading failed, please try again.';
  //       const errorMessage =
  //         error.error?.message ||
  //         error.message ||
  //         'Parcel Summary Report Loading Failed. Please try again.';
  //       this.toast.error(errorMessage);
  //     },
  //   });
  // }

  BookingSummeryReport(): void {
    const payload5 = {
      fromDate: this.form6.value.fromDate,
      toDate: this.form6.value.toDate,
      fromCity: this.form6.value.fromCity,
      toCity: this.form6.value.toCity,
      pickUpBranch: this.form6.value.pickUpBranch,
      dropBranch: this.form6.value.dropBranch,
    };
  
    console.log('Booking Summary Report Payload:', payload5);
  
    this.api.ParcelBookingSummeryReport(payload5).subscribe({
      next: (response: any) => {
        this.summaryData = response;
  
        const successMessage =
          response.message || 'Booking summary report loaded successfully!';
        this.toast.success(successMessage);
  
        const finalData9 = {
          ...response,
          fromDate: this.form6.value.fromDate,
          toDate: this.form6.value.toDate,
        };
  
        // ✅ Store in localStorage
        localStorage.setItem('bookingSummaryData', JSON.stringify(finalData9));
  
        // ✅ Open new tab
        window.open('/bookingsummary', '_blank');
      },
      error: (error: any) => {
        const errorMessage =
          error.error?.message ||
          error.message ||
          'Parcel Summary Report Loading Failed. Please try again.';
        this.toast.error(errorMessage);
      },
    });
  }
  
  // Parcel Cancel Report

  cancelReport(): void {
    const payload6 = {
      fromDate: this.form7.value.fromDate,
      toDate: this.form7.value.toDate,
      fromCity: this.form7.value.fromCity,
      toCity: this.form7.value.toCity,
      bookingType: this.form7.value.bookingType,
    };

    console.log('Cancel Report Payload:', payload6);

    this.api.ParcelCancelReport(payload6).subscribe({
      next: (response: any) => {
        console.log('Cancel Report Loaded:', response);
        const finalData = {
          ...response,
          fromDate: payload6.fromDate,
          toDate: payload6.toDate,
        };

        // Save data to localStorage
        localStorage.setItem('cancelReportData', JSON.stringify(finalData));

        // ✅ Show success toast
        this.toast.success('Cancel Report generated successfully!');

        // Open new tab
        window.open('/cancel-report', '_blank');
      },
      error: (error: any) => {
        console.error('Cancel Report Loading Failed:', error);

        // ❌ Show error toast
        this.toast.error('Cancel Report loading failed. Please try again.');
      },
    });
  }

   
    parcelbookingsmobile(): void {
      if (this.form4.invalid) {
        this.form4.markAllAsTouched();
        this.toast.error('Please enter mobile');
        return;
      }
    
      const payload3 = {
        fromDate: this.form4.value.fromDate,
        toDate: this.form4.value.toDate,
        mobile: this.form4.value.mobile,
        reportType: this.form4.value.reportType,
        bookingType: this.form4.value.bookingType,
        bookingStatus: this.form4.value.bookingStatus,
      };
    
      console.log('Mobile Report Payload:', payload3);
    
      this.api.ParcelBookingMobileNumber(payload3).subscribe({
        next: (response: any) => {
          this.mobiledata = response;
    
          const successMessage = response?.message || 'Parcel Booking Report loaded successfully';
          this.toast.success(successMessage);
    
          const finalData5 = {
            ...response,
            fromDate: this.form4.value.fromDate,
            toDate: this.form4.value.toDate,
          };
    
          // ✅ Store the data temporarily in localStorage
          localStorage.setItem('mobileBookingData', JSON.stringify(finalData5));
    
          // ✅ Open new tab with route
          window.open('/bookingmobile', '_blank');
        },
        error: (error: any) => {
          console.error('Parcel Mobile Report loading failed:', error);
          const errorMessage = error?.error?.message || error?.message || 'Parcel Mobile Report loading failed. Please try again.';
          this.toast.error(errorMessage);
        },
      });
    }
    




  bookingCustomer(): void {
    if (this.form5.invalid) {
      this.toast.error('Please fill all required fields.');
      this.form5.markAllAsTouched();
      return;
    }
  
    const payload4 = {
      fromDate: this.form5.value.fromDate,
      name: this.form5.value.name,
      toDate: this.form5.value.toDate,
      fromCity: this.form5.value.fromCity,
      toCity: this.form5.value.toCity,
      pickUpBranch: this.form5.value.pickUpBranch,
      dropBranch: this.form5.value.dropBranch,
    };
    console.log('Form5 Values:', this.form5.value);

    console.log('Customer Report Payload:', payload4);
  
    this.api.ParcelBookingRegularCustomer(payload4).subscribe({
      next: (response: any) => {
        this.customerdata = response;
        console.log("regularDara:",this.customerdata)
        const successMessage = response.message || 'Customer report loaded successfully!';
        this.toast.success(successMessage);
        console.log('Form5 Values:', this.form5.value);

  
        const finalData2 = {
          ...response,
          fromDate: this.form5.value.fromDate,
          toDate: this.form5.value.toDate,
        };
        
  
        localStorage.setItem('regularCustomerData', JSON.stringify(finalData2));
  
        window.open('/regularcustmer', '_blank');
      },
      error: (error: any) => {
        console.error('Customer Report loading failed:', error);
        const errorMessage =
          error.error?.message || error.message || 'Customer Report Loading Failed. Please try again.';
        this.toast.error(errorMessage);
      },
    });
  }
  



  searchUser(): void {
    const searchTerm = this.form5.get('name')?.value?.trim();
  
    if (searchTerm && searchTerm.length >= 2) {
      this.api.searchUser(searchTerm).subscribe(
        (res: any) => {
          this.searchResults = res;
        },
        (err: any) => {
          console.error('Search Error:', err);
          this.searchResults = [];
        }
      );
    } else {
      this.searchResults = [];
    }
  }
  
  selectUser(name: string): void {
    this.form5.get('name')?.setValue(name); // Set the selected name in the input
    this.searchResults = []; // Clear the search result list
  }
  
  
}
