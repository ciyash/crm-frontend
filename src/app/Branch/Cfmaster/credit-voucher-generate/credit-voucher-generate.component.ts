import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-credit-voucher-generate',
  templateUrl: './credit-voucher-generate.component.html',
  styleUrls: ['./credit-voucher-generate.component.scss']
})
export class CreditVoucherGenerateComponent {
  form:FormGroup;
  vldata:any;
  userList: any[] = [];
  showDropdown:boolean=true;
  searchTerm: string = '';
  loading:boolean=true; 
  form1:FormGroup;
  constructor(private api:BranchService, private fb:FormBuilder, private toast:ToastrService, private router:Router){
     this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      senderName: [''],               
          });

          this.form1 = this.fb.group({
            fromDate: ['', ],
            toDate: ['', ],
            grnNo: ['', ],   
            creditForAgent: ['', ],
            fromBranch: ['', ],
            toBranch: ['', ],    
            consignor: ['', ],
            bookingStatus: ['', ],
            charge: ['', ],                
                });
  }

  ngOnInit(){

  }
  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }

  VoucherLoad() {
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      senderName: this.form.value.senderName,
    };
  
    console.log('Final Payload:', payload);
    
    this.api.LoadVouchers(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        this.toast.success('Vouchers loaded successfully','Success');
        this.vldata=response;

        if (this.vldata.length > 0) {
          this.form1.patchValue({
            fromDate: this.form.value.fromDate,
            toDate: this.form.value.toDate,
            grnNo: this.vldata[0]?.grnNo,
            creditForAgent: this.vldata[0]?.senderName,
            fromBranch: this.vldata[0]?.pickUpBranchname,
            toBranch:this.vldata[0]?.dropBranchname,
            consignor: this.vldata[0]?.senderName,
            bookingStatus: this.vldata[0]?.bookingStatus,
            charge: this.vldata[0]?.grandTotal,
            
          });
  
        }
        
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again', 'Error')

      },
    });
  }

  VoucherGenerate() {
    const payload = {
      fromDate: this.form1.value.fromDate,
      toDate: this.form1.value.toDate,
      grnNo: this.form1.value.grnNo,
      creditForAgent: this.form1.value.creditForAgent,
      fromBranch: this.form1.value.fromBranch,
      toBranch: this.form1.value.toBranch,
      consignor: this.form1.value.consignor,
      bookingStatus: this.form1.value.bookingStatus,
      charge: this.form1.value.charge,
    };
  
    console.log('Final Payload:', payload);
    this.api.VoucherGenerate(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        this.toast.success('Credit Voucher Successfully Generated','Success')
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/creditvouchergenerate']);
          });
        }, 1000);
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again', 'Error')

      },
    });
  }

  searchUser(): void {
    const searchTerm = this.form.get('senderName')?.value?.trim();
    if (searchTerm) {
      this.api.searchCfUser(searchTerm).subscribe(
        (res: any) => {
          console.log('API Response:', res);
          this.userList = res.data.length ? res.data : [];
          this.showDropdown = !!this.userList.length;
        },
        (err: any) => {
          console.error('Search Error:', err);
          this.userList = [];
          this.showDropdown = false;
        }
      );
    } else {
      this.userList = [];
      this.showDropdown = false;
    }
  }
  
  selectUser(user: any): void {
    this.form.patchValue({
      senderName: user.name,
      senderMobile: user.phone,
      senderAddress: user.address,
      senderGST: user.gst
    });
    this.showDropdown = false;
  }
  
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Small delay to allow selection click
  }
  

}
