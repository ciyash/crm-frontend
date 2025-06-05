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
  
 
  
  
    // getProfileData() {
    //   this.api.GetProfileData().subscribe((res: any) => {
    //     console.log('profile', res);
    //     this.pfdata = res;
    //     console.log(this.pfdata, 'branchid');
    //     if (this.pfdata && this.pfdata.username) {
    //       this.form.patchValue({
    //         bookedBy: this.pfdata.username,
    //       });
    //     }
    //   });
    // }
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
      this.bdata = payload;
      this.fromDate = this.form.value.fromDate;
      this.toDate = this.form.value.toDate;
  
      this.api.ConsolidatedReport(payload).subscribe({
        next: (res: any) => {
          console.log('ConsolidatedReport:', res);
  
          this.Cdata = res; 
          this.Tdata=res
          console.log("tdata:",this.Tdata)
           
  
            this.deliveryData=res.data
          console.log("devliveryData:",this.deliveryData);
  
          // Assuming the data you expect is in res.data or similar field
          // if (res.data && res.data.length > 0) {
          //   this.toast.success(res.message || 'Report fetched successfully!');
          //   this.Cdata = res;
          //   this.deliveryData=res.data.deliveredAmountByType
          //   console.log("devliveryData:",this.deliveryData);
            
  
            
          // } else {
          //   // No data scenario
          //   this.toast.info('No data available for the given filter.');
          //   this.Cdata = []; // Clear previous data if any
          // }
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
        const popupWin = window.open(
          '',
          '_blank',
          'top=0,left=0,height=100%,width=auto'
        );
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
  
    downloadExcel(): void {
      const fileName = 'Consolidated_Report.xlsx';
  
      const wsData: any[][] = [];
  
      // Add company info
      wsData.push([this.pfdata?.companyName || '']);
      wsData.push([
        `Address: ${this.pfdata?.location} - ${this.pfdata?.branchId?.name} | Phone No: ${this.pfdata?.phone}`,
      ]);
      wsData.push([]);
      wsData.push(['Consolidated Report']);
      wsData.push([]);
  
      // Add date info
      const from = new Date(this.fromDate).toLocaleDateString('en-GB');
      const to = new Date(this.toDate).toLocaleDateString('en-GB');
      const today = new Date(this.today).toLocaleString('en-GB');
      wsData.push([`From: ${from}   To: ${to}`]);
      wsData.push([`Print Date: ${today}`]);
      wsData.push([]);
  
      // Add table headers
      wsData.push([
        '',
        '',
        'Booking',
        '',
        '',
        '',
        'Cancel Total',
        'Delivery',
        'GST',
        '',
      ]);
      wsData.push([
        'Sr No.',
        'Branch Name',
        'Paid',
        'ToPay',
        'Credit',
        'Total',
        'Total',
        'Total',
        'SGST',
        'IGST',
      ]);
  
      // Add table data
      this.Cdata?.data?.forEach((item: any, index: number) => {
        wsData.push([
          index + 1,
          item.branchName,
          item.paid,
          item.toPay,
          item.credit,
          item.bookingTotalAmount,
          item.cancelTotalAmount,
          item.deliveredTotalAmount,
          item.sgstAmount,
          item.igstAmount,
        ]);
      });
  
      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Consolidated Report': worksheet },
        SheetNames: ['Consolidated Report'],
      };
  
      // Write and save Excel file
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
  
