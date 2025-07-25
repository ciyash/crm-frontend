import { ChangeDetectorRef, Component, OnInit,ElementRef, ViewChild  } from '@angular/core';

import { BranchService } from 'src/app/service/branch.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 

@Component({
  selector: 'app-parcel-branch',
  templateUrl: './parcel-branch.component.html',
  styleUrls: ['./parcel-branch.component.scss']
})
export class ParcelBranchComponent implements OnInit {
  citydata: any = []; // Ensure it's initialized to prevent undefined 
  form: FormGroup;
  vdata:any;
  data:any;
  form1:FormGroup;
  LoadSuccess: boolean = false;
  allSelected: boolean = false;
  pdata:any;
  @ViewChild('toBranch') toBranch!: ElementRef;
  @ViewChild('vehicle') vehicle!: ElementRef;
  @ViewChild('frombranch') frombranch!: ElementRef;
  constructor(private api: BranchService, private fb: FormBuilder, private router:Router,private toast:ToastrService) {
    this.form = this.fb.group({
      fromBookingDate: [this.getTodayDateString(), Validators.required],
      toBookingDate: [this.getTodayDateString(), Validators.required],
      fromBranch: ['', Validators.required]
    });

    this.form1 = this.fb.group({
      fromBranch: ['', Validators.required],
      toBranch: ['', Validators.required],
      vehicalNumber: ['', Validators.required],
      remarks: [''],
      fromCity: ['', Validators.required],
      toCity: this.fb.array([],),
      grnNo: this.fb.array([], ),
      lrNumber: this.fb.array([], ),
    });
    
  }
  ngOnInit() {
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
    });
    this.api.GetProfileData().subscribe((res:any)=>{
      console.log('profile',res);
      this.pdata=res.branchId;
      console.log("branchDETAILS",this.pdata);
      
    })
  }
  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }
  
  ngAfterViewInit(): void {
    this.initSelect2();
  }
  
  initSelect2() {
    setTimeout(() => {
      if (this.toBranch?.nativeElement && this.vehicle?.nativeElement) {

        $(this.toBranch.nativeElement).select2();
        $(this.toBranch.nativeElement).on('select2:select', (event: any) => {
          const selectedBranch = event.params.data.id;
          this.form1.get('toBranch')?.setValue(selectedBranch);
        });


          $(this.frombranch.nativeElement).select2();
          $(this.frombranch.nativeElement).on('select2:select', (event: any) => {
            const selectedBranch = event.params.data.id;
            this.form.get('fromBranch')?.setValue(selectedBranch);
          });
  
        $(this.vehicle.nativeElement).select2();
        $(this.vehicle.nativeElement).on('select2:select', (event: any) => {
          const selectedVehicle = event.params.data.id;
          this.form1.get('vehicalNumber')?.setValue(selectedVehicle);
        });
      }
    }, 100);
  }

  loaddata() {
    const payload = {
      fromBookingDate: this.form.value.fromBookingDate,
      toBookingDate: this.form.value.toBookingDate,
      fromBranch: this.form.value.fromBranch,
    };
    console.log('Final Payload:', payload);
    this.data = [];
    this.LoadSuccess = false;
    this.form1.reset();
    this.api.postBranchLoading(payload).subscribe({
      next: (response: any) => {
        this.data = response;
        this.LoadSuccess = true;
        console.log('loaded successfully:', response);
        const successMessage = response?.message || 'Parcel Branch loading successfully';
        this.toast.success(successMessage, 'Success');
        if (this.data.length > 0) {
          const first = this.data[0];
          this.form1.patchValue({
            fromBranch: this.form.value.fromBranch,
            fromCity: first?.fromCity || '',
          });
  
          this.setFormArray('toCity', this.data.map((d: any) => d.toCity));
          // this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
          // this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
        }
      },
      error: (error: any) => {
        console.error('loading failed:', error);
        this.data=null
        const errorMessage = error?.error?.message || 'Failed to load parcel data';
        this.toast.error(errorMessage, 'Error');
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
  
    this.allSelected = this.data.length === formArray.value.length;
    console.log('Selected GRN Numbers:', formArray.value);
  }
  
  onSelectAllChange(event: any) {
    const formArray = this.form1.get('grnNo') as FormArray;
    if (event.target.checked) {
      this.data.forEach((row:any) => {
        if (!formArray.value.includes(row.grnNo)) {
          formArray.push(this.fb.control(row.grnNo));
        }
      });
    } else {
      formArray.clear();
    }
    this.allSelected = event.target.checked;
    console.log('All GRN Numbers Selected:', formArray.value);
  }


    ParcelLoad() {
      const grnList = this.form1.value.grnNo || [];
    
      // 🚫 If no GRN is selected, show a toast and return
      if (!grnList.length) {
        this.toast.error('Please select at least one GRN before loading.', 'Warning');
        return;
      }
    
      const payload = {
        fromBranch: this.form1.value.fromBranch,
        toBranch: this.form1.value.toBranch,
        vehicalNumber: this.form1.value.vehicalNumber,
        remarks: this.form1.value.remarks,
        fromCity: this.form1.value.fromCity,
        toCity: this.form1.value.toCity || '',     
        grnNo: grnList,
        lrNumber: this.form1.value.lrNumber || [],
      };
    
      console.log('Final Payload:', payload);
    
      this.api.BranchtoBranchLoad(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.toast.success('Parcel loaded successfully!', 'Success');
    
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/parcel-branch']);
            });
          }, 1000);
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          const errorMsg = error?.error?.message || 'Parcel Loading Failed. Please try again.';
          this.toast.error(errorMsg, 'Error');
        },
      });
    }
    

}
