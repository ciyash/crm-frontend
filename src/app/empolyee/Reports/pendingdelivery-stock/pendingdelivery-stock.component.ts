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
  selector: 'app-pendingdelivery-stock',
  templateUrl: './pendingdelivery-stock.component.html',
  styleUrls: ['./pendingdelivery-stock.component.scss']
})
export class PendingdeliveryStockComponent {


  

    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('pickupbranch') pickupbranch!: ElementRef;
    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
    form: FormGroup;
    citydata: any;
    branchdata: any;
    pfdata: any;
    gstdata: any;
    pdata: any;
    tbcdata: any;
    onPickupBranchSelect: any;
    onDropBranchSelect: any;
  ffdata: any;
  profileData: any;
    constructor(
      private fb: FormBuilder,
      private api: BranchService,
      private router: Router,
      private toast :ToastrService
    ) {
      this.form = this.fb.group({
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: ['all', Validators.required],
        toCity: ['all', Validators.required],
        pickUpBranch: ['all', Validators.required],
        dropBranch: ['all', Validators.required],
      });
  
    }
  
    ngOnInit() {
      this.getProfileData();
      this.api.GetCities().subscribe((res: any) => {
        this.citydata = res;
        console.log('citydata:', this.citydata);
      });
  
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
        console.log('branchdata:', this.branchdata);
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

    
        // Pickup Branch

    
        // To City
        $(this.selectElem2.nativeElement).select2();
        $(this.selectElem2.nativeElement).val('all').trigger('change'); // ✅
        $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
          const selectedToCity = event.params.data.id;
          this.form.patchValue({ toCity: selectedToCity });
          this.onTocitySelect({ target: { value: selectedToCity } });
        });
    
        // Drop Branch
        $(this.droupbranch.nativeElement).select2();
        $(this.droupbranch.nativeElement).val('all').trigger('change'); // ✅
        $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
          const selectedDropBranch = event.params.data.id;
          this.form.patchValue({ dropBranch: selectedDropBranch });
          this.onDropBranchSelect({ target: { value: selectedDropBranch } });
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
  
  
    
    DeliveryStockReport() {
      const payload = this.form.value;
      console.log('payload:', payload);
      this.api.PendingDeliveryStockReport(payload).subscribe({
        next: (res: any) => {
          console.log('pending delivery:', res);
          
          const message = res?.message || 'Report fetched successfully';
          this.toast.success(message);
    
          this.gstdata = res;
          console.log('gstdata:', this.gstdata);
          // localStorage.setItem('gstData', JSON.stringify(this.gstdata));
          //   window.open('/devliveryreport', '_blank');
      
  
            const finalData = {
              ...this.gstdata,
              fromDate: payload.startDate,
              toDate: payload.endDate,
              fromCity:payload.fromCity,
              toCity:payload.toCity,
              pickUpBranch:payload.pickUpBranch,
              dropBranch:payload.dropBranch,
            };
            localStorage.setItem('pendingData', JSON.stringify(finalData));
            const baseUrl = window.location.origin;
            const devliveryreportUrl = `${baseUrl}/cloud/devliveryreport`;
            window.open(devliveryreportUrl, '_blank');
        },
        error: (err: any) => {
          console.error('Error fetching report:', err);
          const errorMessage = err?.error?.message || err?.message || 'Failed to fetch report';
          this.toast.error(errorMessage);
        },
      });
    }
    
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
          });
    }
  }
  
