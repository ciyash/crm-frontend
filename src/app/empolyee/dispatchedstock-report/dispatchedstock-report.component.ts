import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-dispatchedstock-report',
  templateUrl: './dispatchedstock-report.component.html',
  styleUrls: ['./dispatchedstock-report.component.scss'],
})
export class DispatchedstockReportComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
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
  pffffdata: any;
  profileData: any;
  paginatedData: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''], // default empty string
      toCity: [''],
      fromBranch: [''],
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
      $(this.selectElem2.nativeElement).val('').trigger('change'); // <-- empty string default
      $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
        const selectedToCity = event.params.data.id;
        this.form.patchValue({ toCity: selectedToCity });
        this.onTocitySelect({ target: { value: selectedToCity } });
      });

      // Drop Branch select2 init with empty default value
      $(this.droupbranch.nativeElement).select2();
      $(this.droupbranch.nativeElement).val('').trigger('change'); // <-- empty string default
      $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedDropBranch = event.params.data.id;
        this.form.patchValue({ dropBranch: selectedDropBranch });
        if (this.onDropBranchSelect) {
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
      this.pffffdata = res;

      console.log('profileData:', this.profileData);

      // Update form controls with profile data
      this.form.patchValue({
        fromCity: this.pfdata || '', // Set fromCity to the city from branchId
        fromBranch: this.ffdata?.branchUniqueId || '', // Set pickUpBranch to branchUniqueId
      });
    });
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

  DispatchReport() {
    this.payload = this.form.value;

    this.api.DispatchedReport(this.payload).subscribe({
      next: (res: any) => {
        // Check if API response contains a message
        if (res.message) {
          this.toast.success(res.message); // ✅ show success toast
        } else {
          this.toast.success('Report loaded successfully');
        }

        this.reportData = res.data || res; // Adjust if API returns directly or inside `data`
        this.totalPages = Math.ceil(this.reportData.length / this.pageSize);
        this.setPaginatedData();
      },
      error: (err) => {
        console.error('API Error:', err);

        // Extract message from error
        const errorMessage =
          err?.error?.message || 'Report loading failed. Please try again.';
        this.toast.error(errorMessage); // ✅ show error toast
      },
    });
  }

  setPaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.reportData.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.setPaginatedData();
  }

  exportToExcel(): void {
    if (!this.reportData || this.reportData.length === 0) return;

    // Header Info
    const headerInfo = [
      [`${this.pfdata?.companyName || ''}`],
      [
        `Address: ${this.pfdata?.location || ''} - ${
          this.pfdata?.branchId?.name || ''
        } | Phone No: ${this.pfdata?.phone || ''}`,
      ],
      ['Dispatched Stock Report'],
      [
        `From: ${this.formatDate(this.payload?.fromDate)} To: ${this.formatDate(
          this.payload?.toDate
        )}`,
      ],
      [`Print By: ${this.pfdata?.username || ''}`],
      [
        `Print Date: ${this.formatDate(this.today)} ${this.formatTime(
          this.today
        )}`,
      ],
      [],
    ];

    // Table Header
    const tableHeader = [
      [
        'No',
        'Voucher NO',
        'From City',
        'To City',
        'Loading Date',
        'Driver Name',
        'Vehicle No',
      ],
    ];

    // Full data (not paginated)
    const tableData = this.reportData.map((item: any, index: number) => [
      index + 1,
      item.vocherNoUnique,
      item.fromCity,
      item.toCity,
      this.formatDate(item.loadingDate),
      item.driverName,
      item.vehicalNumber,
    ]);

    const finalData = [...headerInfo, ...tableHeader, ...tableData];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dispatched Report');

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(
      blob,
      `Dispatched_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }

  // Utility functions
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  formatTime(date: string | Date): string {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
