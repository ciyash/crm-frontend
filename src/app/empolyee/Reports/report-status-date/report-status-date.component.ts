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
  selector: 'app-report-status-date',
  templateUrl: './report-status-date.component.html',
  styleUrls: ['./report-status-date.component.scss']
})
export class ReportStatusDateComponent {
    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('selectElem2') selectElem2!: ElementRef;
  
    form: FormGroup;
    citydata: any;
    branchdata: any;
    data: any;
    gstdata: any;
  ffdata: any;
  pfdata: any;
  profileData: any;
  
    constructor(
      private fb: FormBuilder,
      private api: BranchService,
      private router: Router,
      private toast:ToastrService
    ) {
      this.form = this.fb.group({
        // startDate: ['', Validators.required],
        // endDate: ['', Validators.required],
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
        console.log('citydata:', this.citydata);
      });
  
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
        console.log('branchdata:', this.branchdata);
      });
    }
  
    ngAfterViewInit(): void {
      setTimeout(() => {
  
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
  
