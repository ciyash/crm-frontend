import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;

@Component({
  selector: 'app-dispatched-memo-report',
  templateUrl: './dispatched-memo-report.component.html',
  styleUrls: ['./dispatched-memo-report.component.scss']
})
export class DispatchedMemoReportComponent implements AfterViewInit {

  @ViewChild('allParcelfromcity') allParcelfromcity!: ElementRef;
  @ViewChild('allParceltocity') allParceltocity!: ElementRef;
  @ViewChild('allParcelPickupbranch') allParcelPickupbranch!: ElementRef;
  @ViewChild('allParcelDroupBranch') allParcelDroupBranch!: ElementRef;
  @ViewChild('vechicle') vechicle!: ElementRef;
  @ViewChild('allparecleserial') allparecleserial!: ElementRef;
  @ViewChild('allparcelcity') allparcelcity!: ElementRef;

  form!: FormGroup;

  citydata: any;
  branchdata: any;
  allgetvechicle: any;
  pfdata: any;
  DispatchedData: any;

  totalQty = 0;
  totalFreight = 0;
  totalHamali = 0;
  totalNetAmount = 0;

  constructor(
    private api: BranchService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
      vehicalNumber: [''],
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
      initializeSelect2(this.allParcelfromcity, this.form, 'fromCity');
      initializeSelect2(this.allParceltocity, this.form, 'toCity');
      initializeSelect2(this.allParcelPickupbranch, this.form, 'pickUpBranch');
      initializeSelect2(this.allParcelDroupBranch, this.form, 'dropBranch');
      initializeSelect2(this.vechicle, this.form, 'vehicalNumber');
    });
  }

  memoReport() {
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      pickUpBranch: this.form.value.pickUpBranch,
      dropBranch: this.form.value.dropBranch,
      vehicalNumber: this.form.value.vehicalNumber,
    };
    console.log('All Parcel Booking Payload:', payload);
    this.api.DispatchedMemoReport(payload).subscribe({
      next: (response: any) => {
        console.log('All Parcel loaded successfully:', response);
        this.DispatchedData = response;
        console.log('report:', this.DispatchedData);

        // Reset totals
        this.calculateTotals();
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again.');
      },
    });
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('profiledata:', this.pfdata);
    });
  }

  // Method to calculate totals
  calculateTotals() {
    this.totalQty = 0;
    this.totalFreight = 0;
    this.totalHamali = 0;
    this.totalNetAmount = 0;

    if (this.DispatchedData?.data?.toPay?.length) {
      this.DispatchedData.data.toPay.forEach((item: any) => {
        const qty = item.packages?.[0]?.quantity || 0;
        const freight = item.serviceCharge || 0;
        const hamali = item.hamaliCharge || 0;
        const net = item.grandTotal || 0; // Use grandTotal as the net amount

        this.totalQty += qty;
        this.totalFreight += freight;
        this.totalHamali += hamali;
        this.totalNetAmount += net;
      });
    }
  }
}
