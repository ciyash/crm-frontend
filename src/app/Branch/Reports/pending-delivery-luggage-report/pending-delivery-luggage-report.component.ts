import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-pending-delivery-luggage-report',
  templateUrl: './pending-delivery-luggage-report.component.html',
  styleUrls: ['./pending-delivery-luggage-report.component.scss']
})
export class PendingDeliveryLuggageReportComponent {
  @ViewChild('summaryfromcity') summaryfromcity!: ElementRef;
  @ViewChild('summarytocity') summarytocity!: ElementRef;
  @ViewChild('summarypickup') summarypickup!: ElementRef;
  @ViewChild('summarydroup') summarydroup!: ElementRef;
  form!: FormGroup;
  reportData: any;
  citydata: any;
  branchdata: any;
  allgetvechicle: any;
  pfdata: any;
  today = new Date(); 
  payload: any;
// /

  constructor(private api: BranchService, private fb: FormBuilder) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      pickUpBranch: [''],
      dropBranch: [''],
      bookingType: ['']
    });
  }

  getTodayDateString(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // ✔ HTML date input format
  }
  

  ngOnInit() {
    // Fetch cities
    this.api.GetCities().subscribe((res: any) => {
      console.log('citydata', res);
      this.citydata = res;
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
    this.getProfileData();
  }
  ngAfterViewInit(): void {
    // Initialize Select2 for dropdowns as you already have
    setTimeout(() => {
      const initializeSelect2 = (
        element: ElementRef,
        form: FormGroup,
        controlName: string
      ) => {
        $(element.nativeElement).select2();
        $(element.nativeElement).on('select2:select', (event: any) => {
          const value = event.params.data.id;
          form.patchValue({ [controlName]: value });
  
          // New logic here:
          if (controlName === 'fromCity') {
            this.setPickupBranchForCity(value);
          }
          if (controlName === 'toCity') {
            this.setDropBranchForCity(value);
          }
        });
      };
  
      initializeSelect2(this.summaryfromcity, this.form, 'fromCity');
      initializeSelect2(this.summarytocity, this.form, 'toCity');
      initializeSelect2(this.summarypickup, this.form, 'pickUpBranch');
      initializeSelect2(this.summarydroup, this.form, 'dropBranch');
    });
  }
  
  // Filter branches by city id and set pickup branch
  setPickupBranchForCity(cityId: string) {
    const matchingBranches = this.branchdata.filter(
      (branch: any) => branch.cityId === cityId
    );
    if (matchingBranches.length > 0) {
      this.form.patchValue({ pickUpBranch: matchingBranches[0].id });
      // Also update the Select2 UI
      $(this.summarypickup.nativeElement).val(matchingBranches[0].id).trigger('change');
    } else {
      this.form.patchValue({ pickUpBranch: '' });
      $(this.summarypickup.nativeElement).val(null).trigger('change');
    }
  }
  
  // Filter branches by city id and set drop branch
  setDropBranchForCity(cityId: string) {
    const matchingBranches = this.branchdata.filter(
      (branch: any) => branch.cityId === cityId
    );
    if (matchingBranches.length > 0) {
      this.form.patchValue({ dropBranch: matchingBranches[0].id });
      // Also update the Select2 UI
      $(this.summarydroup.nativeElement).val(matchingBranches[0].id).trigger('change');
    } else {
      this.form.patchValue({ dropBranch: '' });
      $(this.summarydroup.nativeElement).val(null).trigger('change');
    }
  }
  


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
      bookingType: this.form.value.bookingType
    };
    console.log("payload:",this.payload);

    this.api.PendingDeliveryLuggageReport(this.payload).subscribe(
      (res: any) => {
        this.reportData = res.data;
        this.totalPages = Math.ceil(this.reportData.length / this.itemsPerPage);
        this.currentPage = 1; // reset to first page
        console.log('Luggage Report:', this.reportData);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
    
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('profiledata:', this.pfdata);
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


}