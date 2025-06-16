import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, NgZone } from '@angular/core';
@Component({
  selector: 'app-sub-dashboard-booking',
  templateUrl: './sub-dashboard-booking.component.html',
  styleUrls: ['./sub-dashboard-booking.component.scss']
})
export class SubDashboardBookingComponent implements AfterViewInit{
    //  regular cuscomer
    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('pickupbranch') pickupbranch!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
    // summary
    @ViewChild('summaryfromcity') summaryfromcity!: ElementRef;
    @ViewChild('summarytocity') summarytocity!: ElementRef;
    @ViewChild('summarypickup') summarypickup!: ElementRef;
    @ViewChild('summarydroup') summarydroup!: ElementRef;
    // cancelreport
    @ViewChild('cancelfromcity') cancelfromcity!: ElementRef;
    @ViewChild('canceltocity') canceltocity!: ElementRef;
    //  serial no
    @ViewChild('allparecleserial') allparecleserial!: ElementRef;
    @ViewChild('allparcelcity') allparcelcity!: ElementRef;
  
    // parcel Report
    @ViewChild('parcelfromcity') parcelfromcity!: ElementRef;
    @ViewChild('allparceltocity') allparceltocity!: ElementRef;
    // All parcel Report
  
    @ViewChild('reportcity') reportcity!: ElementRef;
    @ViewChild('reportfrom') reportfrom!: ElementRef;
    @ViewChild('reportpick') reportpick!: ElementRef;
    @ViewChild('reportdroup') reportdroup!: ElementRef;
    @ViewChild('vechile') vechile!: ElementRef;
    // Form groups
    form: FormGroup;
    form1: FormGroup;
    form3!: FormGroup;
    form2: FormGroup;
  
    form4: FormGroup;
    form5!: FormGroup;
    form6: FormGroup;
    form7: FormGroup;
    searchResults: any[] = []; // To store search results
  
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
  fromCityValue: any;
  filteredCityList: any;
  
