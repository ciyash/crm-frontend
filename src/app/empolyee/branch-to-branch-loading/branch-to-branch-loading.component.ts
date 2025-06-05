import { ChangeDetectorRef, Component, OnInit,ElementRef, ViewChild  } from '@angular/core';

import { BranchService } from 'src/app/service/branch.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 
@Component({
  selector: 'app-branch-to-branch-loading',
  templateUrl: './branch-to-branch-loading.component.html',
  styleUrls: ['./branch-to-branch-loading.component.scss']
})
export class BranchToBranchLoadingComponent {



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
  
  
    constructor(private api: BranchService, private fb: FormBuilder, private router:Router,private toast:ToastrService) {
      this.form = this.fb.group({
        fromBookingDate: [this.getTodayDateString(), Validators.required],
        toBookingDate: [this.getTodayDateString(), Validators.required],
        fromBranch: ['', Validators.required]
      });
  
      this.form1 = this.fb.group({
        loadingType: ['branchLoad'],
        lrNumber: this.fb.array([], Validators.required),
        grnNo: this.fb.array([], Validators.required),
        fromBookingDate: [this.getTodayDateString(), Validators.required],
        toBookingDate: [this.getTodayDateString(), Validators.required],
        fromBranch: [''],
        toBranch: ['', Validators.required],
        vehicalNumber: ['', Validators.required],
        remarks: ['', Validators.required],
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
    setTimeout(() => {
        $(this.toBranch.nativeElement).select2();
        $(this.toBranch.nativeElement).on('select2:select', (event: any) => {
          const selectedBranch = event.params.data.id;
          this.form1.get('toBranch')?.setValue(selectedBranch);
          console.log('Selected To Branch:', selectedBranch);
        });
        $(this.vehicle.nativeElement).select2();
        $(this.vehicle.nativeElement).on('select2:select', (event: any) => {
          const selectedVehicle = event.params.data.id;
          this.form1.get('vehicalNumber')?.setValue(selectedVehicle);
          console.log('Selected Vehicle Number:', selectedVehicle);
        });
    }, 0);}
    
  
  
  
  
  
    
  
    // loaddata(){
    //     const payload = {
    //       fromBookingDate: this.form.value.fromBookingDate,
    //       toBookingDate: this.form.value.toBookingDate,
    //       fromBranch: this.form.value.fromBranch,
    //     };
    //     console.log('Final Payload:', payload);
    //     this.api.postBranchLoading(payload).subscribe({
    //       next: (response: any) => {
    //         console.log('loaded successfully:', response);
    //         this.toast.success('ParcelBranch to Branch loaded Successfully', 'Success');
    //         this.data=response;
    //         this.LoadSuccess = true;
    //       // ✅ Assign loaded data to form1 fields
    //       if (this.data.length > 0) {
    //         this.form1.patchValue({
    //           fromBranch: this.form.value.fromBranch,
    //           fromBookingDate: this.form.value.fromBookingDate,
    //           toBookingDate: this.form.value.toBookingDate,
    //           fromCity: this.form.value.fromCity,
    //           loadingDate: '', // You can keep it empty for user input
    //           vehicalNumber: '',
    //           driverName: '',
    //           driverNo: '',
    //         });
    
    //         // ✅ Set `toCity`, `grnNo`, and `lrNumber` as FormArray
    //         this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
    //         this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
    //       }
    //       },
    //       error: (error: any) => {
    //         console.error('loading failed:', error);
    //         this.toast.error('NO Parcel Loading', 'failed');
  
    //       },
    //     });
    // }
    
    loaddata() {
      const payload = {
        fromBookingDate: this.form.value.fromBookingDate,
        toBookingDate: this.form.value.toBookingDate,
        fromBranch: this.form.value.fromBranch,
      };
    
      console.log('Final Payload:', payload);
    
      this.api.postBranchLoading(payload).subscribe({
        next: (response: any) => {
          console.log('loaded successfully:', response);
    
          // Show success message from backend (assuming response contains a message property)
          const successMessage = response?.message || 'Parcel Branch loading successfully';
          this.toast.success(successMessage, 'Success');
    
          // Store the data and set the success flag
          this.data = response;
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
          // Show error toast (if backend provides error details)
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
  
