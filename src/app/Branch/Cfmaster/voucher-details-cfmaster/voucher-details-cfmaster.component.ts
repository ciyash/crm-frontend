import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-voucher-details-cfmaster',
  templateUrl: './voucher-details-cfmaster.component.html',
  styleUrls: ['./voucher-details-cfmaster.component.scss']
})
export class VoucherDetailsCfmasterComponent {

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
        senderName: ['', Validators.required],               
            });
  
            this.form1 = this.fb.group({
           
              senderName: ['', ],                 
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
  
    VoucherDetailsLoad() {
      const payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        senderName: this.form.value.senderName,
      };
    
      console.log('Final Payload:', payload);
      
      this.api.VoucherDetailsLoad(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.toast.success('Vouchers loaded successfully','Success');
          this.vldata=response.data;
          console.log("vocherdata:",this.vldata);
          if (this.vldata.length > 0) {
            this.form1.patchValue({
              fromDate: this.form.value.fromDate,
              toDate: this.form.value.toDate,
              senderName: this.form.value.senderName,
              
            });
    
          }
          
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          this.toast.error('Parcel Loading Failed. Please try again', 'Error')
  
        },
      });
    }

    
  
    VoucherDetailsGenerate() {
      const payload = {
        fromDate: this.form1.value.fromDate,
        toDate: this.form1.value.toDate,
        senderName: this.form1.value.senderName,
      };
    
      console.log('Final Payload:', payload);
      
      this.api.GetVoucherDetails(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.toast.success('Credit Voucher Successfully Generated','Success')
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/voucherdetailscf']);
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


    // printName(agentName: string) {
    //   console.log('Agent Name:', agentName);
    //   const payload = {
    //     fromDate: this.form.value.fromDate,
    //     toDate: this.form.value.toDate,
    //     senderName: agentName
    //   };
    //   this.api.GetVoucherDetails(payload).subscribe({
    //     next: (response: any) => {
    //       console.log('Voucher Details:', response);
    //       this.form1.patchValue({
    //         senderName: response.senderName || agentName
    //       })

    //       // localStorage.setItem('voucherDetails', JSON.stringify(response));
    //       this.toast.success('Voucher details loaded', 'Success');
    //       // window.open('/voucherreport', '_blank');


    //       localStorage.setItem('voucherDetails', JSON.stringify(response));
    //       const baseUrl = window.location.origin;
    //       const voucherreportUrl = `${baseUrl}/cloud/voucherreport`;
    //       window.open(voucherreportUrl, '_blank');


    //     },
    //     error: (error: any) => {
    //       console.error('Failed to fetch voucher details:', error);
    //       this.toast.error('Failed to load voucher details', 'Error');
    //     }
    //   });
    // }

    printName(agentName: string): void {
      console.log('Agent Name:', agentName);
    
      const payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        senderName: agentName
      };
    
      this.api.GetVoucherDetails(payload).subscribe({
        next: (response: any) => {
          console.log('Voucher Details:', response);
    
          if (response) {
            this.form1.patchValue({
              senderName: response.senderName || agentName
            });
    
            localStorage.setItem('voucherDetails', JSON.stringify(response));
    
            this.toast.success('Voucher details loaded successfully', 'Success');
    
            const baseUrl = window.location.origin;
            const voucherReportUrl = `${baseUrl}/cloud/voucherreport`;
            window.open(voucherReportUrl, '_blank');
          } else {
            this.toast.error('No data received for voucher details', 'Error');
          }
        },
        error: (error: any) => {
          console.error('Failed to fetch voucher details:', error);
          this.toast.error('Failed to load voucher details', 'Error');
        }
      });
    }
    
    


    

    
    
}
