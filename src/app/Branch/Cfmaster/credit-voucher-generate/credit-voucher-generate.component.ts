import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(private api:BranchService, private fb:FormBuilder, private toast:ToastrService){
     this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      senderName: ['', Validators.required],               
          });
  }

  ngOnInit(){

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
        this.toast.success('Parcel loaded successfully','Success');
        this.vldata=response;
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
      this.api.searchUser(searchTerm).subscribe(
        (res: any) => {
          console.log('API Response:', res);
          this.userList = res.length ? res : [];
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
