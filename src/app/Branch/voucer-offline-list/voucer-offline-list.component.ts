import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-voucer-offline-list',
  templateUrl: './voucer-offline-list.component.html',
  styleUrls: ['./voucer-offline-list.component.scss']
})
export class VoucerOfflineListComponent {

  
     citydata: any = []; // Ensure it's initialized to prevent undefined 
      form: FormGroup;
      vdata:any;
      data1:any = [];;
      LoadSuccess: boolean = false;
      allSelected: boolean = false;
      pdata:any;
      cbdata:any;
      branchData:any;
      vldata:any;
      constructor(private api: BranchService, private fb: FormBuilder, private router:Router) {
        this.form = this.fb.group({
          fromDate: [this.getTodayDateString(), Validators.required],
          toDate: [this.getTodayDateString(), Validators.required],
          vehicalNumber: ['', ],
          fromCity: ['', ],
          toCity: ['',],
          fromBranch: ['', ],
        });
      }
    
      ngOnInit() {
        this.api.GetBranch().subscribe({
          next: (res: any) => {
            this.branchData = res;
            console.log('Branch data fetched successfully:', this.citydata);
          },
          error: (err) => console.error('Error fetching branch data:', err)
        });
        this.api.VehicleData().subscribe((res:any)=>{
            console.log('vdata',res);
            this.vdata=res;
        });
        this.api.GetCities().subscribe((res:any)=>{
          console.log('citydata',res);
          this.citydata=res;
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
    
      onFromcitySelect(event: any) {
        const cityName = event.target.value;
        if (cityName) {
          this.api.GetBranchbyCity(cityName).subscribe(
            (res: any) => {
              console.log('Branches for selected city:', res);
              this.cbdata = res;
            },
            (error: any) => {
              console.error('Error fetching branches:', error);
            }
          );
        } else {
          this.pdata = [];
        }
      }
    
       setFormArray(controlName: string, values: any[]) {
          const formArray = this.form.get(controlName) as FormArray;
          formArray.clear(); // ✅ Clear previous values
        
          values.forEach(value => {
            formArray.push(this.fb.control(value));
          });
        }
    
        onGrnNoChange(event: any, grnNo: string) {
          const formArray = this.form.get('grnNo') as FormArray;
        
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
          this.allSelected = this.data1.length === formArray.value.length;
          console.log('Selected GRN Numbers:', formArray.value);
        }
        
        
        VoucherLoad() {
          const payload = {
            fromDate: this.form.value.fromDate,
            toDate: this.form.value.toDate,
            vehicalNumber: this.form.value.vehicalNumber,
            fromCity: this.form.value.fromCity,
            toCity: this.form.value.toCity,
            fromBranch: this.form.value.fromBranch,
          };
        
          console.log('Final Payload:', payload);
          
          this.api.ParcelVouchersDetails(payload).subscribe({
            next: (response: any) => {
              console.log('Parcel loaded successfully:', response);
              // alert('Parcel Loaded Successfully!');
              this.data1=response;
              
            },
            error: (error: any) => {
              console.error('Parcel loading failed:', error);
              alert('Parcel Loading Failed. Please try again.');
            },
          });
        }

          getvouchersdata(id:any){
        this.api.GetVouchersListData(id).subscribe((res)=>{
            console.log('vouchersdata',res);
            this.vldata=res;
            console.log("thisvladata:",this.vldata)
        })
      }

        printgrnData(id:any){
          this.router.navigateByUrl('/printvouchersdata/'+id);
        }

}
