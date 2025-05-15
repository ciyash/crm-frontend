import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  citydata: any;
  branchdata: any;
  pfdata: any;
  collectiondata: any;

  @ViewChild('BranchCity') BranchCity!: ElementRef;
  @ViewChild('BranchName') BranchName!: ElementRef;

  constructor(private fb: FormBuilder, private api: BranchService, private router: Router,private toast:ToastrService) {
    this.form = this.fb.group({ 
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      pickUpBranch: [''],
      bookedBy: [''],
      reportType: ['ALL']
    });
    
  }

  ngOnInit() {
    this.api.GetCities().subscribe((res: any) => {
      this.citydata = res;
      console.log("citydata:", this.citydata);
      setTimeout(() => $(this.BranchCity.nativeElement).select2(), 0);
    });

    this.api.GetBranch().subscribe((res: any) => {
      this.branchdata = res;
      console.log("branchdata:", this.branchdata);
      
      setTimeout(() => $(this.BranchName.nativeElement).select2(), 0);
    });

    this.getProfileData();
  }

  

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  

  ngAfterViewInit(): void {
    $(this.BranchCity.nativeElement).on('select2:select', (event: any) => {
      const selectedCity = event.params.data.id;
      console.log('Selected BranchCity:', selectedCity);
      this.form.patchValue({ fromCity: selectedCity });
      console.log('Updated form value:', this.form.value);
    });

    $(this.BranchName.nativeElement).on('select2:select', (event: any) => {
      const selectedBranch = event.params.data.id;
      console.log('Selected BranchName:', selectedBranch);
      this.form.patchValue({ pickUpBranch: selectedBranch });
      console.log('Updated form value:', this.form.value);
    });
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('profile', this.pfdata);
    });
  }

  getCollectionReport() {
    const payload = this.form.value;
    console.log("Payload:", payload);
  
    this.api.ParcelBranchWiseReport(payload).subscribe({
      next: (res: any) => {
        this.collectiondata = res;
  
        // ✅ Show success message from backend
        const successMsg = res?.message || 'Report fetched successfully';
        this.toast.success(successMsg);
  
        console.log('Report Data:', res);
        const finallData = {
          ...res,
          fromDate: this.form.value.fromDate,
          toDate: this.form.value.toDate
        };
  
        this.router.navigateByUrl('/collectiondata', { state: { data: finallData } });
      },
  
      error: (err: any) => {
        console.error('Error fetching report:', err);
  
        // ✅ Show error message from backend
        const errorMsg = err?.error?.message || err?.message || 'Failed to fetch report';
        this.toast.error(errorMsg);
      }
    });
  }
  
  
}
