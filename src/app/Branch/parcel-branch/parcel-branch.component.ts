import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcel-branch',
  templateUrl: './parcel-branch.component.html',
  styleUrls: ['./parcel-branch.component.scss']
})
export class ParcelBranchComponent implements OnInit {
  citydata: any = []; // Ensure it's initialized to prevent undefined errors
  form: FormGroup;
  vdata:any;
  data:any;
  form1:FormGroup;
  LoadSuccess: boolean = false;
  allSelected: boolean = false;
  constructor(private api: BranchService, private fb: FormBuilder, private router:Router) {
    this.form = this.fb.group({
      fromBookingDate: ['', Validators.required],
      toBookingDate: ['', Validators.required],
      fromBranch: ['', Validators.required]
    });

    this.form1 = this.fb.group({
      loadingType: ['branchLoad'],
      lrNumber: this.fb.array([], Validators.required),
      grnNo: this.fb.array([], Validators.required),
      fromBookingDate: ['', Validators.required],
      toBookingDate: ['', Validators.required],
      fromBranch: [''],
      toBranch: ['', Validators.required],
      vehicalNumber: ['', Validators.required],
      remarks: ['', Validators.required],
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
    this.api.VehicleData().subscribe((res:any)=>{
        console.log('vdata',res);
        this.vdata=res;
    })
  }

  loaddata(){
      const payload = {
        fromBookingDate: this.form.value.fromBookingDate,
        toBookingDate: this.form.value.toBookingDate,
        fromBranch: this.form.value.fromBranch,
      };
      console.log('Final Payload:', payload);
      this.api.postBranchLoading(payload).subscribe({
        next: (response: any) => {
          console.log('loaded successfully:', response);
          alert('Parcel Loaded Successfully!');
          this.data=response;
          this.LoadSuccess = true;
        // ✅ Assign loaded data to form1 fields
        if (this.data.length > 0) {
          this.form1.patchValue({
            fromBranch: this.form.value.fromBranch,
            fromBookingDate: this.form.value.fromBookingDate,
            toBookingDate: this.form.value.toBookingDate,
            fromCity: this.form.value.fromCity,
            loadingDate: '', // You can keep it empty for user input
            vehicalNumber: '',
            driverName: '',
            driverNo: '',
          });
  
          // ✅ Set `toCity`, `grnNo`, and `lrNumber` as FormArray
          this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
          this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
        }
        },
        error: (error: any) => {
          console.error('loading failed:', error);
          alert('NO Parcel Loading . Please try again.');
        },
      });
    
  }

   setFormArray(controlName: string, values: any[]) {
      const formArray = this.form1.get(controlName) as FormArray;
      formArray.clear(); // ✅ Clear previous values
    
      values.forEach(value => {
        formArray.push(this.fb.control(value));
      });
    }

    onGrnNoChange(event: any, grnNo: string) {
      const formArray = this.form1.get('grnNo') as FormArray;
    
      if (event.target.checked) {
        // Add if not already selected
        if (!formArray.value.includes(grnNo)) {
          formArray.push(this.fb.control(grnNo));
        }
      } else {
        // Remove if unchecked
        const index = formArray.value.indexOf(grnNo);
        if (index > -1) {
          formArray.removeAt(index);
        }
      }
    
      // ✅ Update "Select All" status based on selected values
      this.allSelected = this.data.length === formArray.value.length;
      console.log('Selected GRN Numbers:', formArray.value);
    }
    
    // ✅ Handle "Select All" checkbox
    onSelectAllChange(event: any) {
      const formArray = this.form1.get('grnNo') as FormArray;
    
      if (event.target.checked) {
        // ✅ Select all if checked
        this.data.forEach((row:any) => {
          if (!formArray.value.includes(row.grnNo)) {
            formArray.push(this.fb.control(row.grnNo));
          }
        });
      } else {
        // ✅ Deselect all if unchecked
        formArray.clear();
      }
    
      // ✅ Update "Select All" status
      this.allSelected = event.target.checked;
      console.log('All GRN Numbers Selected:', formArray.value);
    }

    ParcelLoad() {
      const payload = {
        fromBranch: this.form1.value.fromBranch,
        toBranch: this.form1.value.toBranch,
        vehicalNumber: this.form1.value.vehicalNumber,
        loadingType: this.form1.value.loadingType,
        remarks: this.form1.value.remarks,
        fromBookingDate: this.form1.value.fromBookingDate,
        toBookingDate: this.form1.value.toBookingDate,
        grnNo: this.form1.value.grnNo,
        lrNumber: this.form1.value.lrNumber,
      };
    
      console.log('Final Payload:', payload);
      
      this.api.BranchtoBranchLoad(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          // alert('Parcel Loaded Successfully!');
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/parcel-branch']);
            });
          }, 1000);
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          alert('Parcel Loading Failed. Please try again.');
        },
      });
    }


}
