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
  constructor(private fb: FormBuilder, private api: BranchService) {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
      bookedBy: ['', Validators.required],
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
}
