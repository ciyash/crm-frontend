import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;
declare const SlimSelect: any;
@Component({
  selector: 'app-sub-loadingreport',
  templateUrl: './sub-loadingreport.component.html',
  styleUrls: ['./sub-loadingreport.component.scss']
})
export class SubLoadingreportComponent {
    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('demoSelect') demoSelect!: ElementRef;
    @ViewChild('pickupbranch') pickupbranch!: ElementRef;
  
    branchdata: any;
    pdata: any[] = [];
    data1: any[] = [];
    form1: FormGroup;
    cities: any;
  fromCityValue: any;
  filteredCityList: any;
  
    constructor(
      private api: BranchService,
      private fb: FormBuilder,
      private cd: ChangeDetectorRef,
      private toast: ToastrService,
      private router:Router
    ) {
      this.form1 = this.fb.group({
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: [''],
        toCity: this.fb.array([]),
        fromBranch: [''],
        dropBranch: ['']
      });
    }
  
    ngOnInit() {
      this.getCities();
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
        console.log('branchdata:', this.branchdata);
      });
    }
    getTodayDateString(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const day = ('0' + today.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
  
    ngAfterViewInit(): void {
      new SlimSelect({
        select: this.demoSelect.nativeElement
      });
  
      setTimeout(() => {
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
          const selectedCity = event.params.data.id;
          console.log('Selected City:', selectedCity);
          this.form1.patchValue({ fromCity: selectedCity });
          console.log('Updated form value:', this.form1.value);
          this.onFromcitySelect({ target: { value: selectedCity } });
        });
        $(this.pickupbranch.nativeElement).select2();
        $(this.pickupbranch.nativeElement).val('all').trigger('change');
        $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
          const selectedBranch = event.params.data.id;
          this.form1.patchValue({ fromBranch: selectedBranch });
        });
      }, 0);
    }
  
    getCities() {
      this.api.GetCities().subscribe({
        next: (response: any) => {
          this.cities = response;
          this.getProfileData();
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
  
    onFromcitySelect(event: any) {
      const cityName = event.target.value;
      if (cityName) {
        this.api.GetBranchbyCity(cityName).subscribe(
          (res: any) => {
            // Ensure pdata is always an array
            if (Array.isArray(res)) {
              this.pdata = res;
            } else if (res && Array.isArray(res.data)) {
              this.pdata = res.data;
            } else if (res && typeof res === 'object') {
              this.pdata = Object.values(res);
            } else {
              this.pdata = [];
              console.error('Unexpected branch data format', res);
            }
          },
          (error: any) => {
            console.error('Error fetching branches:', error);
            this.pdata = [];
          }
        );
      } else {
        this.pdata = [];
      }
    }
  
    onToCityChange(event: any) {
      const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
      const toCityArray = this.form1.get('toCity') as FormArray;
      toCityArray.clear();
      selectedOptions.forEach(city => toCityArray.push(new FormControl(city)));
      console.log('Selected To Cities:', toCityArray.value);
    }
  
    // ParcelLoad() {
    //   console.log('ParcelLoad() triggered');
    //   console.log('form1 value:', this.form1.value);
    
    //   const payload = {
    //     fromDate: this.form1.value.fromDate,
    //     toDate: this.form1.value.toDate,
    //     fromCity: this.form1.value.fromCity,
    //     toCity: this.form1.value.toCity,
    //     fromBranch: this.form1.value.fromBranch,
    //     dropBranch: this.form1.value.dropBranch,
    //   };
    
    //   console.log("payload:", payload);
    
    //   this.api.ParcelOfflineReport(payload).subscribe({
    //     next: (response: any) => {
    //       console.log("After Load: Response received", response);
    //       const finalData8 = {
    //         ...response,
    //         fromDate: this.form1.value.fromDate,
    //         toDate: this.form1.value.toDate
    //       };
    //       // Save to localStorage
    //       localStorage.setItem('parcelReportData', JSON.stringify(finalData8));
    //       window.open('/parcelloadingofflinereport', '_blank');

    //       // localStorage.setItem('parcelReportData', JSON.stringify(finalData8));
    //       // const baseUrl = window.location.origin;
    //       // const parcelloadingofflinereportUrl = `${baseUrl}/cloud/parcelloadingofflinereport`;
    //       // window.open(parcelloadingofflinereportUrl, '_blank');
    //     },
    //     error: (error: any) => {
    //       console.error('Parcel loading failed:', error);
    //       this.data1 = [];
    //     },
    //   });
    // }
    
    ParcelLoad() {
      const payload = {
        fromDate: this.form1.value.fromDate,
        toDate: this.form1.value.toDate,
        fromCity: this.form1.value.fromCity,
        toCity: this.form1.value.toCity,
        fromBranch: this.form1.value.fromBranch,
        dropBranch: this.form1.value.dropBranch,
      };
    
      this.api.ParcelOfflineReport(payload).subscribe({
        next: (response: any) => {
          console.log("response:",response);
          
          const finalData = {
            ...response,
            fromDate: this.form1.value.fromDate,
            toDate: this.form1.value.toDate
          };
    
          // ✅ Store in localStorage
          localStorage.setItem('parcelReportData', JSON.stringify(finalData));
    
          // ✅ Open new tab with route
          const baseUrl = window.location.origin;
          const parcelloadingofflinereportUrl = `${baseUrl}/cloud/parcelloadingofflinereport`;
          window.open(parcelloadingofflinereportUrl, '_blank');
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          this.data1 = [];
        },
      });
    }
    

    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.fromCityValue = res.branchId.city; // Example: Hyderabad
    
        // Filter only one matching city
        this.filteredCityList = this.cities.filter(
          (city: { cityName: string }) =>
            city.cityName?.trim().toLowerCase() === this.fromCityValue?.trim().toLowerCase()
        );
    
        // Patch form
        this.form1.patchValue({ fromCity: this.fromCityValue });
    
        // Call FromCity logic
        this.onFromcitySelect({ target: { value: this.fromCityValue } });
    
        // Re-initialize Select2 and disable
        setTimeout(() => {
          const select2Ref = $(this.selectElem.nativeElement);
          select2Ref.select2('destroy');
          select2Ref.select2();
          select2Ref.val(this.fromCityValue).trigger('change.select2');
          select2Ref.prop('disabled', true); // Disable select
        }, 0);
      });
    }
  
  }
