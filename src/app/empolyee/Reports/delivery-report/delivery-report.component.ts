import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
declare var $: any;
@Component({
  selector: 'app-delivery-report',
  templateUrl: './delivery-report.component.html',
  styleUrls: ['./delivery-report.component.scss']
})
export class DeliveryReportComponent {
    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
    onPickupBranchSelect: any;
    onDropBranchSelect: any;
      form!: FormGroup;
      reportData: any;
      citydata: any;
      branchdata: any;
      allgetvechicle: any;
      pfdata: any;
      today = new Date(); 
      payload: any;
    pdata: any;
    tbcdata: any;
    rdata: any;
    summmaryData: any;
    Bdata: any;
  ffdata: any;
  profileData: any;
  pffffffdata: any;
      constructor(private api: BranchService, private fb: FormBuilder,private router:Router,private toast:ToastrService) {
        this.form = this.fb.group({
          // fromDate: ['', Validators.required],
          // toDate: ['', Validators.required],
          fromDate: [this.getTodayDateString(), Validators.required],
          toDate: [this.getTodayDateString(), Validators.required],
          fromCity: [''],
          toCity: [''],
          pickUpBranch: [''],
          dropBranch: [''],
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
          this.branchdata = res;
          console.log('branchdata:', this.branchdata);
        });
  
    
        // Fetch vehicles
        this.api.VehicleData().subscribe((res: any) => {
          console.log('allvechicle:', res);
          this.allgetvechicle = res;
        });
        this.getProfileData();
      }
  
  
      // DeliveryReport() {
      //   this.payload = {
      //     fromDate: this.form.value.fromDate,
      //     toDate: this.form.value.toDate,
      //     fromCity: this.form.value.fromCity,
      //     toCity: this.form.value.toCity,
      //     pickUpBranch: this.form.value.pickUpBranch,
      //     dropBranch: this.form.value.dropBranch,
      //   };
      
      //   console.log("payload:", this.payload);
      
      //   // 🧹 Clear previous data before making the API call
      //   this.reportData = [];
      //   this.Bdata = null;
      
      //   this.api.DeliveryStockReport(this.payload).subscribe(
      //     (res: any) => {
             
      //     console.log("res:",res);
      //     this.reportData=res.deliveries
      //     this.summmaryData=res.summary
      //     this.Bdata=res.summary.bookingTypeSummary
  
      //     console.log("data:",this.reportData)
          
      //     const finalData = {
      //       ...this.reportData,
      //       fromDate: this.payload.fromDate,
      //       toDate: this.payload.toDate
      //     };
            
      
      //     },
      //     (error) => {
      //       console.error('API Error:', error);
      //       this.toast.warning('No stock found for the given criteria.');
           
      //     }
      //   );
      // }
      DeliveryReport() {
        this.payload = {
          fromDate: this.form.value.fromDate,
          toDate: this.form.value.toDate,
          fromCity: this.form.value.fromCity,
          toCity: this.form.value.toCity,
          pickUpBranch: this.form.value.pickUpBranch,
          dropBranch: this.form.value.dropBranch,
        };
      
        console.log("payload:", this.payload);
      
        this.reportData = [];
        this.Bdata = null;
      
        this.api.DeliveryStockReport(this.payload).subscribe(
          (res: any) => {
            console.log("res:", res);
      
            const data = res?.data;
      
            if (data) {
              this.reportData = data.deliveries || [];
              this.summmaryData = data.summary || {};
              this.Bdata = data.summary?.bookingTypeSummary || null;
              console.log("Deliveries:", this.reportData);
              console.log("Summary:", this.summmaryData);
            } else {
              this.toast.warning('No data received in response.');
            }
      
          },
          (error) => {
            console.error('API Error:', error);
            this.toast.warning('No stock found for the given criteria.');
            this.reportData = [];
            this.Bdata = null;
          }
        );
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
            toCity: this.pfdata || '', // Set fromCity to the city from branchId
            dropBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
          });
            });
      } 
      
    

  
      ngAfterViewInit(): void {
        setTimeout(() => {   
          // To City
          $(this.selectElem2.nativeElement).select2();
          $(this.selectElem2.nativeElement).val('all').trigger('change'); // ✅
          $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
            const selectedToCity = event.params.data.id;
            this.form.patchValue({ fromCity: selectedToCity });
            this.onTocitySelect({ target: { value: selectedToCity } });
          });
      
          // Drop Branch
          $(this.droupbranch.nativeElement).select2();
          $(this.droupbranch.nativeElement).val('all').trigger('change'); // ✅
          $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
            const selectedDropBranch = event.params.data.id;
            this.form.patchValue({ pickUpBranch: selectedDropBranch });
            this.onDropBranchSelect({ target: { value: selectedDropBranch } });
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
    
  
  exportToExcel(): void {
    const data: any[][] = [];
  
    // 1. Header Info
    data.push([`Company: ${this.pffffffdata?.companyName || ''}`]);
    data.push([`Address: ${this.pffffffdata?.location || ''} - ${this.pffffffdata?.branchId?.name || ''} | Phone No: ${this.pfdata?.phone || ''}`]);
    data.push([`Delivered Stock Report`]);
    data.push([
      `From: ${this.payload?.fromDate ? new Date(this.payload.fromDate).toLocaleDateString() : ''}`,
      `To: ${this.payload?.toDate ? new Date(this.payload.toDate).toLocaleDateString() : ''}`,
      `Print By: ${this.pffffffdata?.username || ''}`,
      `Print Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    ]);
    data.push([]); // empty row
  
    // 2. Table Header for Report Data
    data.push([
      'No',
      'LR No',
      'Source Subregion',
      'Received By',
      'Consigner',
      'Consignee',
      'Packages',
      'Parcel Item',
      'Pkgs',
      'Total Amount'
    ]);
  
    // 3. Report Data Rows
    this.reportData?.forEach((item: any, index: number) => {
      data.push([
        index + 1,
        item.WBNo,
        item.SourceSubregion,
        item.ReceivedBy,
        item.Consigner,
        item.Consignee,
        item.WBType,
        item.ParcelItem,
        item.Pkgs,
        item.Amount
      ]);
    });
  
    data.push([]); // space between tables
  
    // 4. WB Summary Table Headers
    data.push([
      'Sr. No',
      'WB Type',
      'Freight Amount',
      'GST',
      'Other Charges',
      'Net Amount'
    ]);
  
    // 5. WB Summary Data (Paid / ToPay)
    let rowIndex = 1;
    if (this.Bdata?.Paid) {
      data.push([
        rowIndex++,
        'Paid',
        this.Bdata.Paid.freight,
        this.Bdata.Paid.gst,
        this.Bdata.Paid.otherCharges,
        this.Bdata.Paid.netAmount
      ]);
    }
  
    if (this.Bdata?.ToPay) {
      data.push([
        rowIndex++,
        'ToPay',
        this.Bdata.ToPay.freight,
        this.Bdata.ToPay.gst,
        this.Bdata.ToPay.otherCharges,
        this.Bdata.ToPay.netAmount
      ]);
    }
  
    // 6. Grand Total Row
    if (this.summmaryData) {
      data.push([
        '',
        'TOTAL:',
        this.summmaryData.totalFreight,
        this.summmaryData.totalGST,
        this.summmaryData.totalOtherCharges,
        this.summmaryData.totalNetAmount
      ]);
    }
  
    // 7. Convert and export
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Delivered Report');
  
    XLSX.writeFile(wb, `Delivered_Report_${new Date().getTime()}.xlsx`);
  }
  
      
      
    }    
