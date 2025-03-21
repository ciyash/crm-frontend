import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parcel-branch',
  templateUrl: './parcel-branch.component.html',
  styleUrls: ['./parcel-branch.component.scss']
})
export class ParcelBranchComponent implements OnInit {
  citydata: any = []; 
  branchForm: FormGroup;
  vehicle: any;
  pickBranch: any;
  branchdata: any;

  constructor(private api: BranchService, private fb: FormBuilder,) {

    this.branchForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      pickUpBranch: ['', Validators.required]
    });

  }

  ngOnInit() {
    this.api.GetBranch().subscribe({
      next: (res: any) => {
        this.branchdata = res;
        console.log('Branch data fetched successfully:', res);
      },
      error: (err) => console.error('Error fetching branch data:', err)
    });
    this.getvehicleData()
  }

  submitBranchLoading() {
      this.api.postBranchLoading(this.branchForm.value).subscribe({
        next: (response) => {
          console.log('Branch loading data submitted successfully:', response);
          this.pickBranch=response
          alert('Branch Loading Data Submitted Successfully');
          console.log('Form Data:', this.branchForm.value);
        },
        error: (error) => {
          alert('Error in submitting branch loading data');
        }
      });
    }



    getvehicleData() {
      this.api.VehicleData().subscribe({
        next: (response: any) => {
          console.log('Vehicle:', response);
          this.vehicle = response; 
        },
        error: (error: any) => {
          console.error('Error fetching vehicle data:', error);
        }
      });
    }

    // posting the branchdata
    // postBranch(){
    //   this.api.postBranchData(this.branchForm.value).subscribe({
    //     next: (response) => {
    //       console.log('Branch data submitted successfully:', response);
    //       this.pickBranch=response
    //       alert('Branch Loading Data Submitted Successfully');
    //       console.log('Form Data:', this.branchForm.value);
    //     },
    //     error: (error) => {
    //       alert('Error in submitting branch loading data');
    //     }
    //   });

    // }
   
  }

