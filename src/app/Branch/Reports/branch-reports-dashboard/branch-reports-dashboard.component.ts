import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
// jsdhdfbhddshn
@Component({
  selector: 'app-branch-reports-dashboard',
  templateUrl: './branch-reports-dashboard.component.html',
  styleUrls: ['./branch-reports-dashboard.component.scss'],
})
export class BranchReportsDashboardComponent implements AfterViewInit {
  // ViewChild declarations for Select2 elements
  @ViewChild('allParcelfromcity') allParcelfromcity!: ElementRef;
  @ViewChild('allParceltocity') allParceltocity!: ElementRef;
  @ViewChild('allParcelPickupbranch') allParcelPickupbranch!: ElementRef;
  @ViewChild('allParcelDroupBranch') allParcelDroupBranch!: ElementRef;
  @ViewChild('vechicle') vechicle!: ElementRef;
  @ViewChild('allparecleserial') allparecleserial!: ElementRef;
  @ViewChild('allparcelcity') allparcelcity!: ElementRef;
  @ViewChild('customerfromcity') customerfromcity!: ElementRef;
  @ViewChild('customertocity') customertocity!: ElementRef;
  @ViewChild('customerPickupbranch') customerPickupbranch!: ElementRef;
  @ViewChild('customerDroupBranch') customerDroupBranch!: ElementRef;
  @ViewChild('summaryfromcity') summaryfromcity!: ElementRef;
  @ViewChild('summarytocity') summarytocity!: ElementRef;
  @ViewChild('summarypickup') summarypickup!: ElementRef;
  @ViewChild('summarydroup') summarydroup!: ElementRef;
  @ViewChild('cancelfromcity') cancelfromcity!: ElementRef;
  @ViewChild('canceltocity') canceltocity!: ElementRef;
  @ViewChild('cancelpickup') cancelpickup!: ElementRef;
  @ViewChild('canceldrop') canceldrop!: ElementRef;

  // Form groups
  form: FormGroup;
  form1: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  form5: FormGroup;
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

  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService
  ) {
    // Parcel Booking Report
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
      bookingStatus: [''],
      bookingType: [''],
    });

    // All Parcel Booking Report
    this.form1 = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
      bookingStatus: [''],
      vehicalNumber: [''],
    });

    // Parcel Booking Report With Serial No
    this.form3 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
    });

    // Parcel Booking Details On Mobile Number
    this.form3 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      senderMobile: [''],
      receiverMobile: [''],
      bookingType: [''],
      bookingStatus: [''],
    });

    // Regular Customer Booking
    this.form5 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
    });

    // Parcel Booking Summary Report
    this.form6 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
    });

    // Parcel Cancel Report
    this.form7 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
      bookingType: [''],
      
    });
