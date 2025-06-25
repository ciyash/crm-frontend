import { ChangeDetectorRef, Component } from '@angular/core';
import {  FormArray,  FormBuilder,  FormControl,  FormGroup,  Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
  
declare var $: any;
declare const SlimSelect: any;
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-parcel-onloading',
  templateUrl: './parcel-onloading.component.html',
  styleUrls: ['./parcel-onloading.component.scss'],
})
export class ParcelOnloadingComponent {
  adminData: any;
  form!: FormGroup;
  form1: FormGroup;
  cities: any;
  vehicle: any = {};
  branchdata: any;
  data: any;
  searchTerm: string = ''; // For binding with input field
  idselectmsg: string = '';
  errorMessage: string = '';
  data2: any;
  data1: any;
  LoadSuccess: boolean = false;
  allSelected: boolean = false;
  tbcdata: any;
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('branch') branch!: ElementRef;
  @ViewChild('selectvehicle') selectvehicle!: ElementRef;
  // @ViewChild('droupbranch') droupbranch!: ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  selectedbranch: any;
  onVehicleSelect: any;
  apiResponse: any[] = [];
  bookings: any;
  bkdata: any[] = [];
  summary: any = {};
  qrdata: string = '';
  showScanner: boolean = false;
  today = new Date();
  
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastr: ToastrService, private cdRef: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      toCity: [''],
      vehicalNumber: ['',],
      branch: [''] // ✅

    });
    this.form1 = this.fb.group({
      fromBookingDate: [''],
      toBookingDate: [''],
      fromCity: this.fb.array([]),
      toCity: ['', ], 
      grnNo: this.fb.array([]),
      bookingType:[''],
      // lrNumber: this.fb.array([]),
      branch: [''],
      vehicalNumber: [''],
      
    });
    
  }
  ngOnInit() {
    this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
    this.getCities();
    this.getvehicleData();
  }
  getTodayDateString(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // ✔ HTML date input format
  }


  ngAfterViewInit(): void {
    new SlimSelect({
      select: this.demoSelect.nativeElement
    });

    setTimeout(() => {

      // $(this.demoSelect.nativeElement).select2();
      $(this.demoSelect.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.get('fromCity')?.setValue(selectedCity);
        this.onFromCityChange({ target: { value: selectedCity } });
        console.log('Updated To City:', this.form.get('fromCity')?.value);
      });

      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.get('toCity')?.setValue(selectedCity);
        this.onTocitySelect({ target: { value: selectedCity } });
        console.log('Updated To City:', this.form.get('toCity')?.value);
      });

   
      $(this.branch.nativeElement).select2();
      $(this.branch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form.get('branch')?.setValue(selectedBranch);
        console.log('Updated Branch:', this.form.get('branch')?.value);
      });

    
      $(this.selectvehicle.nativeElement).select2();
      $(this.selectvehicle.nativeElement).on('select2:select', (event: any) => {
        const selectedVehicle = event.params.data.id;
        // this.form.get('vehicalNumber')?.setValue(selectedVehicle);
        this.form1.get('vehicalNumber')?.setValue(selectedVehicle);  // ✅ CORRECT
        console.log(
          'Updated Vehicle Number:',
          this.form.get('vehicalNumber')?.value
        );
      });
    }, 0);
  }


