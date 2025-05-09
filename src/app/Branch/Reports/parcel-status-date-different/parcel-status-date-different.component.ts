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
    private router: Router
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
  

  StatusDate() {
    const payload = this.form.value;
    console.log('payload:', payload);
  
    this.api.ParcelStatusdateReport(payload).subscribe({
      next: (res) => {
        console.log('data:', res);
        this.gstdata = res;
  
        const finalData = {
          ...this.gstdata,
          fromDate: payload.startDate,
          toDate: payload.endDate
        };
  
        this.router.navigate(['/datereport'], { state:
           { data: finalData } });
      },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }
  
}  
