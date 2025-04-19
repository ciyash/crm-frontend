import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent {
  form: FormGroup;
  citydata: any;
  branchdata: any;
  constructor(private fb: FormBuilder, private api: BranchService) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: ['', Validators.required],
      fromCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
      bookedBy: ['', Validators.required],
    });
  }

  ngOnInit() {
    // const id = this.activate.snapshot.paramMap.get('id');
    this.api.GetCities().subscribe((res:any)=>{
      console.log('citys',res);
      this.citydata=res;
      console.log("citydata:",this.citydata);
      
    });
    //get branches
    this.api.GetBranch().subscribe((res:any)=>{
      console.log(res);
      this.branchdata=res;
      console.log("branchdata:",this.branchdata);
      
      
    });

  }
  getCollectionReport() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      pickUpBranch: this.form.value.pickUpBranch,
      bookedBy: this.form.value.bookedBy,
    };

    this.api.ParcelBranchWiseReport(payload).subscribe({
      next: (res) => {
        console.log('wise Report Data:', res);
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
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }

}
