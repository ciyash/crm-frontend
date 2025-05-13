import { ChangeDetectorRef, Component } from '@angular/core';
import {  FormArray,  FormBuilder,  FormControl,  FormGroup,  Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
  
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
  apiResponse: any;
  bookings: any;
  bkdata: any[] = [];
  summary: any = {};
  qrdata: string = '';
  showScanner: boolean = false;
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
      fromBookingDate: ['', ],
      toBookingDate: ['', ],
      fromCity: this.fb.array([]),
      toCity: ['', ], // ✅ Ensure toCity is a FormControl, NOT a FormArray
      branch: ['', ],
      vehicalNumber: ['', ],
      grnNo: this.fb.array([],),
      bookingType: [''],
    });
  }
  ngOnInit() {
    this.searchTerm = this.activeroute.snapshot.params['grnNumber'];
    this.getCities();
    this.getvehicleData();
    // this.updateFormattedDate();

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
        this.form.get('vehicalNumber')?.setValue(selectedVehicle);
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
  

  const payload = {
    fromDate: formValues.fromDate,
    toDate: formValues.toDate,
    fromCity: formValues.fromCity.length ? formValues.fromCity : [],
    toCity: formValues.toCity || '',
    vehicalNumber: formValues.vehicalNumber || '',
    branch: formValues.branch || '',
  };
console.log("payload:",payload)
  this.api.FilterParcelUnLoading(payload).subscribe({
    next: (response: any) => {
      console.log('dataload', response)
      if (response?.data?.length) {
        this.apiResponse = response.data || [];

        // Combine all bookings into one array
        this.bkdata = this.apiResponse.flatMap((item: any) => item.bookings);

        // Prepare summary
        this.summary = {};
        this.apiResponse.forEach((item: any) => {
          this.summary[item.bookingType] = {
            totalQuantity: item.totalQuantity,
            totalGrandTotal: item.totalGrandTotal,
          };
        });

        this.LoadSuccess = true;
        if (this.bkdata.length > 0) {
          this.form1.patchValue({
            branch: this.bkdata[0].branch,            
          });
          this.setFormArray('bookingType', this.bkdata.map((d: any) => d.bookingType));
          this.setFormArray('grnNo', this.bkdata.map((d: any) => d.grnNo));
          this.setFormArray('lrNumber', this.bkdata.map((d: any) => d.lrNumber));
        }
        this.toastr.success('Parcel unloaded Successfully', 'Success');
      } else {
        this.apiResponse = [];
        this.bkdata = [];
        this.summary = {};
        this.LoadSuccess = false;
        this.toastr.info('No customer bookings found.', 'Info');
      }
    },
    error: (error: any) => {
      console.error('Booking failed:', error);
      this.toastr.error('Parcel unloaded Data Not Found', 'Error');
    },
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

  // Don't set this.data = result directly here (it's just a string)
  this.getQRdata(result);
}


getQRdata(id: string) {
  this.api.GetQrUnloadGRNnumber(id).subscribe(
    (res: any) => {
      console.log('Scanned QR data:', res);

      let newData: any[] = [];

      // Normalize based on your API structure
      if (res?.data?.length) {
        this.apiResponse = res.data || [];

        // Combine all bookings into one array
        this.bkdata = this.apiResponse.flatMap((item: any) => item.bookings);
      } else if (Array.isArray(res)) {
        newData = res;
      } else if (typeof res === 'object') {
        newData = [res];
      }

      this.bkdata = [...this.bkdata, ...newData]; // avoid push()

      this.toastr.success('Parcel Unloaded successfully', 'Success');
      this.cdRef.detectChanges(); // Ensure UI refresh if needed
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

  onGrnNoChange(event: any, grnNo: string) {
    const formArray = this.form1.get('grnNo') as FormArray;
    if (event.target.checked) {
      // Add if not already selected
      if (!formArray.value.includes(grnNo)) {
        formArray.push(this.fb.control(grnNo));
      }
    } else {
      // Remove if unchecked
      const index = formArray.value.indexOf(grnNo);
      if (index > -1) {
        formArray.removeAt(index);
      }
    }
  
    // ✅ Update "Select All" status based on selected values
    this.allSelected = this.bkdata.length === formArray.value.length;
    console.log('Selected GRN Numbers:', formArray.value);
  }

  onSelectAllChange(event: any) {
    const formArray = this.form1.get('grnNo') as FormArray;
    formArray.clear();

    if (event.target.checked && this.bkdata?.length > 0) {
      this.bkdata.forEach((row: any) => {
        const grn = row?.grnNo;
        if (grn && !formArray.value.includes(grn)) {
          formArray.push(this.fb.control(grn));
        }
      });
    }

    this.allSelected = event.target.checked;
    console.log('All selected GRNs:', formArray.value);
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

  ParcelLoad() {
    const payload = {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity,
      branch: this.form1.value.branch,
      vehicalNumber: this.form1.value.vehicalNumber,
      grnNo: this.form1.value.grnNo, // ✅ This must be an array!
      bookingType: this.form1.value.bookingType,
    };

    console.log('Final Payload:', payload);
    this.api.ParcelUnLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel unloaded successfully:', response);
        this.toastr.success('Parcel unloaded successfully', ' successfully');

        setTimeout(() => {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
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







  // selectedDate: string = moment().format('YYYY/MM/DD');
  // formattedDate: string = '';
  //   dateFormat: string = 'DD/MMMM/YYYY';
  
 
  
  //   updateFormattedDate() {
  //     if (this.selectedDate) {
  //       this.formattedDate = moment(this.selectedDate, 'YYYY-MM-DD').format(this.dateFormat);
  //     }
  //   }
  
  //   onSubmit() {
  //     alert('Selected Date: ' + this.selectedDate + '\nFormatted: ' + this.formattedDate);
  //   }

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
  



  }
  








