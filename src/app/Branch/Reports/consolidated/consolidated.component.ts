import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;

@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss']
})
export class ConsolidatedComponent {
  form: FormGroup;
  citydata: any;
  branchdata: any;
  pfdata: any;
  Cdata: any;
  bdata:any;
  @ViewChild('BranchCity') BranchCity!: ElementRef;
  @ViewChild('BranchName') BranchName!: ElementRef;
  constructor(private fb: FormBuilder, private api: BranchService) {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      pickUpBranch: [''],
      bookedBy: [''],
      displayBookingDetails: [false],
      branchSummary: [false],
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
  getProfileData(){
    this.api.GetProfileData().subscribe((res:any)=>{
      console.log('profile',res);
      this.pfdata=res;
      console.log(this.pfdata,"branchid")
    });
  }
  getCollectionReport() {
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      pickUpBranch: this.form.value.pickUpBranch,
      bookedBy: this.form.value.bookedBy,
    };
    console.log("payload:",payload);
    this.bdata=payload
    
    

    this.api.ConsolidatedReport(payload).subscribe({
      next: (res) => {
        console.log('ConsolidatedReport:', res);
        this.Cdata=res
            },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }
  today = new Date();

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${day}-${month}-${year}`; 
  }

  get showFilter(): boolean {
    return this.form.get('displayBookingDetails')?.value || this.form.get('branchSummary')?.value;
  }
}
