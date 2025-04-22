import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
  ) {
    this.form = this.fb.group({
      fromCity: ['', Validators.required],
      toCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
      dropBranch: ['', Validators.required],
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
      // Initialize Select2 for From City
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        console.log('Selected City:', selectedCity);
        this.form.patchValue({ fromCity: selectedCity });
        console.log('Updated form value:', this.form.value);
        this.onFromcitySelect({ target: { value: selectedCity } });
      });

      // Initialize Select2 for Pickup Branch
      $(this.pickupbranch.nativeElement).select2();
      $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        console.log('Selected Pickup Branch:', selectedBranch);
        this.form.patchValue({ pickUpBranch: selectedBranch });
        console.log('Updated form value:', this.form.value);
        this.onPickupBranchSelect({ target: { value: selectedBranch } });
      });

      // Initialize Select2 for To City
      $(this.selectElem2.nativeElement).select2();
      $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
        const selectedToCity = event.params.data.id;
        console.log('Selected To City:', selectedToCity);
        this.form.patchValue({ toCity: selectedToCity });
        console.log('Updated form value:', this.form.value);
        this.onTocitySelect({ target: { value: selectedToCity } });
      });

      // Initialize Select2 for Drop Branch
      $(this.droupbranch.nativeElement).select2();
      $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedDropBranch = event.params.data.id;
        console.log('Selected Drop Branch:', selectedDropBranch);
        this.form.patchValue({ dropBranch: selectedDropBranch });
        console.log('Updated form value:', this.form.value);
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
    if (this.form.valid) {
      const payload = this.form.value;
      console.log('payload:', payload);
      this.api.PendingDeliveryStockReport(payload).subscribe({
        next: (res) => {
          console.log('pending delivery:', res);
          this.gstdata = res;
          console.log('gstdata:', this.gstdata);
        },
        error: (err) => {
          console.error('Error fetching report:', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
