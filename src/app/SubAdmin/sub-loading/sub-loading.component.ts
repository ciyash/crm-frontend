import {  OnInit,AfterViewInit, Component, ElementRef, ViewChild  } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 
@Component({
  selector: 'app-sub-loading',
  templateUrl: './sub-loading.component.html',
  styleUrls: ['./sub-loading.component.scss']
})
export class SubLoadingComponent {
    adminData: any;
    parcelloadingData:any
    form!: FormGroup;
    form1:FormGroup;
    cities:any;
    vehicle: any = {}; 
    branchdata:any;
    data:any;
    searchTerm: string = '';       // For binding with input field
    idselectmsg: string = '';
    errorMessage: string = '';
    data2:any;
    data1:any;
    LoadSuccess: boolean = false;
    allSelected: boolean = true;
    qrdata: string = '';
    showScanner: boolean = false;
    tbcdata:any;
     @ViewChild('selectElem') selectElem!: ElementRef;
     @ViewChild('branchselect') branchselect!: ElementRef;
     @ViewChild('SelectVechicle')SelectVechicle!:ElementRef;
    @ViewChild('demoSelect') demoSelect!: ElementRef;
    @ViewChild('printTable') printTable!: ElementRef;
    @ViewChild('printParcelTable') printParcelTable!: ElementRef;

  
    BranchSelect: any;
    pfdata: any;
  fromCityValue: any;
  filteredCityList: any;
  citydata: any;
  onPickupBranchSelect: any;
    
  
    constructor(private api: BranchService, private token:TokenService,
       private fb: FormBuilder, private messageService:MessageService,
        private router:Router, private activeroute:ActivatedRoute,private toast:ToastrService) {
        this.form = this.fb.group({
          startDate: [this.getTodayDateString(), Validators.required],
          endDate: [this.getTodayDateString(), Validators.required],
          fromCity: ['',Validators.required],               
          toCity: this.fb.array([]),     
          pickUpBranch: ['',], 
        });
  
        this.form1 = this.fb.group({
          loadingType: ['offload'],
          fromBranch: ['', ],
          toBranch: ['',],
          vehicalNumber: ['', Validators.required],
          driverName: ['', [Validators.required, Validators.minLength(3)]],
          // driverNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
          driverNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

          fromBookingDate: ['',],
          toBookingDate: ['', ],
          fromCity:[''],
          // userName:['Test'],
          senderName:['',],
          toCity: this.fb.array([], ),
          grnNo: this.fb.array([], ),
          lrNumber: this.fb.array([], ),
        });
  
      
    }
    ngOnInit() {
      this.searchTerm = this.activeroute.snapshot.params['grnNo'];
      this.adminData = this.token.getToken();
      console.log('Admin Data:', this.adminData);
      this.getCities();
      this. getVehicleData();
      this.branchData();
      this.getProfileData();
    }

    onlyNumber(event: KeyboardEvent) {
      const charCode = event.key;
      if (!/^\d$/.test(charCode)) {
        event.preventDefault();
      }
    }
    
  
    getTodayDateString(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const day = ('0' + today.getDate()).slice(-2);
      return `${year}-${month}-${day}`; // yyyy-MM-dd
    }
    
    getCities() {
      this.api.GetCities().subscribe({
        next: (response: any) => {
          console.log('Cities data:', response);
          this.cities = response; 
          this.getProfileData(); // Call after cities are ready

        },
        error: (error: any) => {
          console.error('Error fetching cities:', error);
          this.toast.error('Failed to fetch cities data.', 'Error');
  
        },
      });
  
    }
  
   onToCityChange(event: any) {
    const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
  
    const toCityArray = this.form.get('toCity') as FormArray;
    toCityArray.clear(); // ✅ Clear old values before updating
  
    selectedOptions.forEach(city => toCityArray.push(new FormControl(city)));
  
    console.log('Selected To Cities:', toCityArray.value);
  }
  
  
  // onLoad() {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched(); // Trigger all validations
  //     return;
  //   }
  //   const today = this.getTodayDateString();
  //   const formValues = this.form.value;
    
  //   const payload: any = {
  //     startDate: formValues.startDate || today,
  //     endDate: formValues.startDate || today
  //   };
  
  //   if (formValues.fromCity) {
  //     payload.fromCity = formValues.fromCity;
  //   }
  
  //   if (formValues.toCity && formValues.toCity.length > 0) {
  //     payload.toCity = formValues.toCity;
  //   }
  
  //   if (formValues.pickUpBranch) {
  //     payload.pickUpBranch = formValues.pickUpBranch;
  //   }
  
  //   console.log('Final Parcel Load Data:', payload);
  
