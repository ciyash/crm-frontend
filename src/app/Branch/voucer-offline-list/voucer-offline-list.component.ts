import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-voucer-offline-list',
  templateUrl: './voucer-offline-list.component.html',
  styleUrls: ['./voucer-offline-list.component.scss']
})
export class VoucerOfflineListComponent{

  
     citydata: any = []; // Ensure it's initialized to prevent undefined 
      form: FormGroup;
      vdata:any;
      data1:any = [];voucherno: any;
  getgrndata: any;
  ffdata: any;
  profileData: any;
  company: any;
  pfdata: any;
  today = new Date();
  todayDateTime: any;
;
      LoadSuccess: boolean = false;
      allSelected: boolean = false;
      pdata:any;
      cbdata:any;
      branchData:any;
      vldata:any;
      constructor(private api: BranchService, private fb: FormBuilder, private router:Router, private toast:ToastrService) {
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
this.getProfileData();
        const now = new Date();

        const options: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        };
        this.todayDateTime = now.toLocaleString('en-GB', options).replace(',', '');
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
        
        
        // VoucherLoad() {
        //   const payload = {
        //     fromDate: this.form.value.fromDate,
        //     toDate: this.form.value.toDate,
        //     vehicalNumber: this.form.value.vehicalNumber,
        //     fromCity: this.form.value.fromCity,
        //     toCity: this.form.value.toCity,
        //     fromBranch: this.form.value.fromBranch,
        //   };
        
        //   console.log('Final Payload:', payload);
          
        //   this.api.ParcelVouchersDetails(payload).subscribe({
        //     next: (response: any) => {
        //       console.log('Parcel loaded successfully:', response);
        //       // alert('Parcel Loaded Successfully!');
        //       this.data1=response;
              
        //     },
        //     error: (error: any) => {
        //       console.error('Parcel loading failed:', error);
        //     },
        //   });
        // }

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
              this.data1 = response;
              this.toast.success('Parcel loaded successfully!', 'Success');
            },
            error: (error: any) => {
              console.error('Parcel loading failed:', error);
        
              this.data1 = null;
                 const message =
                error?.error?.message || 'Parcel loading failed. Please try again.';
              this.toast.error(message, 'Error');
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




      
printgrnData(id: any): void {
  this.voucherno = id;
  console.log('voucherno:', this.voucherno);

  this.api.PrintVoucher(id).subscribe({
    next: (res) => {
      console.log('printVoucher:', res);
      this.getgrndata = res;

      // Delay to allow Angular to update the DOM with new data
      setTimeout(() => {
        this.printReport();
      }, 200); // 200ms delay is usually sufficient
    },
    error: (err) => {
      console.error('Error fetching voucher:', err);
    },
  });
}

printReport(): void {
  const printContents = document.getElementById('print-section')?.innerHTML;

  if (printContents) {
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Dispatched Stock Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
              }

              th, td {
                border: 1px solid #000;
                padding: 4px;
                text-align: center;
              }

              h1, h4, h6, p {
                margin: 4px 0;
              }

              .text-center {
                text-align: center;
              }

              .fw-bold {
                font-weight: bold;
              }

              .text-end {
                text-align: right;
              }

              .summary-table {
                margin-top: 20px;
              }

              .remarks {
                margin-top: 30px;
                font-size: 14px;
              }

              .no-border {
                border: none !important;
              }

              .no-border th, .no-border td {
                border: none !important;
              }

              @media print {
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin.document.close();
    } else {
      console.error('Popup blocked or failed to open.');
    }
  } else {
    console.error('Print section not found.');
  }
}



getProfileData() {
  this.api.GetProfileData().subscribe((res: any) => {
    console.log('profile', res);
    
    this.ffdata = res.branchId;
    this.pfdata = res.branchId.city;
    this.profileData = res;
    console.log('profileData:', this.profileData);
    this.company=this.profileData.companyId
    console.log("hgjygyt:",this.company);
    

 
  });
}

}
