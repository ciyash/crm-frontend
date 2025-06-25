import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
declare module 'file-saver';
declare var $: any;
declare const SlimSelect: any;
@Component({
  selector: 'app-conslidated-report',
  templateUrl: './conslidated-report.component.html',
  styleUrls: ['./conslidated-report.component.scss']
})
export class ConslidatedReportComponent {

    BranchSelect: any;
    form: FormGroup;
    citydata: any;
    branchdata: any;
    pfdata: any;
    Cdata: any;
    bdata: any;
    tbcdata: any;
    cities: any;
    today = new Date();
    fromDate: any;
    toDate: any;
    deliveryData: any;
    Tdata: any;
  profileData: any;
  ffdata: any;
    constructor(
      private fb: FormBuilder,
      private api: BranchService,
      private toast: ToastrService
    ) {
      this.form = this.fb.group({
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: [''],
        pickUpBranch: [''],
        // bookedBy: [''],
        displayBookingDetails: [false],
        branchSummary: [false],
      });
    }
  
    ngOnInit() {
      this.getCities();
      this.getProfileData();
    }
    getCities() {
      this.api.GetCities().subscribe({
        next: (response: any) => {
          console.log('Cities data:', response);
          this.cities = response;
        },
        error: (error: any) => {
          console.error('Error fetching cities:', error);
        },
      });
    }
  
    getTodayDateString(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const day = ('0' + today.getDate()).slice(-2);
      return `${year}-${month}-${day}`; // Correct format for input[type="date"]
    }
  
    onToCityChange(event: any) {
      const selectedOptions = Array.from(event.target.selectedOptions).map(
        (option: any) => option.value
      );
  
      const toCityArray = this.form.get('toCity') as FormArray;
      toCityArray.clear(); // ✅ Clear old values before updating
  
      selectedOptions.forEach((city) => toCityArray.push(new FormControl(city)));
  
      console.log('Selected To Cities:', toCityArray.value);
    }
  
 
  
  
  
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        console.log('profile', res);

    
        if (res && res.username && res.branchId) {
          this.profileData = res;

          this.pfdata = res.username;
          this.ffdata = res.branchId;
          this.citydata = res.branchId.city;
          this.pfdata = res;

    
          this.form.patchValue({
            bookedBy: res.username,
            fromCity: res.branchId.city || '',
            pickUpBranch: res.branchId.branchUniqueId || ''
          });
    
          console.log("profileData:", this.profileData);
   
        }
      });
    }

    getCollectionReport() {
      const payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        fromCity: this.form.value.fromCity,
        pickUpBranch: this.form.value.pickUpBranch,
        bookedBy: this.form.value.bookedBy,
      };
    
      console.log('payload:', payload);
    
      // 👇 Store in component-level variables for display
      this.fromDate = payload.fromDate;
      this.toDate = payload.toDate;
    
      this.api.ConsolidatedReport(payload).subscribe({
        next: (res: any) => {
          console.log('ConsolidatedReport:', res);
    
          this.Cdata = res.data || []; // data for table rows
          this.Tdata = res || {};      // totals
          this.deliveryData = res.data || [];
    
          console.log("Cdata:", this.Cdata);
          console.log("Totals:", this.Tdata);
        },
        error: (err) => {
          this.toast.error('Failed to fetch report.');
          console.error(err);
        },
      });
    }

    
    get showFilter(): boolean {
      return (
        this.form.get('displayBookingDetails')?.value ||
        this.form.get('branchSummary')?.value
      );
    }
  
    printReport() {
      const printContents = document.getElementById('print-section')?.innerHTML;
      if (printContents) {
        const popupWin = window.open('', '_blank', 'width=1000,height=800');
        popupWin?.document.open();
        popupWin?.document.write(`
          <html>
            <head>
              <title>Print Report</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 6px;
                  text-align: center;
                  font-size: 13px;
                }
                th {
                  background-color: #f2f2f2;
                }
                .text-end {
                  text-align: right;
                }
                .fw-bold {
                  font-weight: bold;
                }
                .text-center {
                  text-align: center;
                }
              </style>
            </head>
            <body onload="window.print(); window.close()">
              ${printContents}
            </body>
          </html>
        `);
        popupWin?.document.close();
      }
    }
    



  
    downloadExcel(): void {
      const fileName = 'Consolidated_Report.xlsx';
      const wsData: any[][] = [];
    
      // Company Info
      wsData.push([this.pfdata?.companyName || '']);
      wsData.push([
        `Address: ${this.pfdata?.location} - ${this.pfdata?.branchId?.name} | Phone No: ${this.pfdata?.phone}`,
      ]);
      wsData.push([]);
      wsData.push(['Consolidated Report']);
      wsData.push([]);
    
      // Date Info
      const from = new Date(this.fromDate).toLocaleDateString('en-GB');
      const to = new Date(this.toDate).toLocaleDateString('en-GB');
      const today = new Date(this.today).toLocaleString('en-GB');
    
      wsData.push([`From: ${from}   To: ${to}`]);
      wsData.push([`Print Date: ${today}`]);
      wsData.push([`Print By: ${this.pfdata?.name || ''}`]);
      wsData.push([]);
    
      // Group headers
      wsData.push([
        '',
        '',
        'Booking',
        '',
        '',
        '',
        'Cancel',
        'Delivery',
        '',
        'GST',
        '',
        '',
        '',
      ]);
    
      // Column headers
      wsData.push([
        'Sr No.',
        'Branch Name',
        'Paid',
        'ToPay',
        'Credit',
        'Total',
        'Cancel',
        'Delivered',
        'BookingTotal',
        'CGST',
        'SGST',
        'IGST',
        'Parcel GST',
      ]);
    
      // Table rows
      this.Cdata.forEach((item: any, index: number) => {
        wsData.push([
          index + 1,
          item.branchName,
          item.paidAmount || 0,
          item.toPayAmount || 0,
          item.creditAmount || 0,
          item.total || 0,
          item.cancelAmount || 0,
          item.deliveryAmount || 0,
          item.bookingTotal || 0,
          item.cgstAmount || 0,
          item.sgstAmount || 0,
          item.igstAmount || 0,
          item.parcelGstAmount || 0,
        ]);
      });
    
      // Grand total row
      wsData.push([]);
      wsData.push([
        '',
        'Total',
        this.Tdata.finalPaidAmount || 0,
        this.Tdata.finalToPayAmount || 0,
        this.Tdata.finalCreditAmount || 0,
        this.Tdata.finalTotal || 0,
        this.Tdata.finalCancelAmount || 0,
        this.Tdata.finalDeliveryAmount || 0,
        this.Tdata.finalBookingTotal || 0,
        this.Tdata.totalCgst || 0,
        this.Tdata.totalSgst || 0,
        this.Tdata.totalIgst || 0,
        this.Tdata.finalParcelGstAmount || 0,
      ]);
    
      // Create worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Consolidated Report': worksheet },
        SheetNames: ['Consolidated Report'],
      };
    
      // Export to Excel
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      FileSaver.saveAs(blob, fileName);
    }
  }
  