// mobile
    this.form4 = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      mobile: ['', Validators.required],
      reportType:[''],
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Helper method to initialize Select2
      const initializeSelect2 = (
        element: ElementRef,
        form: FormGroup,
        controlName: string
      ) => {
        $(element.nativeElement).select2();
        $(element.nativeElement).on('select2:select', (event: any) => {
          const value = event.params.data.id;
          console.log(`Selected ${controlName}:`, value);
          form.patchValue({ [controlName]: value });
        });
      };

      // All Parcel Booking Report
      initializeSelect2(this.allParcelfromcity, this.form1, 'fromCity');
      initializeSelect2(this.allParceltocity, this.form1, 'toCity');
      initializeSelect2(this.allParcelPickupbranch, this.form1, 'pickUpBranch');
      initializeSelect2(this.allParcelDroupBranch, this.form1, 'dropBranch');
      initializeSelect2(this.vechicle, this.form1, 'vehicalNumber');

      // Parcel Booking Report With Serial No
      initializeSelect2(this.allparecleserial, this.form3, 'fromCity');
      initializeSelect2(this.allparcelcity, this.form3, 'toCity');

      // Regular Customer Booking
      initializeSelect2(this.customerfromcity, this.form5, 'fromCity');
      initializeSelect2(this.customertocity, this.form5, 'toCity');
      initializeSelect2(this.customerPickupbranch, this.form5, 'pickUpBranch');
      initializeSelect2(this.customerDroupBranch, this.form5, 'dropBranch');

      // Parcel Booking Summary Report
      initializeSelect2(this.summaryfromcity, this.form6, 'fromCity');
      initializeSelect2(this.summarytocity, this.form6, 'toCity');
      initializeSelect2(this.summarypickup, this.form6, 'pickUpBranch');
      initializeSelect2(this.summarydroup, this.form6, 'dropBranch');

      // Parcel Cancel Report
      initializeSelect2(this.cancelfromcity, this.form7, 'fromCity');
      initializeSelect2(this.canceltocity, this.form7, 'toCity');
      initializeSelect2(this.cancelpickup, this.form7, 'pickUpBranch');
      initializeSelect2(this.canceldrop, this.form7, 'dropBranch');
      

    });
  }

  // Parcel Booking Report
  // parcelbooking() {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     this.toast.error('Please fill all required fields');
  //     return;
  //   }
  //   const payload = {
  //     fromDate: this.form.value.fromDate,
  //     toDate: this.form.value.toDate,
  //     fromCity: this.form.value.fromCity,
  //     toCity: this.form.value.toCity,
  //     bookingStatus: this.form.value.bookingStatus,
  //     bookingType: this.form.value.bookingType,
  //   };
  //   console.log("parcelbooing:",payload);
    
  //   this.api.ParcelBookingReport(payload).subscribe({
  //     next: (response: any) => {
  //       console.log('Parcel reports1:', response);
  //       this.router.navigateByUrl('/reports', { state: { data10: response } });
  //     },
  //     error: (error: any) => {
  //       console.error('Parcel loading failed:', error);
  //       this.toast.error('Parcel Loading Failed. Please try again.');
  //     },
  //   });
  // }

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
        this.router.navigateByUrl('/reports', { state: { data: response } });
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again.');
      },
    });
  }
  // All Parcel Booking Report
  AllParcelBooking() {
    if (this.form1.invalid) {
      this.form1.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }
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
        this.router.navigateByUrl('/allpercelbooking', {
          state: { data1: response },
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
        this.toast.error('Parcel Serial No Report Loading Failed. Please try again.');
      },
    });
  }

  // Parcel Booking Details On Mobile Number
  parcelbookingsmobile(): void {
    if (this.form4.invalid) {
      this.form4.markAllAsTouched();
      this.toast.error('Please fill all required fields');
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
        console.log('Parcel Booking mobiledata:', this.mobiledata);
        this.router.navigateByUrl('/bookingmobile', {
          state: { data6: response },
        });
      },
      error: (error: any) => {
        console.error('Parcel Mobile Report loading failed:', error);
        this.toast.error('Parcel Mobile Report Loading Failed. Please try again.');
      },
    });
  }

  // Regular Customer Booking
  bookingCustomer(): void {
    if (this.form5.invalid) {
      this.form5.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }
    const payload4 = {
      fromDate: this.form5.value.fromDate,
      toDate: this.form5.value.toDate,
      fromCity: this.form5.value.fromCity,
      toCity: this.form5.value.toCity,
      pickUpBranch: this.form5.value.pickUpBranch,
      dropBranch: this.form5.value.dropBranch,
    };
    console.log('Customer Report Payload:', payload4);
    this.api.ParcelBookingRegularCustomer(payload4).subscribe({
      next: (response: any) => {
        this.customerdata = response;
        console.log('Parcel Booking customerdata:', this.customerdata);
        this.router.navigateByUrl('/regularcustmer', {
          state: { data7: response },
        });
      },
      error: (error: any) => {
        console.error('Customer Report loading failed:', error);
        this.toast.error('Customer Report Loading Failed. Please try again.');
      },
    });
  }

  // Parcel Booking Summary Report
  BookingSummeryReport(): void {
    if (this.form6.invalid) {
      this.form6.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }
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
        console.log('Booking Summary Report Response:', this.summaryData);
        this.router.navigateByUrl('/bookingsummary', {
          state: { data5: response },
        });
      },
      error: (error: any) => {
        console.error('Parcel Summary Report loading failed:', error);
        this.toast.error('Parcel Summary Report Loading Failed. Please try again.');
      },
    });
  }

  // Parcel Cancel Report
  cancelReport(): void {
    if (this.form7.invalid) {
      this.form7.markAllAsTouched();
      this.toast.error('Please fill all required fields');
      return;
    }
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
        this.router.navigateByUrl('/parcelcancel', { state: { data4: response } });
      },
      error: (error: any) => {
        console.error('Cancel Report Loading Failed:', error);
        this.toast.error('Cancel Report Loading Failed. Please try again.');
      },
    });
  }
}