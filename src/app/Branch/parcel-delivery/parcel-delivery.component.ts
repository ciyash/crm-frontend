










  
  

   
   


  
 








  










 



  

  
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
  emplooyee: any;
  todayDate: string = '';
  employee: any;
  branchdata: any;
  citydata: any;
  onPickupBranchSelect: any;
  pdata: any;
  tbcdata: any;
  form1!: FormGroup;
  pfdata: any;
  today: Date = new Date();
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
      receiverMobile: [''],
      lrNumber: [''],
    });
  }

  ngOnInit(): void {
    // ✅ Handle query param grn
    this.activeroute.queryParams.subscribe(params => {
      const grn = params['grn'];
      if (grn) {
        this.searchTerm = grn;
        this.form2.patchValue({ grnNo: grn }); // Optionally prefill form2
        this.searchUser(); // Trigger search automatically
      }
    });

    // Get cities
    this.api.GetCities().subscribe((res: any) => {
      console.log('Cities:', res);
      this.citydata = res;
    });

    // Get branches
    this.api.GetBranch().subscribe((res: any) => {
      console.log('Branches:', res);
      this.branchdata = res;
    });

    this.GetAllEmployee();
    this.getProfileData();
  }

  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('Search Term:', this.searchTerm);

      this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log('API Response:', res);

          if (res && Array.isArray(res.data)) {
            this.data2 = res.data;
            this.errorMessage = '';
          } else if (res && typeof res === 'object') {
            this.data2 = [res];
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

  getStatusLabel(status: number): string {
    const statusLabels = ['booking', 'loading', 'unloading', 'missing', 'delivery', 'cancel'];
    return statusLabels[status] || 'unknown';
  }

  GetAllEmployee() {
    this.admin.GetEmployeesData().subscribe({
      next: (res) => {
        console.log('Employee data:', res);
        this.employee = res;
      },
      error: (err) => {
        console.error('Error fetching employee data:', err);
        this.errorMessage = 'Failed to fetch employee data.';
      },
    });
  }

  updateParcelStatus() {
    const payload = {
      grnNo: this.form2.value.grnNo,
      receiverName: this.form2.value.receiverName,
      receiverMobile: this.form2.value.receiverMobile,
    };

    console.log('Final Payload:', payload);

    this.api.ReceivedParcelUpdate(payload).subscribe(
      (res: any) => {
        console.log('Update Status:', res);
        this.updata = res;

        if (res.message) {
          this.toast.success(res.message, 'Success');
        } else {
          this.toast.success('Parcel status updated successfully', 'Success');
        }

        this.searchUser(); // Refresh data
                //  this.form2.reset();

      },
      (error) => {
        console.error('Error updating status:', error);
        const errMsg = error.error?.message || 'Failed to update parcel status';
        this.toast.error(errMsg, 'Error');
      }
    );
  }

  onFromcitySelect(event: any) {
    const selectedCity = event.target.value;
    console.log('Selected City:', selectedCity);

    if (selectedCity) {
      this.api.GetBranchbyCity(selectedCity).subscribe(
        (res: any) => {
          console.log('Branches for selected city:', res);
          this.pdata = res;
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
      console.log('Profile Data:', this.pfdata);
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


