
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-receivedstock-report',
  templateUrl: './receivedstock-report.component.html',
  styleUrls: ['./receivedstock-report.component.scss']
})
export class ReceivedstockReportComponent { 

    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
  
    form!: FormGroup;
    reportData: any;
    citydata: any;
    branchdata: any;
    allgetvechicle: any;
    pfdata: any;
    today = new Date(); 
    payload: any;
    tbcdata: any;
    onDropBranchSelect: any;
    onPickupBranchSelect: any;
    pdata: any;
  ffdata: any;
  profileData: any;
  pffffffdata: any;
  
    constructor(
      private api: BranchService, 
      private fb: FormBuilder,
      private router: Router,
      private toast: ToastrService
    ) {
      this.form = this.fb.group({
        fromDate: [this.getTodayDateString(), Validators.required],
        toDate: [this.getTodayDateString(), Validators.required],
        fromCity: [''],       // default empty string
        toCity: [''],
        dropBranch: [''],
        pickUpBranch: [''],
        receiverName: [''],
      });
    }
  
    getTodayDateString(): string {
      const today = new Date();
      const day = ('0' + today.getDate()).slice(-2);
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const year = today.getFullYear();
      return `${year}-${month}-${day}`;
    }
  
    ngOnInit() {
      this.api.GetCities().subscribe((res: any) => {
        this.citydata = res;
      });
  
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
      });
  
      this.api.VehicleData().subscribe((res: any) => {
        this.allgetvechicle = res;
      });
  
      this.getProfileData();
    }
  
    onFromcitySelect(event: any) {
      const cityName = event.target.value;
      if (cityName) {
        this.api.GetBranchbyCity(cityName).subscribe(
          (res: any) => {
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
      const cityName = event.target.value;
      if (cityName) {
        this.api.GetBranchbyCity(cityName).subscribe(
          (res: any) => {
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
  
    ngAfterViewInit(): void {
      setTimeout(() => {
        // To City select2 init with empty default value
        $(this.selectElem2.nativeElement).select2();
        $(this.selectElem2.nativeElement).val('').trigger('change');  // <-- empty string default
        $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
          const selectedToCity = event.params.data.id;
          this.form.patchValue({ toCity: selectedToCity });
          this.onTocitySelect({ target: { value: selectedToCity } });
        });
  
        // Drop Branch select2 init with empty default value
        $(this.droupbranch.nativeElement).select2();
        $(this.droupbranch.nativeElement).val('').trigger('change');  // <-- empty string default
        $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
          const selectedDropBranch = event.params.data.id;
          this.form.patchValue({ dropBranch: selectedDropBranch });
          if(this.onDropBranchSelect) {
            this.onDropBranchSelect({ target: { value: selectedDropBranch } });
          }
        });
      }, 0);
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
  
    // Other methods unchanged...
    itemsPerPage = 10;
    currentPage = 1;
    totalPages = 1;
  
    pagedData() {
      if (!this.reportData) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.reportData.slice(start, end);
    }
  
    changePage(page: number) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    }
  
    totalPagesArray() {
      return Array(this.totalPages).fill(0);
    }
  
    LuaggageReport() {
      this.payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        pickUpBranch: this.form.value.pickUpBranch,
        dropBranch: this.form.value.dropBranch,
        receiverName: this.form.value.receiverName
      };
  console.log("paload:",this.payload);
  
      this.api.ParcelReceivedStockReport(this.payload).subscribe({
        next: (res: any) => {
          this.reportData = res.data;
          this.totalPages = Math.ceil(this.reportData.length / this.itemsPerPage);
          this.currentPage = 1;
  
          if (res.message) {
            this.toast.success(res.message, 'Success');
          } else {
            this.toast.success('Report loaded successfully', 'Success');
          }
        },
        error: (error: any) => {
          if (error.error && error.error.message) {
            this.toast.error(error.error.message, 'Error');
          } else {
            this.toast.error('Failed to load report', 'Error');
          }
  
          // Refresh current route to reset form or state if needed
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
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
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th, td { border: 1px solid #000; padding: 4px; text-align: center; }
                h4, h6, p { margin: 4px 0; }
                .text-center { text-align: center; }
                .fw-bold { font-weight: bold; }
                .text-decoration-underline { text-decoration: underline; }
                .d-flex { display: flex; justify-content: space-between; }
                @media print { .no-print { display: none; } }
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
  
    exportToExcel(): void {
      if (!this.reportData || this.reportData.length === 0) {
        alert('No data to export');
        return;
      }
    
      // Header info rows
      const headerRows = [
        [this.pfdata?.companyName || '', '', '', '', '', '', '', ''],
        [`Address: ${this.pfdata?.location || ''} - ${this.pfdata?.branchId?.name || ''}`, '', '', '', '', '', '', ''],
        [`Phone No: ${this.pfdata?.phone || ''}`, '', '', '', '', '', '', ''],
        [],
        ['Parcel Received Stock Report'],
        [],
        [
          `From: ${this.payload?.fromDate ? new Date(this.payload.fromDate).toLocaleDateString() : ''} To: ${this.payload?.toDate ? new Date(this.payload.toDate).toLocaleDateString() : ''}`,
          this.pfdata ? `Print By: ${this.pfdata.username}` : '',
          '',
          '',
          '',
          '',
          '',
          `Print Date: ${new Date().toLocaleString()}`
        ],
        [],
      ];
    
      // Table headers
      const tableHeader = [
        'No', 'GRN No', 'Unloading Date', 'Sender', 'Receiver', 'Type', 'Packages', 'Total Amount'
      ];
    
      // Data rows
      const dataRows = this.reportData.map((item: any, index: number) => [
        (this.currentPage - 1) * this.itemsPerPage + index + 1,
        item.grnNo,
        new Date(item.unloadingDate).toLocaleDateString(),
        item.senderName,
        item.receiverName,
        item.bookingType,
        item.totalPackages,
        item.grandTotal,
      ]);
    
      // Combine rows
      const worksheetData = [...headerRows, tableHeader, ...dataRows];
    
      // Create worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
      // Set column widths (optional)
      worksheet['!cols'] = [
        { wch: 5 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 15 },
      ];
    
      // Create workbook
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Parcel Report': worksheet },
        SheetNames: ['Parcel Report'],
      };
    
      // Write workbook to buffer
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
      // Save file
      this.saveAsExcelFile(excelBuffer, `Parcel_Stock_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
    
    saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
      FileSaver.saveAs(data, fileName);
    }
    
    
  }
  
