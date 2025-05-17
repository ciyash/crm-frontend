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
  selector: 'app-pending-delivery-stock-report',
  templateUrl: './pending-delivery-stock-report.component.html',
  styleUrls: ['./pending-delivery-stock-report.component.scss'],
})
export class PendingDeliveryStockReportComponent
  implements OnInit, AfterViewInit
{
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
  constructor(
    private fb: FormBuilder,
    private api: BranchService,
    private router: Router,
    private toast :ToastrService
  ) {
    this.form = this.fb.group({
      fromCity: ['all', Validators.required],
      toCity: ['all', Validators.required],
      pickUpBranch: ['all', Validators.required],
      dropBranch: ['all', Validators.required],
    });
    
  }

  ngOnInit() {
    this.api.GetCities().subscribe((res: any) => {
      this.citydata = res;
      console.log('citydata:', this.citydata);
    });

    this.api.GetBranch().subscribe((res: any) => {
      this.branchdata = res;
      console.log('branchdata:', this.branchdata);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // From City
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).val('all').trigger('change'); // ✅ force default
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.patchValue({ fromCity: selectedCity });
        this.onFromcitySelect({ target: { value: selectedCity } });
      });
  
      // Pickup Branch
      $(this.pickupbranch.nativeElement).select2();
      $(this.pickupbranch.nativeElement).val('all').trigger('change'); // ✅
      $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form.patchValue({ pickUpBranch: selectedBranch });
        this.onPickupBranchSelect({ target: { value: selectedBranch } });
      });
  
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
        
        // Show success toast message from API response if available
        const message = res?.message || 'Report fetched successfully';
        this.toast.success(message);
  
        this.gstdata = res;
        console.log('gstdata:', this.gstdata);
  
        this.router.navigate(['/devliveryreport'], {
          state: { data: this.gstdata }
        });
      },
      error: (err: any) => {
        console.error('Error fetching report:', err);
  
        // Show error toast message from API response if available
        const errorMessage =
          err?.error?.message || err?.message || 'Failed to fetch report';
        this.toast.error(errorMessage);
      },
    });
  }
  
  
}
