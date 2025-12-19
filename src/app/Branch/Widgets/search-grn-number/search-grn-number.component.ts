import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('openModalBtn') openModalBtn!: ElementRef;

  searchResult: any[] = [];
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  updata: any;
  form: FormGroup;
  searchField: string = 'grnNo'; // Default selection
  searchTerm: string = '';
// 
  branchId: any;
  pfdata: any;
  printlR: any;
  constructor(
    private api: BranchService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toast:ToastrService
  ) {
    this.form = this.fb.group({
      grnNo: ['', Validators.required],
      receiverName: [''],
      receiverMobile: [''],
      lrNumber: [''],

    });
  }
  ngOnInit(): void {
    this.searchTerm = '';
    this.getProfileData();  }



data2: any[] = [];
getProfileData() {
  this.api.GetProfileData().subscribe((res: any) => {
    console.log('profile', res);
    this.pfdata = res.role;    
    console.log(this.pfdata, 'branchid');

  });

}

editBooking(grnNo: string): void {
  if (this.pfdata === 'admin') {
    this.router.navigateByUrl(`/booking/${grnNo}`).then(() => {
      window.location.reload();
    });
  } else if (this.pfdata === 'subadmin') {
    this.router.navigateByUrl(`/sub-booking/${grnNo}`).then(() => {
      window.location.reload();
    });
  } else if (this.pfdata === 'employee') {
    this.router.navigateByUrl(`/employee-booking/${grnNo}`).then(() => {
      window.location.reload();
    });
  }
}

isEditable(bookingDate: string, bookingStatus: number): boolean {
  if (bookingStatus === 1) {
    return false; 
  }

  const bookingTime = new Date(bookingDate).getTime();
  const currentTime = new Date().getTime();
  const timeDifferenceInHours = (currentTime - bookingTime) / (1000 * 60 * 60);

  return timeDifferenceInHours <= 10;
}
printlr() {
  if (this.data2 && this.data2.length > 0) {
    this.printlR = this.data2;
    const grnNo = this.data2[0].grnNo; // Extract the GRN No
    console.log('GRN No:', grnNo);
    this.router.navigate(['/employee-printgrn/' + grnNo]);

  }
}
searchUser(): void {
  if (this.searchTerm && this.searchTerm.trim() !== '' && this.searchField) {
    const searchPayload = {
      mobile: '',
      searchCustomer: '',
      grnNo: '',
      lrNumber: '',
    };

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

    this.api.GetSearch(searchPayload).subscribe(
      (res: any) => {
        if (res && res.length > 0) {
          this.data2 = res;
          console.log('Search result:', this.data2);
          // Programmatically trigger modal
          this.openModalBtn.nativeElement.click();
        } else {
          this.toast.warning('No data found for your search.');
          this.data2 = [];
        }
      },
      (error) => {
        console.error('Search error:', error);
        this.toast.error('An error occurred while searching.');
      }
    );
  }
}




clearSearch(): void {
  this.searchTerm = '';
  this.searchField = '';
  this.data2 = [];
}

  copyGRN(grnNo: string): void {
    navigator.clipboard.writeText(grnNo).then(() => {
      this.toast.success(`GRN No copied: ${grnNo}`);
    })}
  copyLR(lrNo: string): void {
    navigator.clipboard.writeText(lrNo).then(() => {
      this.toast.success(`LR No copied: ${lrNo}`);
    })
  }
  
}
