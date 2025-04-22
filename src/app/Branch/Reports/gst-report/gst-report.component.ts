import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;

@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss']
})
export class GstReportComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  citydata: any;
  branchdata: any;
  pfdata: any;
  gstdata: any;

  @ViewChild('BranchCity') BranchCity!: ElementRef;
  @ViewChild('BranchName') BranchName!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private api: BranchService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: ['', Validators.required],
      branchCity: [''],
      branchName: ['']
    });
  }

  ngOnInit() {
    this.api.GetCities().subscribe((res: any) => {
      this.citydata = res;
      setTimeout(() => $(this.BranchCity.nativeElement).select2(), 0);
    });

    this.api.GetBranch().subscribe((res: any) => {
      this.branchdata = res;
      setTimeout(() => $(this.BranchName.nativeElement).select2(), 0);
    });

    this.getProfileData();
  }

  ngAfterViewInit(): void {
    $(this.BranchCity.nativeElement).on('select2:select', (event: any) => {
      const selectedCity = event.params.data.id;
      this.form.patchValue({ branchCity: selectedCity });  // Corrected
    });

    $(this.BranchName.nativeElement).on('select2:select', (event: any) => {
      const selectedBranch = event.params.data.id;
      this.form.patchValue({ branchName: selectedBranch });  // Corrected
    });
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
    });
  }

  GstReport() {

    
    const payload = this.form.value;

    console.log("thispayload:", payload);
    this.api.SenderRecevierGstReport(payload).subscribe({
      next: (res) => {
        console.log('wise Report Data:', res);
        this.gstdata = res;
        console.log("gstdta:",this.gstdata);
        
        this.router.navigateByUrl('/gstdata', { state: { data: res } });
      },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
