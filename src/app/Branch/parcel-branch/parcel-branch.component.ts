import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parcel-branch',
  templateUrl: './parcel-branch.component.html',
  styleUrls: ['./parcel-branch.component.scss']
})
export class ParcelBranchComponent implements OnInit {
  citydata: any = []; // Ensure it's initialized to prevent undefined errors
  branchForm: FormGroup;

  constructor(private api: BranchService, private fb: FormBuilder) {
    this.branchForm = this.fb.group({
      fromBookingDate: ['', Validators.required],
      toBookingDate: ['', Validators.required],
      fromBranch: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Fetch branch data and assign it properly
    this.api.GetBranch().subscribe({
      next: (res: any) => {
        this.citydata = res;
        console.log('Branch data fetched successfully:', this.citydata);
      },
      error: (err) => console.error('Error fetching branch data:', err)
    });
  }

  submitBranchLoading() {
    if (this.branchForm.valid) {
      this.api.postBranchLoading(this.branchForm.value).subscribe({
        next: (response) => {
          console.log('Branch loading data submitted successfully:', response);
          alert('Branch Loading Data Submitted Successfully');
          console.log('Form Data:', this.branchForm.value);

        },
        error: (error) => {
          console.error('Error submitting branch loading data:', error);
          alert('Error in submitting branch loading data');
        }
      });
    }
  }
}
