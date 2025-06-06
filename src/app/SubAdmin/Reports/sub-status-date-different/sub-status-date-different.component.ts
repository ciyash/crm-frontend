import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';

declare var $: any;
@Component({
  selector: 'app-sub-status-date-different',
  templateUrl: './sub-status-date-different.component.html',
  styleUrls: ['./sub-status-date-different.component.scss']
})
export class SubStatusDateDifferentComponent implements OnInit, AfterViewInit  {
    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('selectElem2') selectElem2!: ElementRef;
  
    form: FormGroup;
    citydata: any;
    branchdata: any;
    data: any;
    gstdata: any;
  fromCityValue: any;
  filteredCityList: any;
  pdata: any;
  
    constructor(
      private fb: FormBuilder,
      private api: BranchService,
      private router: Router,
      private toast:ToastrService
    ) {
      this.form = this.fb.group({
        startDate: [this.getTodayDateString(), Validators.required],
        endDate: [this.getTodayDateString(), Validators.required],
        fromCity: ['', Validators.required],
        toCity: ['', Validators.required],
        bookingStatus: ['', Validators.required],
      });
    }
  
    ngOnInit() {
      this.getProfileData();
      this.api.GetCities().subscribe((res: any) => {
        this.citydata = res;
        this.getProfileData();

        console.log('citydata:', this.citydata);
      });
  
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
        console.log('branchdata:', this.branchdata);
      });
    }
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.fromCityValue = res.branchId.city;
        // Filter city list and set values to forms
        this.filteredCityList = this.citydata.filter(
          (city: { cityName: any }) => city.cityName === this.fromCityValue
        );
    
        this.form.patchValue({ fromCity: this.fromCityValue });
  
        // Trigger form change logic if needed
        this.onFromcitySelect({ target: { value: this.fromCityValue } });
          setTimeout(() => {
          // Update first select2
          $(this.selectElem.nativeElement).select2();
          $(this.selectElem.nativeElement).val(this.fromCityValue).trigger('change');
          $(this.selectElem.nativeElement).prop('disabled', true).trigger('change.select2')
        }, 0);
      });
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
  
    ngAfterViewInit(): void {
      setTimeout(() => {
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
          const selectedCity = event.params.data.id;
          this.form.patchValue({ fromCity: selectedCity });
        });
  
        $(this.selectElem2.nativeElement).select2();
        $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
          const selectedToCity = event.params.data.id;
          this.form.patchValue({ toCity: selectedToCity });
        });
      }, 0);
    }
  
    getTodayDateString(): string {
      const today = new Date();
      const day = ('0' + today.getDate()).slice(-2);
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const year = today.getFullYear();
      return `${year}-${month}-${day}`; // ✔ HTML date input format
    }
    
  
   
    StatusDate() {
      const payload = this.form.value;
      console.log('payload:', payload);
    
      this.api.ParcelStatusdateReport(payload).subscribe({
        next: (res: any) => {
          console.log('data:', res);
    
          const successMessage = res?.message || 'Report fetched successfully';
          this.toast.success(successMessage);
    
          this.gstdata = res;
    
          const finalData = {
            ...this.gstdata,
            fromDate: payload.startDate,
            toDate: payload.endDate
          };
    
          // Store data in localStorage or sessionStorage
          localStorage.setItem('dateReportData', JSON.stringify(finalData));
    
          // Open new tab to the target route
          window.open('/datereport', '_blank');
        },
        error: (err: any) => {
          console.error('Error fetching report:', err);
          const errorMessage = err?.error?.message || 'Failed to fetch report';
          this.toast.error(errorMessage);
        }
      });
    }
    
    
  
    
  }  
  