onLoad() {
  if (this.form.invalid) {
    this.toastr.error('Please fill all required fields', 'Validation Error');
    return;
  }

  const formValues = this.form.value;

  const payload: any = {
    fromDate: formValues.fromDate,
    toDate: formValues.toDate,
  };
  this.api.FilterParcelUnLoading(payload).subscribe({
    next: (response: any) => {
      const data = response?.data || [];
  
      if (!data.length) {
        this.apiResponse = [];
        this.bkdata = [];
        this.summary = {};
        this.LoadSuccess = false;
        this.toastr.error('No customer bookings found.', 'Error');
        return;
      }
  
      this.apiResponse = data;
      this.bkdata = data; // <-- fix: directly assign response data
  
      // Prepare summary
      this.summary = {};
      data.forEach((item: any) => {
        const type = item.bookingType;
        if (!this.summary[type]) {
          this.summary[type] = {
            totalQuantity: 0,
            totalGrandTotal: 0
          };
        }
  
        this.summary[type].totalQuantity += item.totalQuantity || 0;
        this.summary[type].totalGrandTotal += item.grandTotal || 0;
      });
  
      this.LoadSuccess = true;
  
      // if (this.bkdata.length > 0) {
      //   this.form1.patchValue({
      //     branch: this.bkdata[0].dropBranch,
      //   });
  
      //   // this.setFormArray('bookingType', this.bkdata.map(d => d.bookingType));
      //   this.setFormArray('grnNo', this.bkdata.map(d => d.grnNo));
      //   this.setFormArray('lrNumber', this.bkdata.map(d => d.lrNumber));
      // }
      if (this.bkdata.length > 0) {
        this.form1.patchValue({
          branch: this.bkdata[0].dropBranch,
          bookingType: this.bkdata[0].bookingType, // ✅ patch bookingType
        });
      
        this.setFormArray('grnNo', this.bkdata.map(d => d.grnNo));
        this.setFormArray('lrNumber', this.bkdata.map(d => d.lrNumber));
      }
      
      this.toastr.success('Parcel unloaded Successfully', 'Success');
    },
  
    error: (err) => {
      console.error('API Error:', err);
      this.apiResponse = [];
      this.bkdata = [];
      this.summary = {};
      this.LoadSuccess = false;
      this.toastr.error('Parcel unloaded Data Not Found', 'Error');
    }
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

getQRdata(id: string) {
  this.api.GetQrUnloadGRNnumber(id).subscribe(
    (res: any) => {
      console.log('Scanned QR data:', res);

      let newData: any[] = [];

      if (res?.data?.length) {
        newData = res.data;
      } else if (Array.isArray(res)) {
        newData = res;
      } else if (typeof res === 'object') {
        newData = [res];
      }

      if (newData.length === 0) {
        this.toastr.error('No data found for scanned QR code', 'Error');
        return;
      }

      // ✅ Append newData to existing bkdata
      this.bkdata = [...this.bkdata, ...newData];

      // ✅ Update form1 fields
      this.form1.patchValue({
        branch: newData[0].dropBranch,
        bookingType: newData[0].bookingType,
      });

      this.setFormArray('grnNo', this.bkdata.map(d => d.grnNo));
      this.setFormArray('lrNumber', this.bkdata.map(d => d.lrNumber));

      this.toastr.success('Parcel Unloaded successfully', 'Success');
      this.cdRef.detectChanges();
    },
    (err) => {
      this.toastr.error('Parcel already Unloaded or Error occurred', 'Error');
    }
  );
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

  getCities() {
    this.api.GetCities().subscribe({
      next: (response: any) => {
        console.log('Cities data:', response);
        this.cities = response;
        console.log(this.cities, 'cites');
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);
        alert('Failed to fetch cities data.');
      },
    });
  }
  get fromCityArray() {
    return this.form.get('fromCity') as FormArray;
  }
  onFromCityChange(event: any) {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option: any) => option.value
    );
    const fromCityArray = this.form.get('fromCity') as FormArray;
    fromCityArray.clear(); // Clear previous selections

    selectedOptions.forEach((city) => {
      fromCityArray.push(new FormControl(city));
    });
    console.log('Selected From Cities:', fromCityArray.value);
  }


  setFormArray(controlName: string, values: any[]) {
    const formArray = this.form1.get(controlName) as FormArray;
    formArray.clear(); // Clear existing
    values.flat().forEach((value) => {
      formArray.push(this.fb.control(value));
    });
  }


  getvehicleData() {
    this.api.VehicleData().subscribe({
      next: (response: any) => {
        console.log('Vehicle:', response);
        this.vehicle = response;
      },
      error: (error: any) => {
        console.error('Error fetching vehicle data:', error);
      },
    });
  }
  // onGrnNoChange(event: any, grnNo: number) {
  //   const grnArray = this.form1.get('grnNo') as FormArray;
  
  //   if (event.target.checked) {
  //     if (!grnArray.value.includes(grnNo)) {
  //       grnArray.push(this.fb.control(grnNo));
  //     }
  //   } else {
  //     const index = grnArray.controls.findIndex(x => x.value === grnNo);
  //     if (index >= 0) {
  //       grnArray.removeAt(index);
  //     }
  //   }
  
  //   this.allSelected = this.bkdata.length === grnArray.value.length;
  // }
  onGrnNoChange(event: any, grnNo: number) {
    const grnArray = this.form1.get('grnNo') as FormArray;
  
    if (event.target.checked) {
      if (!grnArray.value.includes(grnNo)) {
        grnArray.push(this.fb.control(grnNo));
      }
    } else {
      const index = grnArray.controls.findIndex(x => x.value === grnNo);
      if (index >= 0) {
        grnArray.removeAt(index);
      }
    }
  
    this.allSelected = this.bkdata.length === grnArray.value.length;
  }
  onManualCheckboxChange(row: any) {
    const grnArray = this.form1.get('grnNo') as FormArray;
  
    // Clear the form array first
    while (grnArray.length !== 0) {
      grnArray.removeAt(0);
    }
  
    // Rebuild the form array based on checked rows
    this.bkdata.forEach((item: any) => {
      if (item._checked) {
        grnArray.push(this.fb.control(item.grnNo));
      }
    });
  
    // Update "Select All" status
    this.allSelected = this.bkdata.every(item => item._checked);
  }
  
  onSelectAllChange(event: any) {
    const checked = event.target.checked;
    const grnArray = this.fb.array([]);
  
    this.bkdata.forEach(row => {
      row._checked = checked;
      if (checked) {
        grnArray.push(this.fb.control(row.grnNo));
      }
    });
  
    this.form1.setControl('grnNo', grnArray);
    this.allSelected = checked;
  }
  
  
  // onSelectAllChange(event: any) {
  //   const checked = event.target.checked;
  //   const grnArray = this.fb.array([]);
  
  //   if (checked) {
  //     this.bkdata.forEach(d => grnArray.push(this.fb.control(d.grnNo)));
  //   }
  
  //   this.form1.setControl('grnNo', grnArray);
  //   this.allSelected = checked;
  // }

  

  // ParcelLoad() {
  //   console.log('ParcelLoad called');  // Confirm click
  //   console.log('Form Value:', this.form1.value);  // Confirm data
  
  //   const grnNos = Array.isArray(this.form1.value.grnNo)
  //     ? this.form1.value.grnNo
  //     : [this.form1.value.grnNo];
  
  //   const payload = {
  //     fromBookingDate: this.form1.value.fromBookingDate,
  //     toBookingDate: this.form1.value.toBookingDate,
  //     fromCity: this.form1.value.fromCity,
  //     toCity: this.form1.value.toCity,
  //     branch: this.form1.value.branch,
  //     vehicalNumber: this.form1.value.vehicalNumber,
  //     grnNo: grnNos,
  //     bookingType: this.form1.value.bookingType,
  //   };
  
  //   console.log('Final Payload:', payload);
  
  //   this.api.ParcelUnLoading(payload).subscribe({
  //     next: (response: any) => {
  //       console.log('Parcel unloaded successfully:', response);
  //       this.toastr.success('Parcel unloaded successfully', 'Success');
  //       setTimeout(() => {
  //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //           this.router.navigate(['/parcelunloading']);
  //         });
  //       }, 1000);
  //     },
  //     error: (error: any) => {
  //       console.error('Parcel unloading failed:', error);
  //       alert('Parcel Unloading Failed. Please try again.');
  //     },
  //   });
  // }

  ParcelLoad() {
    console.log('ParcelLoad called');
    console.log('Form Value:', this.form1.value);
  
    const grnNos = this.form1.value.grnNo || [];
  
    if (!grnNos.length) {
      this.toastr.warning('Please select at least one GRN.', 'Validation');
      return;
    }
  
    const payload = {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity,
      branch: this.form1.value.branch,
      vehicalNumber: this.form1.value.vehicalNumber,
      grnNo: grnNos,
      bookingType: this.form1.value.bookingType,
    };
  
    console.log('Final Payload:', payload);
  
    this.api.ParcelUnLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel unloaded successfully:', response);
        this.toastr.success('Parcel unloaded successfully', 'Success');
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/parcelunloading']);
          });
        }, 1000);
      },
      error: (error: any) => {
        console.error('Parcel unloading failed:', error);
        alert('Parcel Unloading Failed. Please try again.');
      },
    });
  }
  
  

  printTable() {
    const printContent = document.getElementById('print-section');
    const WindowPrt = window.open('', '', 'width=900,height=650');
    if (WindowPrt && printContent) {
      WindowPrt.document.write(`
        <html>
          <head>
            <title>Print Table</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      WindowPrt.document.close();
    }
  }
  

  ExportEXcel(): void {
    const headerData = [];
  
    // Optional: Add title or meta info
    headerData.push(['Parcel Booking GRN Report']);
    headerData.push([
      `Print Date: ${this.formatDate(this.today)} Time: ${this.formatTime(this.today)}`
    ]);
    headerData.push([]); // Blank row
  
    // Table headers
    const tableHeaders = [
      'S.No',
      'GRN No',
      'Book by Branch',
      'Drop Branch',
      'From City',
      'To City',
      'Booking Date',
      'Sender',
      'Receiver',
      'Qty',
      'Charges'
    ];
    headerData.push(tableHeaders);
  
    // Table data rows
    const tableRows = this.bkdata.map((row: any, index: number) => [
      index + 1,
      row?.lrNumber,
      row?.pickUpBranchname,
      row?.dropBranchname,
      row?.fromCity,
      row?.toCity,
      this.formatDate(row?.bookingDate),
      row?.senderName,
      row?.receiverName,
      row?.totalQuantity,
      row?.grandTotal
    ]);
  
    const sheetData = [...headerData, ...tableRows];
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Report': worksheet },
      SheetNames: ['Report']
    };
  
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
  
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
  
    FileSaver.saveAs(blob, 'Parcel_GRN_Report.xlsx');
  }
  
  
  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  }
  
  formatTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  

  }
  








