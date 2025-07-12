import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-parcel-voucher-details',
  templateUrl: './parcel-voucher-details.component.html',
  styleUrls: ['./parcel-voucher-details.component.scss'],
})
export class ParcelVoucherDetailsComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
  @ViewChild('selectElem2') selectElem2!: ElementRef;
  @ViewChild('droupbranch') droupbranch!: ElementRef;
  @ViewChild('vechicle') vechicle!: ElementRef;
  citydata: any = []; // Ensure it's initialized to prevent undefined
  form: FormGroup;
  vdata: any;
  data1: any = [];
  fromCityValue: any;
  filteredCityList: any;
  onPickupBranchSelect: any;
  onTocitySelect: any;
  onDropBranchSelect: any;
  LoadSuccess: boolean = false;
  allSelected: boolean = false;
  pdata: any;
  cbdata: any;
  branchData: any;
  vldata: any;
  allgetvechicle: any;
  profileData: any;
  ffdata: any;
  pfdata: any;
  voucherno: any;
  getgrndata: any;
  company: any;
  today = new Date();

  todayDateTime:any;
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      vehicalNumber: [''],
      fromCity: [''],
      toCity: [''],
      fromBranch: [''],
    });
  }

  ngOnInit() {
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

    this.api.GetCities().subscribe((res: any) => {
      console.log('citydata', res);
      this.citydata = res;
      this.getProfileData()
    });
    this.api.VehicleData().subscribe((res: any) => {
      console.log('allvechicle:', res);
      this.allgetvechicle = res;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // From City
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).val('all').trigger('change'); // ✅ force default
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.patchValue({ fromCity: selectedCity });
        this.onFromcitySelect({ target: { value: selectedCity } });
      });

      // Pickup Branch
      $(this.pickupbranch.nativeElement).select2();
      $(this.pickupbranch.nativeElement).val('all').trigger('change'); // ✅
      $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form.patchValue({ fromBranch: selectedBranch });
        this.onPickupBranchSelect({ target: { value: selectedBranch } });
      });

      // To City
      $(this.selectElem2.nativeElement).select2();
      $(this.selectElem2.nativeElement).val('all').trigger('change'); // ✅
      $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
        const selectedToCity = event.params.data.id;
        this.form.patchValue({ toCity: selectedToCity });
        this.onTocitySelect({ target: { value: selectedToCity } });
      });

      // Drop Branch
      $(this.droupbranch.nativeElement).select2();
      $(this.droupbranch.nativeElement).val('all').trigger('change'); // ✅
      $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedDropBranch = event.params.data.id;
        this.form.patchValue({ dropBranch: selectedDropBranch });
        this.onDropBranchSelect({ target: { value: selectedDropBranch } });
      });

      $(this.vechicle.nativeElement).select2();
      $(this.vechicle.nativeElement).val('').trigger('change');
      $(this.vechicle.nativeElement).on('select2:select', (event: any) => {
        const selectedVehicle = event.params.data.id;
        this.form.patchValue({ vehicalNumber: selectedVehicle });
      });

    }, 0);
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
          this.pdata = res;
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

    values.forEach((value) => {
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
        this.data1 = response;
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('Parcel Loading Failed. Please try again.');
      },
    });
  }

  getvouchersdata(id: any) {
    this.api.GetVouchersListData(id).subscribe((res) => {
      console.log('vouchersdata', res);
      this.vldata = res;
      console.log('thisvladata:', this.vldata);
    });
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
//   getProfileData() {
//     this.api.GetProfileData().subscribe((res: any) => {
//       console.log('profile', res);
      
//       this.ffdata = res.branchId;
//       this.pfdata = res.branchId.city;
//       this.profileData = res;
//       console.log('profileData:', this.profileData);
//       this.company=this.profileData.companyId
//       console.log("hgjygyt:",this.company);
      
//     });
// }




getProfileData() {
  this.api.GetProfileData().subscribe((res: any) => {
    this.fromCityValue = res.branchId.city;
    // Filter city list and set values to forms
    this.filteredCityList = this.citydata.filter(
      (city: { cityName: any }) => city.cityName === this.fromCityValue
    );

    this.form.patchValue({ fromCity: this.fromCityValue });

    this.ffdata = res.branchId;
    this.pfdata = res.branchId.city;
    this.profileData = res;
    console.log('profileData:', this.profileData);
    this.company=this.profileData.companyId
    console.log("hgjygyt:",this.company);

    // Trigger form change logic if needed
    this.onFromcitySelect({ target: { value: this.fromCityValue } });
    setTimeout(() => {
      // Update first select2
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement)
        .val(this.fromCityValue)
        .trigger('change');
      $(this.selectElem.nativeElement)
        .prop('disabled', true)
        .trigger('change.select2');
    }, 0);
  });
}
}