  //   this.api.FilterParcelLoading(payload).subscribe({
  //     next: (response: any) => {
  //       this.toast.success('Parcel Load successful', 'Success');
  //       console.log("data:", response);
  //       this.data = response || [];
  
  //       this.LoadSuccess = true;
  
  //       if (this.data.length > 0) {
  //         this.form1.patchValue({
  //           fromBranch: this.data[0].pickUpBranch,
  //           toBranch: this.data[0].dropBranch,
  //           fromBookingDate: this.form.value.startDate,
  //           toBookingDate: this.form.value.endDate,
  //           fromCity: this.form.value.fromCity,
  //           senderName: this.data[0]?.senderName || ''
  //         });
  
  //         this.setFormArray('toCity', this.data.map((d: any) => d.toCity));
  //         this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
  //         this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Parcel Load Error:', error);
  
  //       const errorMessage = error?.error?.message || error?.message || 'An error occurred during parcel load.';
  
  //       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //         this.router.navigate(['/sub-loading']);
  //         this.toast.error(errorMessage, "Parcel Load Failed");
  //       });
  //     }
  //   });
  // }
  //   setFormArray(controlName: string, values: any[]) {
  //     const formArray = this.form1.get(controlName) as FormArray;
  //     formArray.clear(); // ✅ Clear previous values
  //     values.forEach(value => {
  //       formArray.push(this.fb.control(value));
  //     });
  //   }
  
  //   onGrnNoChange(event: any, grnNo: string) {
  //     const formArray = this.form1.get('grnNo') as FormArray;
  //     if (event.target.checked) {
  //       // Add if not already selected
  //       if (!formArray.value.includes(grnNo)) {
  //         formArray.push(this.fb.control(grnNo));
  //       }
  //     } else {
  //       // Remove if unchecked
  //       const index = formArray.value.indexOf(grnNo);
  //       if (index > -1) {
  //         formArray.removeAt(index);
  //       }
  //     }
    
  //     // ✅ Update "Select All" status based on selected values
  //     this.allSelected = this.data.length === formArray.value.length;
  //     console.log('Selected GRN Numbers:', formArray.value);
  //   }
    
  //   onSelectAllChange(event: any) {
  //     const formArray = this.form1.get('grnNo') as FormArray;
  //     if (event.target.checked) {
  //       // ✅ Select all if checked
  //       this.data.forEach((row:any) => {
  //         if (!formArray.value.includes(row.grnNo)) {
  //           formArray.push(this.fb.control(row.grnNo));
  //         }
  //       });
  //     } else {
  //       // ✅ Deselect all if unchecked
  //       formArray.clear();
  //     }
  //     // ✅ Update "Select All" status
  //     this.allSelected = event.target.checked;
  //     console.log('All GRN Numbers Selected:', formArray.value);
  //   }


  onLoad() {
  if (this.form.invalid) {
    this.form.markAllAsTouched(); // Trigger all validations
    return;
  }

  const formValues = this.form.value;

  const payload: any = {
    startDate: formValues.startDate,
    endDate: formValues.endDate ,
  };

  if (formValues.fromCity) {
    payload.fromCity = formValues.fromCity;
  }

  if (formValues.toCity && formValues.toCity.length > 0) {
    payload.toCity = formValues.toCity;
  }

  if (formValues.pickUpBranch) {
    payload.pickUpBranch = formValues.pickUpBranch;
  }

  console.log('Final Parcel Load Data:', payload);

  this.api.FilterParcelLoading(payload).subscribe({
    next: (response: any) => {
      this.toast.success('Parcel Load successful', 'Success');
      console.log("data:", response);
      this.data = response || [];

      this.LoadSuccess = true;

      if (this.data.length > 0) {
        this.form1.patchValue({
          fromBranch: this.data[0].pickUpBranch,
          toBranch: this.data[0].dropBranch,
          fromBookingDate: this.form.value.startDate,
          toBookingDate: this.form.value.endDate,
          fromCity: this.form.value.fromCity,
          senderName: this.data[0]?.senderName || ''
        });

        this.setFormArray('toCity', this.data.map((d: any) => d.toCity));
        // ❌ Do not set grnNo here to avoid auto-selection
        this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
      }

      // Clear previously selected GRNs on new load
      const grnArray = this.form1.get('grnNo') as FormArray;
      grnArray.clear();
      this.allSelected = false;
    },
    error: (error: any) => {
      console.error('Parcel Load Error:', error);

      const errorMessage = error?.error?.message || error?.message || 'An error occurred during parcel load.';

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/sub-loading']);
        this.toast.error(errorMessage, "Parcel Load Failed");
      });
    }
  });
}

