import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-sub-collection',
  templateUrl: './sub-collection.component.html',
  styleUrls: ['./sub-collection.component.scss']
})
export class SubCollectionComponent implements OnInit, AfterViewInit {
    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('pickupbranch') pickupbranch!: ElementRef;
    form: FormGroup;
    citydata: any;
    branchdata: any;
    pfdata: any;
    collectiondata: any;  
    pdata: any;
    onPickupBranchSelect:any;
  fromCityValue: any;
  filteredCityList: any;
    constructor(private fb: FormBuilder, private api: BranchService, private router: Router,private toast:ToastrService) {
      this.form = this.fb.group({ 
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: [''],
        pickUpBranch: [''],
        bookedBy: [''],
        reportType: ['']
      });
      
    }
  
    ngOnInit() {
      this.api.GetCities().subscribe((res: any) => {
        this.citydata = res;
        this.getProfileData();
        console.log("citydata:", this.citydata);
      });
  
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
        console.log("branchdata:", this.branchdata);
        
      });
  
    }
    getTodayDateString(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    ngAfterViewInit(): void {
      setTimeout(() => {
        // From City
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
          const selectedCity = event.params.data.id;
          this.form.patchValue({ fromCity: selectedCity });
          this.onFromcitySelect({ target: { value: selectedCity } });
        });
    
        // Pickup Branch
        $(this.pickupbranch.nativeElement).select2();
        $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
          const selectedBranch = event.params.data.id;
          this.form.patchValue({ pickUpBranch: selectedBranch });
          this.onPickupBranchSelect({ target: { value: selectedBranch } });
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
  
    getCollectionReport() {
      const payload = this.form.value;
      console.log("Payload:", payload);
  
      this.api.ParcelBranchWiseReport(payload).subscribe({
        next: (res: any) => {
          const successMsg = res?.message || 'Report fetched successfully';
          this.toast.success(successMsg);
          const finalData = {
            ...res,
            fromDate: payload.fromDate,
            toDate: payload.toDate
          };
          const dataStr = encodeURIComponent(JSON.stringify(finalData));
                  const url = this.router.serializeUrl(
            this.router.createUrlTree(['/collectiondata'], {
              queryParams: { data: dataStr }
            })
          );
          window.open(url, '_blank');
          console.log("dataStr:",dataStr);
          
        },
  
        error: (err: any) => {
          console.error('Error fetching report:', err);
          const errorMsg = err?.error?.message || err?.message || 'Failed to fetch report';
          this.toast.error(errorMsg);
        }
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
  
  }
  
