import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, NgZone } from '@angular/core';
@Component({
  selector: 'app-dashboard-report',
  templateUrl: './dashboard-report.component.html',
  styleUrls: ['./dashboard-report.component.scss']
})
export class DashboardReportComponent {     
   //  regular cuscomer
      @ViewChild('selectElem2') selectElem2!: ElementRef;
      @ViewChild('droupbranch') droupbranch!: ElementRef;
      // summary
      @ViewChild('summarytocity') summarytocity!: ElementRef;
      @ViewChild('summarydroup') summarydroup!: ElementRef;
      // cancelreport
      @ViewChild('canceltocity') canceltocity!: ElementRef;
      //  serial no
      @ViewChild('allparcelcity') allparcelcity!: ElementRef;
    
      // parcel Report
      @ViewChild('allparceltocity') allparceltocity!: ElementRef;
      // All parcel Report
      @ViewChild('reportcity') reportcity!: ElementRef;
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
  ffdata: any;
  pfdata: any;
  profileData: any;
    
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
    
          // Parcel Cancel Report
          this.form7 = this.fb.group({
            fromDate: [this.getTodayDateString(), Validators.required],
            toDate: [this.getTodayDateString(), Validators.required],
            fromCity: [''],
            toCity: [''],
            bookingType: [''],
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
    
 
        // mobile
        this.form4 = this.fb.group({
          fromDate: [this.getTodayDateString(), Validators.required],
          toDate: [this.getTodayDateString(), Validators.required],
          mobile: ['', Validators.required],
          reportType: ['ALL', Validators.required],
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
      }
    
      ngOnInit() {
        this.getProfileData();
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
          initializeSelect2(this.allparceltocity, this.form, 'toCity', (val) => {
            console.log('To City selected:', val);
            if (this.form.value.fromCity && this.form.value.toCity) {
            }
          });
        initializeSelect2(this.reportcity, this.form1, 'toCity', (val) =>
          this.onTocitySelect({ target: { value: val } })
        );

        initializeSelect2(this.reportdroup, this.form1, 'dropBranch');
        initializeSelect2(this.vechile, this.form1, 'vehicalNumber');

        initializeSelect2(this.allparcelcity, this.form2, 'toCity', (val) => {
          console.log('To City selected:', val);
          if (this.form.value.fromCity && this.form2.value.toCity) {
            this.parcelbookingserieno();
          }
        });
        initializeSelect2(this.canceltocity, this.form7, 'toCity');

          initializeSelect2(this.summarytocity, this.form6, 'toCity', (val) =>
            this.onTocitySelect({ target: { value: val } })
          );
          initializeSelect2(this.summarydroup, this.form6, 'dropBranch');
          
          initializeSelect2(this.selectElem2, this.form5, 'toCity', (val) =>
          this.onTocitySelect({ target: { value: val } })
        );
        initializeSelect2(this.droupbranch, this.form5, 'dropBranch');
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
            const key = 'parcelReportData';
            localStorage.setItem(key, JSON.stringify(finalData));
    
            // Open the reports route in a new tab
            window.open(`/reports`, '_blank');
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
            localStorage.setItem('allParcelBookingData', JSON.stringify(finalData1));
      
            // Open new tab and load the route
            window.open('/allpercelbooking', '_blank');
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
            localStorage.setItem('bookingSerialData', JSON.stringify(finalData11));
    
            // Open /bookingserial in a new tab
            window.open('/bookingserial', '_blank');
          },
    
          error: (error: any) => {
            console.error('Parcel Serial No Report loading failed:', error);
            this.toast.error(
              'Parcel Serial No Report Loading Failed. Please try again.'
            );
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
            localStorage.setItem('mobileBookingData', JSON.stringify(finalData5));
    
            // ✅ Open new tab with route
            window.open('/bookingmobile', '_blank');
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
    
            localStorage.setItem('regularCustomerData', JSON.stringify(finalData2));
    
            window.open('/regularcustmer', '_blank');
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


      // getProfileData() {
      //   this.api.GetProfileData().subscribe((res: any) => {
      //     console.log('profile', res);
      //     this.ffdata = res.branchId;
      //     this.citydata = res;
      //     this.pfdata = res.branchId.city;
      //     this.profileData = res;
      //     console.log("profileData:", this.profileData);
      //     // parcelnbooking
      //       this.form.patchValue({
      //       fromCity: this.pfdata || '',
      //     });
      //     // all parcel boking
      //     this.form1.patchValue({
      //       fromCity: this.pfdata || '', 
      //       pickUpBranch: this.ffdata?.branchUniqueId || '' 
      //     });
      //     // serial no
      //     this.form2.patchValue({
      //       fromCity: this.pfdata || '', 
      //     });
      //     this.form7.patchValue({
      //       fromCity: this.pfdata || '', 
      //     });
      //     this.form6.patchValue({
      //       fromCity: this.pfdata || '', 
      //       pickUpBranch: this.ffdata?.branchUniqueId || '' 

      //     });
      //     this.form5.patchValue({
      //       fromCity: this.pfdata || '', 
      //       pickUpBranch: this.ffdata?.branchUniqueId || '' 

      //     });

      //   });
      // }
      getProfileData() {
        this.api.GetProfileData().subscribe((res: any) => {
          console.log('profile', res);
          this.ffdata = res.branchId;
          this.pfdata = res.branchId.city;
          this.profileData = res;
          console.log("profileData:", this.profileData);
      
          // Update form controls with profile data
          this.form.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
            pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
          });
          this.form1.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
            pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
          });
          this.form2.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
          });
          this.form7.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
          });
          this.form6.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
            pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId

          });
          this.form5.patchValue({
            fromCity: this.pfdata || '',
            pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId

          });
      
          // Fetch service charges after setting fromCity
        });
      }
    }
    
  
