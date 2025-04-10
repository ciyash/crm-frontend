import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-dispatched-report',
  templateUrl: './dispatched-report.component.html',
  styleUrls: ['./dispatched-report.component.scss']
})
export class DispatchedReportComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  data1: any;
    form: FormGroup;
    cities: any;
    bdata:any;
    constructor( private api: BranchService, private fb: FormBuilder ) {
      this.form = this.fb.group({
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        fromCity: ['', Validators.required],
        toCity: ['', Validators.required],
        fromBranch: ['', Validators.required],
      });
    }
  
    ngOnInit() {
      this.getCities();
      this.api.GetBranch().subscribe((res:any)=>{
        console.log('branchdata',res);
        this.bdata=res;
      })
    }

    getCities() {
      this.api.GetCities().subscribe({
        next: (response: any) => {
          this.cities = response;
        },
        error: (error: any) => {
          console.error('Error fetching cities:', error);
          alert('Failed to fetch cities data.');
        },
      });
    }

  ParcelLoad() {
    console.log("Before Load: Payload being sent", {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      fromBranch: this.form.value.fromBranch,
    });
  
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      fromBranch: this.form.value.fromBranch,
    };
  
    this.api.DispatchedReport(payload).subscribe({
      next: (response: any) => {
        console.log("After Load: Response received", response);
        this.data1=response;
  
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('No Parcel Loading. Please try again.');
        this.data1 = [];
      },
    });
  }

}
