import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';
@Component({
  selector: 'app-search-grn-number',
  templateUrl: './search-grn-number.component.html',
  styleUrls: ['./search-grn-number.component.scss'],
})
export class SearchGrnNumberComponent {
  searchResult: any[] = [];
  data2: any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  updata: any;
  form: FormGroup;
  searchField: string = 'grnNo'; // Default selection
  searchTerm: string = '';

  branchId: any;
  constructor(
    private api: BranchService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toast:ToastrService
  ) {
    this.form = this.fb.group({
      grnNo: ['', Validators.required],
      receiverName1: [''],
      receiverMobile1: [''],
      lrNumber: [''],

    });
  }
  ngOnInit(): void {
    this.searchTerm = this.activeroute.snapshot.params['grnNo'];
  }

  updateParcelStatus() {
    const payload = {
      grnNo: this.form.value.grnNo,
      receiverName1: this.form.value.receiverName1,
      receiverMobile1: this.form.value.receiverMobile1,
    };
    console.log('Final Payload:', payload);
  
    this.api.ReceivedParcelUpdate(payload).subscribe(
      (res: any) => {
        console.log('Update Status:', res);
        this.updata = res;
  
        // ✅ Show success message from backend if available
        if (res.message) {
          this.toast.success(res.message, 'Success');
        } else {
          this.toast.success('Parcel status updated successfully', 'Success');
        }
  
        // ✅ Redirect after short delayad
        setTimeout(() => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/booking']);
            });
        }, 500);
      },
      (error) => {
        console.error('Error updating status:', error);
  
        // ✅ Show error message from backend if available
        if (error.error && error.error.message) {
          this.toast.error(error.error.message, 'Error');
        } else {
          this.toast.error('Failed to update parcel status', 'Error');
        }
      }
    );
  }

  searchUser(): void {
    debugger;
    if (this.searchTerm && this.searchTerm.trim() !== '' && this.searchField) {
      console.log(
        'Searching by:',
        this.searchField,
        'Value:',
        this.searchTerm.trim()
      );
      const searchPayload = {
        mobile: '',
        searchCustomer: '',
        grnNo: '',
        lrNumber: '',
      };
      console.log('searchdata:', searchPayload);
      switch (this.searchField) {
        case 'senderMobile':
          searchPayload.mobile = this.searchTerm.trim();
          break;
        case 'senderName':
          searchPayload.searchCustomer = this.searchTerm.trim();
          break;
        case 'grnNo':
          searchPayload.grnNo = this.searchTerm.trim();
          break;
        case 'lrNumber':
          searchPayload.lrNumber = this.searchTerm.trim();
          break;
      }
      this.api.GetSearch(searchPayload).subscribe((res: any) => {
        this.data2 = res;
        console.log('searchdataobject:', this.data2);
        
      });
    }
  }
}
