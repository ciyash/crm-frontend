import { Component,OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { AdminService } from 'src/app/service/admin.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 
import {  ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-pendingdispacthedstock-report',
  templateUrl: './pendingdispacthedstock-report.component.html',
  styleUrls: ['./pendingdispacthedstock-report.component.scss']
})
export class PendingdispacthedstockReportComponent {

  
      @ViewChild('selectElem2') selectElem2!: ElementRef;
      @ViewChild('droupbranch') droupbranch!: ElementRef;
      @ViewChild('summaryTable', { static: false }) summaryTable!: ElementRef;
    @ViewChild('bookingsTable', { static: false }) bookingsTable!: ElementRef;
  
  
    reportData: any; // your summary + bookings data
    pfdata: any;     // your profile/company info
    totalamount: number = 0;
    
      cdata: any;
      grnNo: any;
      grnnumber: any;
      onPickupBranchSelect: any;
      onDropBranchSelect: any;
      form!:FormGroup;
      id:any;
      citydata:any;
      branchdata:any;   
      bookingSuccess: boolean = false;
      packdata:any;
      fbcdata:any;
      tbcdata:any;
      pdata:any;
      dptype:any;
    dispacthedReport: any;
    dispatchedReport: any;
   
  
    today=new Date()
  ffdata: any;
  profileData: any;
  pffffffdata: any;
    
      constructor(private fb: FormBuilder, private api: BranchService, private token:TokenService,
         private cdr: ChangeDetectorRef,  private route: ActivatedRoute,private toastr:ToastrService, 
         private router:Router, private admin:AdminService) {
        this.form = this.fb.group({
          fromDate: [this.getTodayDateString(), Validators.required],
          toDate: [this.getTodayDateString(), Validators.required],
          fromCity:  ['all',],
          toCity: ['all', ],
          pickUpBranch: ['all',],
            });
       }
    
      ngOnInit() {
        // const id = this.activate.snapshot.paramMap.get('id');
        this.api.GetCities().subscribe((res:any)=>{
          console.log('citys',res);
          this.citydata=res;
        });
        //get branches
        this.api.GetBranch().subscribe((res:any)=>{
          this.branchdata=res;
          
        });
        this.getProfileData()
      
  
      }
      getTodayDateString(): string {
        const today = new Date();
        const day = ('0' + today.getDate()).slice(-2);
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const year = today.getFullYear();
        return `${year}-${month}-${day}`; // ✔ HTML date input format
      }
      
  
  
      getProfileData() {
        this.api.GetProfileData().subscribe((res: any) => {
          console.log('profile', res);
          this.ffdata = res.branchId;
          this.pfdata = res.branchId.city;
          this.profileData = res;
          this.pffffffdata = res;
  
          console.log("profileData:", this.profileData);
      
          // Update form controls with profile data
          this.form.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
            pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
          });
            });
      }
      
      
     
      
      ngAfterViewInit(): void {
        setTimeout(() => {
          // Initialize Select2 for To City
          $(this.selectElem2.nativeElement).select2();
          $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
            const selectedToCity = event.params.data.id;
            console.log('Selected To City:', selectedToCity);
            this.form.patchValue({ toCity: selectedToCity });
            console.log('Updated form value:', this.form.value);
            this.onTocitySelect({ target: { value: selectedToCity } });
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
    
    DispatchedStockReport() {
      const payload = this.form.value;
      console.log("payload:", payload);
    
      this.api.PendingDispatchedStockReport(payload).subscribe({
        next: (res: any) => {
          this.reportData = res;
          this.calculateTotalAmount();
          console.log("report:", this.reportData);
        },
        error: (err: any) => {
          console.error("API Error:", err);
            const errorMessage = err?.error?.message || 'Failed to fetch report data';
          this.toastr.error(errorMessage, "Error");
        }
      });
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
  
  
  calculateTotalAmount() {
    this.totalamount = this.reportData.bookings?.reduce((sum: number, item: { amount: any; }) => sum + (Number(item.amount) || 0), 0) || 0;
  }
  
  
  
  
  
    
  
    downloadExcel(): void {
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
      // 1️⃣ Add Company Header Sheet
      const headerData = [
        ['Pending Dispatch Stock Report'],
        [this.pffffffdata?.companyName ?? ''],
        [`Address: ${this.pffffffdata?.location ?? ''} - ${this.pffffffdata?.branchId?.name ?? ''} | Phone No: ${this.pffffffdata?.phone ?? ''}`],
        [], // spacer row
      ];
      const headerSheet = XLSX.utils.aoa_to_sheet(headerData);
      XLSX.utils.book_append_sheet(wb, headerSheet, 'Report Info');
  
      // 2️⃣ Add Summary Table
      if (this.summaryTable) {
        const summarySheet = XLSX.utils.table_to_sheet(this.summaryTable.nativeElement);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
      }
  
      // 3️⃣ Add Bookings Table
      if (this.bookingsTable) {
        const bookingsSheet = XLSX.utils.table_to_sheet(this.bookingsTable.nativeElement);
        XLSX.utils.book_append_sheet(wb, bookingsSheet, 'Bookings');
      }
  
      // 4️⃣ Save Excel File
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, `Pending_Dispatch_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
  }
  
  
    
     
      
      
      
      
    
  