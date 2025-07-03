import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { AdminService } from 'src/app/service/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parcel-delivery',
  templateUrl: './parcel-delivery.component.html',
  styleUrls: ['./parcel-delivery.component.scss']
})
export class ParcelDeliveryComponent {
  searchTerm: string = '';
  searchResult: any[] = [];
  data2: any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  updata: any;
  form: FormGroup;
  form2: FormGroup;
  employee: any;
  branchdata: any;
  citydata: any;
  pfdata: any;
  showReceiptToPrint = false;

  constructor(
    private api: BranchService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private admin: AdminService,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      grnNo: ['', Validators.required],
    });

    this.form2 = this.fb.group({
      grnNo: ['', Validators.required],
      receiverName: [''],
      // receiverMobile: [''],
      receiverMobile: ['', [ Validators.required, Validators.pattern('^[0-9]{10}$') // Only 10-digit numbers allowed
        ]
      ],
      lrNumber: [''],
      deliveryAmount:[Validators.required],
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe(params => {
      const grn = params['grn'];
      if (grn) {
        this.searchTerm = grn;
        this.form2.patchValue({ grnNo: grn });
        this.searchUser();
      }
    });

    this.api.GetCities().subscribe((res: any) => {
      this.citydata = res;
    });

    this.api.GetBranch().subscribe((res: any) => {
      this.branchdata = res;
    });

    this.getProfileData();
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  

  

  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log("data:",res);
          this.GetAllEmployee();
          
          if (res && res.booking) {
            this.data2 = [res.booking]; // Flattened structure
            this.errorMessage = '';
          } else {
            this.data2 = [];
            this.errorMessage = 'No results found for the given search term.';
          }
        },
        (err: any) => {
          this.errorMessage = err.error?.message || 'An error occurred while searching.';
          this.data2 = [];
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid search term.';
      this.data2 = [];
    }
  }

  GetAllEmployee() {
    this.admin.GetEmployees().subscribe({
      next: (res) => {
        this.employee = res;
        console.log("emolyee:",this.employee);
        
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch employee data.';
      },
    });
  }

  
  // updateParcelStatus() {
  //   if (this.form2.invalid) {
  //     this.form2.markAllAsTouched(); // Show validation messages
  //     this.toast.error('Please fill all required fields correctly.', 'Form Error');
  //     return;
  //   }
  
  //   const payload = {
  //     grnNo: this.form2.value.grnNo,
  //     receiverName: this.form2.value.receiverName,
  //     receiverMobile: this.form2.value.receiverMobile,
  //     deliveryAmount: this.form2.value.deliveryAmount,
  //   };
  
  //   console.log('Delivery Amount:', payload.deliveryAmount);
  
  //   this.api.ReceivedParcelUpdate(payload).subscribe(
  //     (res: any) => {
  //       this.updata = res;
  //       this.toast.success(res.message || 'Parcel status updated successfully', 'Success');
  //       this.searchUser();
  //     },
  //     (error) => {
  //       const errMsg = error.error?.message || 'Failed to update parcel status';
  //       this.toast.error(errMsg, 'Error');
  //     }
  //   );
  // }

  updateParcelStatus() {
    if (this.form2.invalid) {
      this.form2.markAllAsTouched(); // Show validation messages
      this.toast.error('Please fill all required fields correctly.', 'Form Error');
      return;
    }
  
    const payload = {
      grnNo: this.form2.value.grnNo,
      receiverName: this.form2.value.receiverName,
      receiverMobile: this.form2.value.receiverMobile,
      deliveryAmount: this.form2.value.deliveryAmount,
    };
  
    console.log('Delivery Amount:', payload.deliveryAmount);
  
    this.api.ReceivedParcelUpdate(payload).subscribe(
      (res: any) => {
        this.updata = res;
        this.toast.success(res.message || 'Parcel status updated successfully', 'Success');
  
        this.searchUser();     // Re-fetch user data
        this.form2.reset();    // ✅ Clear all form fields after success
      },
      (error) => {
        const errMsg = error.error?.message || 'Failed to update parcel status';
        this.toast.error(errMsg, 'Error');
      }
    );
  }
  
  

  onFromcitySelect(event: any) {
    const selectedCity = event.target.value;
    if (selectedCity) {
      this.api.GetBranchbyCity(selectedCity).subscribe(
        (res: any) => {
          this.branchdata = res;
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    }
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
    });
  }



  printReceipt() {
    this.showReceiptToPrint = true;

    setTimeout(() => {
      const printContents = document.getElementById('printSection')?.innerHTML;
      const originalContents = document.body.innerHTML;

      if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload(); // Reset Angular bindings
      }
    }, 100);
  }
}


