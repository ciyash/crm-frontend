import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-sub-memo-dispatched',
  templateUrl: './sub-memo-dispatched.component.html',
  styleUrls: ['./sub-memo-dispatched.component.scss']
})
export class SubMemoDispatchedComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
  @ViewChild('selectElem2') selectElem2!: ElementRef;
  @ViewChild('droupbranch') droupbranch!: ElementRef;
  @ViewChild('vechicle') vechicle!: ElementRef;

  form!: FormGroup;
  citydata: any;
  branchdata: any;
  allgetvechicle: any;
  pfdata: any;
  DispatchedData: any;
  fromDate: string = '';
toDate: string = '';
today = new Date();


  totalQty = 0;
  totalFreight = 0;
  totalHamali = 0;
  totalNetAmount = 0;
  tbcdata: any;
  pdata: any;
  onDropBranchSelect: any;
  onPickupBranchSelect: any;
  fromCityValue: any;
  filteredCityList: any;

  constructor(
    private api: BranchService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
      vehicalNumber: [''],
    });
  }

  ngOnInit() {
    this.getProfileData();

    // Fetch cities
    this.api.GetCities().subscribe((res: any) => {
      console.log('citydata', res);
      this.citydata = res;
      this.getProfileData();

    });

    // Fetch branches
    this.api.GetBranch().subscribe((res: any) => {
      console.log('allbranch:', res);
      this.branchdata = res;
    });

    // Fetch vehicles
    this.api.VehicleData().subscribe((res: any) => {
      console.log('allvechicle:', res);
      this.allgetvechicle = res;
    });


  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // ✅ returns 'yyyy-MM-dd' format
  }
  
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.fromCityValue = res.branchId.city;

      // Filter city list and set values to forms
      this.filteredCityList = this.citydata.filter(
        (city: { cityName: any }) => city.cityName === this.fromCityValue
      );
      this.pfdata = res;
      this.form.patchValue({ fromCity: this.fromCityValue });
      // Trigger form change logic if needed
      this.onFromcitySelect({ target: { value: this.fromCityValue } });
        setTimeout(() => {
        // Update first select2
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).val(this.fromCityValue).trigger('change');
        $(this.selectElem.nativeElement).prop('disabled', true).trigger('change.select2')
      }, 0);
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
        this.form.patchValue({ pickUpBranch: selectedBranch });
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

  onTocitySelect(event: any) {
    console.log('Event triggered:', event);
    console.log('Selected City:', event.target.value);
    const cityName = event.target.value;
    if (cityName) {
      this.api.GetBranchbyCity(cityName).subscribe(
        (res: any) => {
          console.log('Branches for selected city:', res);

          this.tbcdata = res;
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    } else {
      this.tbcdata = [];
    }
  }


//









  memoReport() {
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      pickUpBranch: this.form.value.pickUpBranch,
      dropBranch: this.form.value.dropBranch,
      vehicalNumber: this.form.value.vehicalNumber,
    };
    this.fromDate = payload.fromDate;
    this.toDate = payload.toDate;
    console.log('All Parcel Booking Payload:', payload);
    this.api.DispatchedMemoReport(payload).subscribe({
      next: (response: any) => {
        console.log('All Parcel loaded successfully:', response);
        this.DispatchedData = response;
        this.DispatchedData = {
          ...response,
          cityWiseDetails: response.cityWiseDetails || [],
        };
        
        console.log('report:', this.DispatchedData);

        // Reset totals
        this.calculateTotals();
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again.');
      },
    });
  }



  // Method to calculate totals
  calculateTotals() {
    this.totalQty = 0;
    this.totalFreight = 0;
    this.totalHamali = 0;
    this.totalNetAmount = 0;

    if (this.DispatchedData?.data?.toPay?.length) {
      this.DispatchedData.data.toPay.forEach((item: any) => {
        const qty = item.packages?.[0]?.quantity || 0;
        const freight = item.serviceCharge || 0;
        const hamali = item.hamaliCharge || 0;
        const net = item.grandTotal || 0; // Use grandTotal as the net amount

        this.totalQty += qty;
        this.totalFreight += freight;
        this.totalHamali += hamali;
        this.totalNetAmount += net;
      });
    }
  }



  printReport() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin!.document.open();
      popupWin!.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              /* You can include more styles here as needed */
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
  
              h4, h6, p {
                margin: 4px 0;
              }
  
              .text-center {
                text-align: center;
              }
  
              .fw-bold {
                font-weight: bold;
              }
  
              .text-decoration-underline {
                text-decoration: underline;
              }
  
              .d-flex {
                display: flex;
                justify-content: space-between;
              }
  
              @media print {
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin!.document.close();
    }
  }
  

  // Import these


  
  
  downloadExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    const addSheet = (data: any[], sheetName: string) => {
      if (!data?.length) return;
      const sheetData = data.map((item: any, i: number) => ({
        No: i + 1,
        'LR No': item.lrNumber,
        'Vehicle': item.vehicalNumber,
        'Dispatch Date': item.loadingDate ? new Date(item.loadingDate).toLocaleDateString() : '',
        'To City': item.toCity,
        'Sender': item.senderName,
        'Receiver': item.receiverName,
        'Mobile No': item.senderMobile,
        'Qty': item.packages?.[0]?.quantity ?? 0,
        'Item Details': item.packages?.[0]?.packageType ?? '-',
        'Freight': item.serviceCharge ?? 0,
        'Hamali': item.hamaliCharge ?? 0,
        'Net Amount': sheetName === 'ToPay'
          ? item.grandTotal ?? 0
          : (item.grandTotal ?? 0) + (item.hamaliCharge ?? 0)
      }));
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };
  
    // Add each data sheet
    addSheet(this.DispatchedData?.data?.paid, 'Paid');
    addSheet(this.DispatchedData?.data?.credit, 'Credit');
    addSheet(this.DispatchedData?.data?.toPay, 'ToPay');
  
    // City-wise Summary Sheet
    if (this.DispatchedData?.cityWiseDetails?.length) {
      const cityData = this.DispatchedData.cityWiseDetails.map((item: any, i: number) => ({
        No: i + 1,
        'City Name': item.cityName,
        'Paid Qty': item.paidQty,
        'Paid Amount': item.paidAmount,
        'ToPay Qty': item.toPayQty,
        'ToPay Amount': item.toPayAmount,
        'CreditFor Qty': item.creditForQty,
        'CreditFor Amount': item.creditForAmount
      }));
      const citySheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cityData);
      XLSX.utils.book_append_sheet(wb, citySheet, 'CityWise');
    }
  
    // Generate Excel file
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `Dispatched_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
  

}