    constructor(
      private api: BranchService,
      private fb: FormBuilder,
      private router: Router,
      private toast: ToastrService,
      private ngZone: NgZone,
      private cdRef: ChangeDetectorRef
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
      this.form2 = this.fb.group({
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: [''],
        toCity: [''],
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
      this.getProfileData();
      // Fetch cities
      this.api.GetCities().subscribe((res: any) => {
        console.log('citydata', res);
        this.citydata = res;
        this.getProfileData();
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
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.fromCityValue = res.branchId.city;
    
        // Filter city list and set values to forms
        this.filteredCityList = this.citydata.filter(
          (city: { cityName: any }) => city.cityName === this.fromCityValue
        );
    
        this.form.patchValue({ fromCity: this.fromCityValue });
        this.form1.patchValue({ fromCity: this.fromCityValue });
        this.form2.patchValue({ fromCity: this.fromCityValue });
        this.form7.patchValue({ fromCity: this.fromCityValue });
        this.form6.patchValue({ fromCity: this.fromCityValue });
        this.form5.patchValue({ fromCity: this.fromCityValue });
        // Trigger form change logic if needed
        this.onFromcitySelect({ target: { value: this.fromCityValue } });
    
        // Initialize and set select2 values after delay
        setTimeout(() => {
          // Update first select2
          $(this.selectElem.nativeElement).select2();
          $(this.selectElem.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.selectElem.nativeElement).prop('disabled', true).trigger('change.select2');
    
          // Update second select2
          $(this.reportfrom.nativeElement).select2();
          $(this.reportfrom.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.reportfrom.nativeElement).prop('disabled', true).trigger('change.select2');
          // form2
          $(this.allparecleserial.nativeElement).select2();
          $(this.allparecleserial.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.allparecleserial.nativeElement).prop('disabled', true).trigger('change.select2');
          // from7
          $(this.cancelfromcity.nativeElement).select2();
          $(this.cancelfromcity.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.cancelfromcity.nativeElement).prop('disabled', true).trigger('change.select2');

          $(this.summaryfromcity.nativeElement).select2();
          $(this.summaryfromcity.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.summaryfromcity.nativeElement).prop('disabled', true).trigger('change.select2');

          $(this.parcelfromcity.nativeElement).select2();
          $(this.parcelfromcity.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.parcelfromcity.nativeElement).prop('disabled', true).trigger('change.select2');

          
          
        }, 0);
      });
    }
    
  
    ngAfterViewInit(): void {
      setTimeout(() => {
        const initializeSelect2 = (
          element: ElementRef,
          form: FormGroup,
          controlName: string,
          callback?: (value: string) => void
        ) => {
          $(element.nativeElement).select2();
  
          // Set Select2 initial value from form control
          const initialValue = form.get(controlName)?.value ?? '';
          $(element.nativeElement).val(initialValue).trigger('change.select2');
  
          // Update form control when Select2 changes
          $(element.nativeElement).on('change', (event: any) => {
            const value = $(event.target).val();
  
            // Run inside Angular zone for proper change detection
            this.ngZone.run(() => {
              form.get(controlName)?.setValue(value);
              form.get(controlName)?.markAsDirty();
              this.cdRef.detectChanges();
  
              if (callback) callback(value);
            });
          });
        };
      
  
  
  
        initializeSelect2(this.reportfrom, this.form1, 'fromCity', (val) =>
        this.onFromcitySelect({ target: { value: val } })
      );
      initializeSelect2(this.reportcity, this.form1, 'toCity', (val) =>
        this.onTocitySelect({ target: { value: val } })
      );
      initializeSelect2(this.reportpick, this.form1, 'pickUpBranch');
      initializeSelect2(this.reportdroup, this.form1, 'dropBranch');
  
      initializeSelect2(this.vechile, this.form1, 'vehicalNumber');
  
  
        initializeSelect2(this.selectElem, this.form5, 'fromCity', (val) =>
          this.onFromcitySelect({ target: { value: val } })
        );
        initializeSelect2(this.selectElem2, this.form5, 'toCity', (val) =>
          this.onTocitySelect({ target: { value: val } })
        );
        initializeSelect2(this.pickupbranch, this.form5, 'pickUpBranch');
        initializeSelect2(this.droupbranch, this.form5, 'dropBranch');
  
  
  
  
        initializeSelect2(this.summaryfromcity, this.form6, 'fromCity', (val) =>
          this.onFromcitySelect({ target: { value: val } })
        );
        initializeSelect2(this.summarytocity, this.form6, 'toCity', (val) =>
          this.onTocitySelect({ target: { value: val } })
        );
        initializeSelect2(this.summarypickup, this.form6, 'pickUpBranch');
        initializeSelect2(this.summarydroup, this.form6, 'dropBranch');
  
        initializeSelect2(this.cancelfromcity, this.form7, 'fromCity');
        initializeSelect2(this.canceltocity, this.form7, 'toCity');
  
        initializeSelect2(
          this.allparecleserial,
          this.form2,
          'fromCity',
          (val) => {
            console.log('From City selected:', val);
            if (this.form2.value.fromCity && this.form2.value.toCity) {
              this.parcelbookingserieno();
            }
          }
        );
  
        initializeSelect2(this.allparcelcity, this.form2, 'toCity', (val) => {
          console.log('To City selected:', val);
          if (this.form.value.fromCity && this.form2.value.toCity) {
            this.parcelbookingserieno();
          }
        });
  
        initializeSelect2(this.parcelfromcity, this.form, 'fromCity', (val) => {
          console.log('From City selected:', val);
          if (this.form.value.fromCity && this.form.value.toCity) {
          }
        });
  
        initializeSelect2(this.allparceltocity, this.form, 'toCity', (val) => {
          console.log('To City selected:', val);
          if (this.form.value.fromCity && this.form.value.toCity) {
          }
        });
      }, 0);
    }
  
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
      console.log('parcelbooking:', payload);
  
      this.api.ParcelBookingReport(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel reports1:', response);
          const finalData = {
            ...response,
            fromDate: this.form.value.fromDate,
            toDate: this.form.value.toDate,
          };
  
          // Save data in localStorage with a unique key
          // const key = 'parcelReportData';
          // localStorage.setItem(key, JSON.stringify(finalData));
          // window.open(`/reports`, '_blank');
          localStorage.setItem('parcelReportData', JSON.stringify(finalData));
          const baseUrl = window.location.origin;
          const reportUrl = `${baseUrl}/cloud/reports`;
          window.open(reportUrl, '_blank');
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          this.toast.error('Parcel Loading Failed. Please try again.');
        },
      });
    }

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
    
          // Save data to localStorage
          // localStorage.setItem('allParcelBookingData', JSON.stringify(finalData1));
          //   window.open('/allpercelbooking', '_blank');

          
        localStorage.setItem('allparcelReportData', JSON.stringify(finalData1));
        const baseUrl = window.location.origin;
        const allpercelbookingUrl = `${baseUrl}/cloud/allpercelbooking`;
        window.open(allpercelbookingUrl, '_blank');
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          this.toast.error('Parcel Loading Failed. Please try again.');
        },
      });
    }
    
  
  
    // Parcel Booking Report With Serial No
    parcelbookingserieno(): void {
      if (this.form2.invalid) {
        this.form2.markAllAsTouched();
        this.toast.error('Please fill all required fields');
        return;
      }
  
      const payload2 = {
        fromDate: this.form2.value.fromDate,
        toDate: this.form2.value.toDate,
        fromCity: this.form2.value.fromCity,
        toCity: this.form2.value.toCity,
      };
  
      console.log('Serial No Report Payload:', payload2);
  
      this.api.ParcelReportSno(payload2).subscribe({
        next: (response: any) => {
          this.seriesdata = response;
          console.log('Parcel Booking Series Data:', this.seriesdata);
  
          const finalData11 = {
            ...response,
            fromDate: this.form2.value.fromDate,
            toDate: this.form2.value.toDate,
          };
  
          // Save data to localStorage
          // localStorage.setItem('bookingSerialData', JSON.stringify(finalData11));
          //   window.open('/bookingserial', '_blank');
            localStorage.setItem('serialData', JSON.stringify(finalData11));
            const baseUrl = window.location.origin;
            const bookingserialUrl = `${baseUrl}/cloud/bookingserial`;
            window.open(bookingserialUrl, '_blank');
        },
  
        error: (error: any) => {
          console.error('Parcel Serial No Report loading failed:', error);
          this.toast.error(
            'Parcel Serial No Report Loading Failed. Please try again.'
          );
        },
      });
    }
  
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
          // localStorage.setItem('bookingSummaryData', JSON.stringify(finalData9));
          // window.open('/bookingsummary', '_blank');
          localStorage.setItem('bookingSummaryData', JSON.stringify(finalData9));
          const baseUrl = window.location.origin;
          const bookingsummaryUrl = `${baseUrl}/cloud/bookingsummary`;
          window.open(bookingsummaryUrl, '_blank');
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
          const finalData7 = {
            ...response,
            fromDate: payload6.fromDate,
            toDate: payload6.toDate,
          };
  
          // Save data to localStorage
          // window.open('/cancel-report', '_blank');
          // localStorage.setItem('cancelReportData', JSON.stringify(finalData));
          this.toast.success('Cancel Report generated successfully!');

          localStorage.setItem('CancelData', JSON.stringify(finalData7));
          const baseUrl = window.location.origin;
          const cancelreportUrl = `${baseUrl}/cloud/cancelreport`;
          window.open(cancelreportUrl, '_blank');
          this.toast.success(response.message || 'Operation successful');
        },
        error: (error: any) => {
          console.error('Cancel Report Loading Failed:', error);
  
          // ❌ Show error toast
          this.toast.error('Cancel Report loading failed. Please try again.');
        },
      });
    }
    //  mobile report
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
  
          const successMessage =
            response?.message || 'Parcel Booking Report loaded successfully';
          this.toast.success(successMessage);
  
          const finalData5 = {
            ...response,
            fromDate: this.form4.value.fromDate,
            toDate: this.form4.value.toDate,
          };
  
          // ✅ Store the data temporarily in localStorage
          // localStorage.setItem('mobileBookingData', JSON.stringify(finalData5));
          // window.open('/bookingmobile', '_blank');
          localStorage.setItem('mobileBookingData', JSON.stringify(finalData5));
          const baseUrl = window.location.origin;
          const bookingmobileUrl = `${baseUrl}/cloud/bookingmobile`;
          window.open(bookingmobileUrl, '_blank');
        },
        error: (error: any) => {
          console.error('Parcel Mobile Report loading failed:', error);
          const errorMessage =
            error?.error?.message ||
            error?.message ||
            'Parcel Mobile Report loading failed. Please try again.';
          this.toast.error(errorMessage);
        },
      });
    }
    // regular customer
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
          console.log('regularDara:', this.customerdata);
          const successMessage =
            response.message || 'Customer report loaded successfully!';
          this.toast.success(successMessage);
          console.log('Form5 Values:', this.form5.value);
  
          const finalData2 = {
            ...response,
            fromDate: this.form5.value.fromDate,
            toDate: this.form5.value.toDate,
          };
  
          // localStorage.setItem('regularCustomerData', JSON.stringify(finalData2));
          // window.open('/regularcustmer', '_blank');
          localStorage.setItem('regularcustmerData', JSON.stringify(finalData2));
          const baseUrl = window.location.origin;
          const regularcustmerUrl = `${baseUrl}/cloud/regularcustmer`;
          window.open(regularcustmerUrl, '_blank');
        },
        error: (error: any) => {
          console.error('Customer Report loading failed:', error);
          const errorMessage =
            error.error?.message ||
            error.message ||
            'Customer Report Loading Failed. Please try again.';
          this.toast.error(errorMessage);
        },
      });
    }
  
    searchUser(): void {
      const searchTerm = this.form5.get('name')?.value?.trim();
    
      if (searchTerm && searchTerm.length >= 2) {
        this.api.searchUser(searchTerm).subscribe(
          (res: any) => {
            console.log("API Response:", res);
            this.searchResults = res.results || []; 
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
    hideDropdown(): void {
      setTimeout(() => {
        this.searchResults = [];
      }, 200); // Small delay to allow item click
    }
  }
  
