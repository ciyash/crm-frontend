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
  selector: 'app-parcel-status-date-different',
  templateUrl: './parcel-status-date-different.component.html',
  styleUrls: ['./parcel-status-date-different.component.scss']
})
export class ParcelStatusDateDifferentComponent implements OnInit, AfterViewInit {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('selectElem2') selectElem2!: ElementRef;

  form: FormGroup;
  citydata: any;
  branchdata: any;
  data: any;
  gstdata: any;

  constructor(
    private fb: FormBuilder,
    private api: BranchService,
    private router: Router,
    private toast:ToastrService
  ) {
    this.form = this.fb.group({
      startDate: [this.getTodayDateString(), Validators.required],
      endDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      bookingStatus: ['all'],
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
  

  // StatusDate() {
  //   const payload = this.form.value;
  //   console.log('payload:', payload);
  
  //   this.api.ParcelStatusdateReport(payload).subscribe({
  //     next: (res: any) => {
  //       console.log('data:', res);
  //       // Show success message from backend, fallback to generic if not found
  //       const successMessage = res?.message || 'Report fetched successfully';
  //       this.toast.success(successMessage);
  
  //       this.gstdata = res;
  //       const finalData = {
  //         ...this.gstdata,
  //         fromDate: payload.startDate,
  //         toDate: payload.endDate
  //       };
  //       this.router.navigate(['/datereport'], { state: { data: finalData } });
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching report:', err);
  
  //       // Show error message from backend, fallback to generic if not found
  //       const errorMessage = err?.error?.message || 'Failed to fetch report';
  //       this.toast.error(errorMessage);
  //     }
  //   });
  // }
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
        // localStorage.setItem('dateReportData', JSON.stringify(finalData));
        // window.open('/datereport', '_blank');

        localStorage.setItem('dateReportData', JSON.stringify(finalData));
        const baseUrl = window.location.origin;
        const datereportUrl = `${baseUrl}/cloud/datereport`;
        window.open(datereportUrl, '_blank');

      },
      error: (err: any) => {
        console.error('Error fetching report:', err);
        const errorMessage = err?.error?.message || 'Failed to fetch report';
        this.toast.error(errorMessage);
      }
    });
  }
  
  

  
}  
