import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-sub-pending-delivery-luggage',
  templateUrl: './sub-pending-delivery-luggage.component.html',
  styleUrls: ['./sub-pending-delivery-luggage.component.scss']
})
export class SubPendingDeliveryLuggageComponent {

    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('pickupbranch') pickupbranch!: ElementRef;
    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
    form: FormGroup;
    reportData: any;
    citydata: any;
    branchdata: any;
    allgetvechicle: any;
    pfdata: any;
    today = new Date(); 
    payload: any;
    onPickupBranchSelect: any;
    onDropBranchSelect: any;
    pdata: any;
    tbcdata: any;
  fromCityValue: any;
  filteredCityList: any;
  toCityValue: any;
  
  
    constructor(private api: BranchService, private fb: FormBuilder,private toast:ToastrService) {
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
      this.getProfileData();
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
    
      console.log("Payload:", this.payload);
    
      this.api.PendingDeliveryLuggageReport(this.payload).subscribe(
        (res: any) => {
          if (res?.data?.length) {
            this.reportData = res.data;
            console.log("report:",this.reportData);
            
            this.totalPages = Math.ceil(this.reportData.length / this.itemsPerPage);
            this.currentPage = 1;
            this.toast.success(res.message || 'Report fetched successfully.');
            console.log('Luggage Report:', this.reportData);
          } else {
            this.reportData = [];
            this.toast.warning(res.message || 'No records found.');
          }
        },
        (error) => {
          const errMsg = error?.error?.message || 'Something went wrong while fetching the report.';
          this.toast.error(errMsg);
          console.error('API Error:', error);
        }
      );
    }

    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.toCityValue = res.branchId.city;
        this.filteredCityList = this.citydata.filter(
          (city: { cityName: any }) => city.cityName === this.toCityValue
        )
        this.form.patchValue({ toCity: this.toCityValue });
  
        this.onFromcitySelect({ target: { value: this.toCityValue } });
          setTimeout(() => {
          $(this.selectElem.nativeElement).select2();
          $(this.selectElem.nativeElement).val(this.toCityValue).trigger('change');
          $(this.selectElem.nativeElement).prop('disabled', true).trigger('change.select2')
        }, 0);
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
  ngAfterViewInit(): void {
    setTimeout(() => {
      // From City
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).val('all').trigger('change'); // ✅ force default
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.patchValue({ toCity: selectedCity });
        this.onFromcitySelect({ target: { value: selectedCity } });
      });
  
      // Pickup Branch
      $(this.droupbranch.nativeElement).select2();
      $(this.droupbranch.nativeElement).val('all').trigger('change'); // ✅
      $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedDropBranch = event.params.data.id;
        this.form.patchValue({ pickUpBranch: selectedDropBranch });
        this.onPickupBranchSelect({ target: { value: selectedDropBranch } });
      });
  
      // To City
      $(this.selectElem2.nativeElement).select2();
      $(this.selectElem2.nativeElement).val('all').trigger('change'); // ✅
      $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
        const selectedToCity = event.params.data.id;
        this.form.patchValue({ fromCity: selectedToCity });
        this.onTocitySelect({ target: { value: selectedToCity } });
      });
  
      // Drop Branch
      $(this.pickupbranch.nativeElement).select2();
      $(this.pickupbranch.nativeElement).val('all').trigger('change'); // ✅
      $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form.patchValue({ dropBranch: selectedBranch });
        this.onDropBranchSelect({ target: { value: selectedBranch } });
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
  
  
  
  
  
  
      readonly EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    
      exportToExcel(): void {
        const headerRows: any[][] = [];
    
        // Add company details
        if (this.pfdata) {
          headerRows.push([this.pfdata.companyName]);
          headerRows.push([
            `Address: ${this.pfdata.location} - ${this.pfdata.branchId?.name} | Phone No: ${this.pfdata.phone}`
          ]);
        }
    
        headerRows.push(['Pending Delivery Luggage Report']);
        headerRows.push([
          `From: ${this.formatDate(this.payload?.fromDate)} To: ${this.formatDate(this.payload?.toDate)}`,
          `Print By: ${this.pfdata?.username || ''}`,
          `Print Date: ${this.formatDate(this.today)} ${this.formatTime(this.today)}`
        ]);
        headerRows.push([]); // empty row
    
        // Add table headers
        headerRows.push([
          'No',
          'GRN No',
          'Receiver Date',
          'Source',
          'Destination',
          'Consignor',
          'Consignee',
          'Consignee No',
          'Booking Type',
          'Day Diff.',
          'Item Name',
          'Manual TKT No.',
          'Quantity',
          'Amount'
        ]);
    
        // Add table data
        const dataRows = this.reportData.map((item: { grnNo: any; receiverDate: any; source: any; destination: any; consignor: any; consignee: any; consigneeNo: any; bookingType: any; dayDiff: any; itemName: any; manualTKTNo: any; quantity: any; amount: any; }, index: number) => [
          index + 1,
          item.grnNo,
          item.receiverDate,
          item.source,
          item.destination,
          item.consignor,
          item.consignee,
          item.consigneeNo,
          item.bookingType,
          item.dayDiff,
          item.itemName,
          item.manualTKTNo,
          item.quantity,
          item.amount
        ]);
    
        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Pending Delivery Report': worksheet },
          SheetNames: ['Pending Delivery Report']
        };
    
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const fileName = `Pending_Delivery_Report_${this.formatDate(this.today)}.xlsx`;
        const data: Blob = new Blob([excelBuffer], { type: this.EXCEL_TYPE });
        FileSaver.saveAs(data, fileName);
      }
    
      formatDate(date: any): string {
        const d = new Date(date);
        return `${('0' + d.getDate()).slice(-2)}-${('0' + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()}`;
      }
    
      formatTime(date: any): string {
        const d = new Date(date);
        let hours = d.getHours();
        const minutes = ('0' + d.getMinutes()).slice(-2);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      }
  
  }
  
   
    
  
  
    
  
    
    
  
  