setFormArray(controlName: string, values: any[]) {
  const formArray = this.form1.get(controlName) as FormArray;
  formArray.clear();
  values.forEach(value => {
    formArray.push(this.fb.control(value));
  });
}

onGrnNoChange(event: any, grnNo: string) {
  const formArray = this.form1.get('grnNo') as FormArray;
  if (event.target.checked) {
    if (!formArray.value.includes(grnNo)) {
      formArray.push(this.fb.control(grnNo));
    }
  } else {
    const index = formArray.value.indexOf(grnNo);
    if (index > -1) {
      formArray.removeAt(index);
    }
  }

  this.allSelected = this.data.length > 0 && formArray.value.length === this.data.length;
  console.log('Selected GRN Numbers:', formArray.value);
}

onSelectAllChange(event: any) {
  const formArray = this.form1.get('grnNo') as FormArray;
  if (event.target.checked) {
    this.data.forEach((row: any) => {
      if (!formArray.value.includes(row.grnNo)) {
        formArray.push(this.fb.control(row.grnNo));
      }
    });
  } else {
    formArray.clear();
  }
  this.allSelected = event.target.checked;
  console.log('All GRN Numbers Selected:', formArray.value);
}




    ngAfterViewInit(): void {
      // Initialize SlimSelect
      new SlimSelect({
        select: this.demoSelect.nativeElement
      });
      setTimeout(() => {
        // Initialize select2 for From City
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
          const selectedCity = event.params.data.id;
          console.log('Selected City:', selectedCity);
          this.form.patchValue({ fromCity: selectedCity });
          console.log('Updated form value:', this.form.value);
          this.onFromcitySelect({ target: { value: selectedCity } });
        });
    
        // Initialize Select2 for Pickup Branch
        $(this.branchselect.nativeElement).select2();
        $(this.branchselect.nativeElement).on('select2:select', (event: any) => {
          const selectedBranch = event.params.data.id;
          console.log('Selected Pickup Branch:', selectedBranch);
          this.form.patchValue({ pickUpBranch: selectedBranch });
          console.log('Updated form value:', this.form.value);
          this.onPickupBranchSelect({ target: { value: selectedBranch } });
        });

        
      
        // Initialize select2 for Vehicle Number
        $(this.SelectVechicle.nativeElement).select2();
        $(this.SelectVechicle.nativeElement).on('select2:select', (event: any) => {
          const selectedVehicle = event.params.data.id;
          this.form1.patchValue({ vehicalNumber: selectedVehicle });
          this.form1.get('vehicalNumber')?.markAsTouched();  // ensure validation triggers
        });
        
      }, 0);

    }
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.fromCityValue = res.branchId.city; // Example: Hyderabad
    
        // Filter only one matching city
        this.filteredCityList = this.cities.filter(
          (city: { cityName: string }) =>
            city.cityName?.trim().toLowerCase() === this.fromCityValue?.trim().toLowerCase()
        );
    
        // Patch form
        this.form.patchValue({ fromCity: this.fromCityValue });
    
        // Call FromCity logic
        this.onFromcitySelect({ target: { value: this.fromCityValue } });
    
        // Re-initialize Select2 and disable
        setTimeout(() => {
          const select2Ref = $(this.selectElem.nativeElement);
          select2Ref.select2('destroy');
          select2Ref.select2();
          select2Ref.val(this.fromCityValue).trigger('change.select2');
          select2Ref.prop('disabled', true); // Disable select
        }, 0);
      });
    }
    openScanner() {
      this.showScanner = true;
    }
    closeScanner() {
      this.showScanner = false;
    }
    handleQrCodeResult(result: string) {
      this.closeScanner();
      this.getQRdata(result);
    }
    getQRdata(id: any) {
      this.api.GetQrGRNnumber(id).subscribe((res: any) => {
        console.log(res, 'qrdatakjhgfdsdfghj');
        let newData: any[] = [];
    
        if (Array.isArray(res)) {
          newData = res;
        } else if (res && typeof res === 'object') {
          if (res.grnNo || res.lrNumber) {
            newData = [res];
          }
        }
        // 
    
        if (newData.length > 0) {
          // Prevent duplicates (optional enhancement)
          newData = newData.filter(
            (qr) => !this.data?.some((existing: { grnNo: any; }) => existing.grnNo === qr.grnNo)
          );
    
          // Append new data
          this.data = [...this.data || [], ...newData];
    
          const qr = this.data[0];
          console.log("Qr:", qr);
    
          // Patch basic fields (non-array)
          this.form1.patchValue({
            senderName: qr?.senderName || '',
            fromCity: qr?.fromCity || '',
            fromBranch: qr?.pickUpBranch || '',
            toBranch: qr?.dropBranch || '',
            fromBookingDate: qr?.ltDate?.split('T')[0] || '',
            toBookingDate: qr?.bookingDate?.split('T')[0] || '',
          });
    
          // Patch FormArray fields correctly
          this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
          this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
          this.setFormArray('toCity', this.data.map((d: any) => d.toCity));
        }
    
        console.log("before submitting:", this.form1.value);
    
        const message = res?.message || 'Parcel loaded successfully';
        this.toast.success(message, 'Success');
      }, err => {
        this.toast.error('Parcel already loaded', 'Error');
      });
    }    
    onFromcitySelect(event: any) {
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
    
    ParcelLoad() {
      if (this.form1.invalid) {
        this.form1.markAllAsTouched(); 
        this.toast.warning('Please fill required fields correctly.', 'Validation');
        return;
      }
    
      const payload = {
        loadingType: this.form1.value.loadingType,
        fromBranch: this.form1.value.fromBranch,
        toBranch: this.form1.value.toBranch,
        vehicalNumber: this.form1.value.vehicalNumber,
        driverName: this.form1.value.driverName,
        driverNo: this.form1.value.driverNo,
        fromBookingDate: this.form1.value.fromBookingDate,
        toBookingDate: this.form1.value.toBookingDate,
        fromCity: this.form1.value.fromCity,
        senderName: this.form1.value.senderName,
        toCity: this.form1.value.toCity,
        grnNo: this.form1.value.grnNo,
        lrNumber: this.form1.value.lrNumber,
      };
    
      console.log('Final Payload:', payload);
    
      this.api.ParcelLoading(payload).subscribe({
        next: (response: any) => {
          console.log('Parcel loaded successfully:', response);
          this.toast.success('Parcel loaded successfully', 'Success');
          this.parcelloadingData = response.parcel;
          setTimeout(() => {
            this.printParcelLoadTable();
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/sub-loading']);
            });
          }, 1000);
        },
        error: (error: any) => {
          console.error('Parcel loading failed:', error);
          this.toast.error('Parcel Loading Failed. Please try again', 'Error');
        },
      });
    }

    getVehicleData() {
      this.api.getData('Vehicle').subscribe({
        next: (response: any) => {
          console.log('Vehicle:', response);
          this.vehicle = response; 
        },
        error: (error: any) => {
          console.error('Error fetching vehicle data:', error);
        }
      });
    }
  
    branchData() {
      this.api.getData('branch').subscribe({
        next: (response: any) => {
          console.log('Branch Datakajdkjanfjandfnaf:', response);
          this.branchdata = response; // Ensure response contains an array of branches
        },
        error: (error: any) => {
          console.error('Error fetching branch data:', error);
        }
      });
    }
      printSection() {
        const printContents = this.printTable.nativeElement.innerHTML;
        const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (WindowPrt) {
          WindowPrt.document.write(`
            <html>
              <head>
                <title>Print</title>
                <style>
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  th, td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: left;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                  input[type="checkbox"] {
                    display: none; /* Hide checkboxes in print */
                  }
                </style>
              </head>
              <body onload="window.print(); window.close();">
                ${printContents}
              </body>
            </html>
          `);
          WindowPrt.document.close();
        }
      }
        ExportExel(): void {
          const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.printTable.nativeElement);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
      
          const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
          const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
      
          FileSaver.saveAs(blob, `ParcelBooking_${new Date().toISOString().slice(0, 10)}.xlsx`);
        }
    

      printParcelLoadTable() {
        if (!this.parcelloadingData || !this.parcelloadingData.grnNo?.length) {
          alert('No data available to print.');
          return;
        }
      
        const printContents = this.printParcelTable.nativeElement.innerHTML;
        const popupWindow = window.open('', '_blank', 'width=1200,height=800');
      
        if (popupWindow) {
          popupWindow.document.open();
          popupWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Parcel Loading Print</title>
                <style>
                  @page {
                    size: A4 landscape;
                    margin: 10mm;
                  }
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                  }
                  .table-responsive {
                    margin: 20px;
                    overflow-x: auto;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                  }
                  th, td {
                    border: 1px solid #444;
                    padding: 8px;
                    text-align: center;
                  }
                  th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                  }
                  .table-striped tbody tr:nth-child(odd) {
                    background-color: #f9f9f9;
                  }
                </style>
              </head>
              <body>
                <div class="table-responsive">
                  ${printContents}
                </div>
                <script>
                  window.onload = function() {
                    window.print();
                    window.close();
                  };
                </script>
              </body>
            </html>
          `);
          popupWindow.document.close();
        } else {
          alert('Failed to open print window.');
        }
      }
    }
    
    
    
    
  
  
    
    
  
      
  
  
  
