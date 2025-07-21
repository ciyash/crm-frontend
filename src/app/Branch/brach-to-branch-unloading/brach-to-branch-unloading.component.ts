import { Component,ViewChild,ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 

@Component({
  selector: 'app-brach-to-branch-unloading',
  templateUrl: './brach-to-branch-unloading.component.html',
  styleUrls: ['./brach-to-branch-unloading.component.scss']
})
export class BrachToBranchUnloadingComponent {

   citydata: any = []; // Ensure it's initialized to prevent undefined 
    form: FormGroup;
    vdata:any;
    data:any;
    form1:FormGroup;
    LoadSuccess: boolean = false;
    allSelected: boolean = false;
    pdata:any;
    @ViewChild('fromBranch') fromBranch!: ElementRef;
    @ViewChild('toBranch') toBranch!: ElementRef;
    constructor(private api: BranchService, private fb: FormBuilder, private router:Router,private toast:ToastrService) {
      this.form = this.fb.group({
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: ['' ],
        toBranch: ['']
      });
  
      this.form1 = this.fb.group({
        lrNumber: this.fb.array([], ),
        grnNo: this.fb.array([], ),
        fromDate: ['', ],
        toDate: ['', ],
       fromBranch:['', ],
        unloadBranch:['', ],
        remarks: ['', Validators.required],
      });
  
    }
    // addhh
  
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
        // From Branch select2
        $(this.fromBranch.nativeElement).select2();
        $(this.fromBranch.nativeElement).on('select2:select', (event: any) => {
          const selected = event.params.data.id;
          this.form.get('fromBranch')?.setValue(selected); // Use `form` not `form1`
          console.log('Selected From Branch:', selected);
        });
    
        // To Branch select2
        $(this.toBranch.nativeElement).select2();
        $(this.toBranch.nativeElement).on('select2:select', (event: any) => {
          const selected = event.params.data.id;
          this.form.get('toBranch')?.setValue(selected);
          console.log('Selected To Branch:', selected);
        });
      }, 0);
    }
    

    loaddata() {
      if (this.form.invalid) {

        return;
      }
    
      const payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        fromCity: this.form.value.fromCity,
        toBranch: this.form.value.toBranch,
      };
    
      console.log('Final Payload:', payload);
    
      this.api.postBranchtobranchUnLoadingFilter(payload).subscribe({
        next: (response: any) => {
          console.log('loaded successfully:', response);
          this.toast.success('ParcelBranch to Branch Unloaded Successfully', 'Success');

          this.data = response.data;
          this.LoadSuccess = true;
    
          if (this.data.length > 0) {
            this.form1.patchValue({
              fromDate: payload.fromDate,
              toDate: payload.toDate,
              fromCity: payload.fromCity,
              unloadBranch: payload.toBranch,
            });
    
            this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
            this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
          }
        },
        error: (error: any) => {
          console.error('loading failed:', error);
          this.toast.error('NO Parcel Loading. Please try again.', 'failed');

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
          grnNo: this.form1.value.grnNo,
          lrNumber: this.form1.value.lrNumber,
          fromDate: this.form1.value.fromDate,
          toDate: this.form1.value.toDate,
          branch:this.form1.value.branch,
          unloadBranch:this.form1.value.unloadBranch,
          remarks: this.form1.value.remarks,
        };
      
        console.log('Final Payload:', payload);
        
        this.api.BranchtobranchUnLoading(payload).subscribe({
          next: (response: any) => {
            console.log('Parcel loaded successfully:', response);
            // alert('Parcel Loaded Successfully!');
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/barnchtobranchunloading']);
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
