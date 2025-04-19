import {  OnInit,AfterViewInit, Component, ElementRef, ViewChild  } from '@angular/core';
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
  selector: 'app-parcelloading',
  templateUrl: './parcelloading.component.html',
  styleUrls: ['./parcelloading.component.scss'],
})
export class ParcelloadingComponent implements OnInit {
  adminData: any;
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
  allSelected: boolean = false;
  qrdata: string = '';
  showScanner: boolean = false;
  tbcdata:any;
   @ViewChild('selectElem') selectElem!: ElementRef;
   @ViewChild('branchselect') branchselect!: ElementRef;
   @ViewChild('SelectVechicle')SelectVechicle!:ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  BranchSelect: any;
  

  constructor(private api: BranchService, private token:TokenService,
     private fb: FormBuilder, private messageService:MessageService,
      private router:Router, private activeroute:ActivatedRoute,private toast:ToastrService) {
      // this.form = this.fb.group({
      //   startDate: ['', Validators.required],
      //   endDate: ['', Validators.required],
      //   fromCity: ['', Validators.required],
      //   toCity: this.fb.array([], Validators.required),

      //   pickUpBranch: ['', Validators.required],
      this.form = this.fb.group({
        startDate: [this.getTodayDateString(), Validators.required],
        endDate: [this.getTodayDateString(), Validators.required],
        fromCity: [''],                // Remove Validators.required
        toCity: this.fb.array([]),     // No Validators.required
        pickUpBranch: [''],            // Remove Validators.required
      });

      this.form1 = this.fb.group({
        loadingType: ['offload'],
        fromBranch: ['', ],
        toBranch: ['',],
        vehicalNumber: ['', Validators.required],
        driverName: ['', Validators.required],
        driverNo: ['', Validators.required],
        fromBookingDate: ['',],
        toBookingDate: ['', ],
        fromCity: ['', ],
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


  onLoad() {
    const today = this.getTodayDateString();
    const formValues = this.form.value;
  
    const payload: any = {
      startDate: formValues.startDate || today,
      endDate: formValues.endDate || today
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

  
    console.log('Final Booking Data:', payload);
  
    this.api.FilterParcelLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Booking successful:', response);
        this.toast.success('Booking successful ', 'Success');
        this.data = response || [];
        this.LoadSuccess = true;
  
        if (this.data.length > 0) {
          this.form1.patchValue({
            fromBranch: this.data[0].pickUpBranch,
            toBranch: this.data[0].dropBranch,
            fromBookingDate: this.form.value.startDate,
            toBookingDate: this.form.value.endDate,
            fromCity: this.form.value.fromCity,
            // senderName:this.form.value.senderName,
            senderName: this.data[0]?.senderName || ''

            
          });
  
          this.setFormArray('toCity', this.data.map((d: any) => d.toCity));
          this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
          this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
        }
      },
      error: (error: any) => {
        console.error('Booking failed:', error);
        this.toast.error('Booking Failed. Please try again.', 'Error');
      },
    });
  }
  
  setFormArray(controlName: string, values: any[]) {
    const formArray = this.form1.get(controlName) as FormArray;
    formArray.clear(); // ✅ Clear previous values
    values.forEach(value => {
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
    this.allSelected = this.data.length === formArray.value.length;
    console.log('Selected GRN Numbers:', formArray.value);
  }
  
  // ✅ Handle "Select All" checkbox
  onSelectAllChange(event: any) {
    const formArray = this.form1.get('grnNo') as FormArray;
  
    if (event.target.checked) {
      // ✅ Select all if checked
      this.data.forEach((row:any) => {
        if (!formArray.value.includes(row.grnNo)) {
          formArray.push(this.fb.control(row.grnNo));
        }
      });
    } else {
      // ✅ Deselect all if unchecked
      formArray.clear();
    }
  
    // ✅ Update "Select All" status
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
        const selectedCity = event.params.data.id;  // Get selected value
        console.log('Selected City:', selectedCity);
        this.form.patchValue({ fromCity: selectedCity });  // Manually update the form
        console.log('Updated form value:', this.form.value);
        this.onFromcitySelect({ target: { value: selectedCity } });  // Trigger API call
      });
      $(this.branchselect.nativeElement).select2();
      $(this.branchselect.nativeElement).on('select2:select', (event: any) => {
        const selectedDropBranch = event.params.data.id;
        console.log('Selected Drop Branch:', selectedDropBranch);
        this.form.patchValue({ pickUpBranch: selectedDropBranch });  // Update form value
        console.log('Updated form value:', this.form.value);
        this.BranchSelect({ target: { value: selectedDropBranch } });
      });
  
      // Initialize select2 for Vehicle Number
      $(this.SelectVechicle.nativeElement).select2();
      $(this.SelectVechicle.nativeElement).on('select2:select', (event: any) => {
        const selectedVehicle = event.params.data.id;  // Get selected value
        console.log('Selected Vehicle:', selectedVehicle);
          this.form1.patchValue({ vehicalNumber: selectedVehicle });
          console.log('Updated form value:', this.form1.value);
      });
    }, 0);
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
  

  getQRdata(id: any) {
    this.api.GetQrGRNnumber(id).subscribe((res: any) => {
      console.log(res, 'qrdata');
  
      let newData: any[] = [];
  
      // Handle both object and array data responses
      if (Array.isArray(res)) {
        newData = res;
      } else if (res && typeof res === 'object') {
        // If it has grnNo or any parcel identifiers, push it even if success is false
        if (res.grnNo || res.lrNumber) {
          newData = [res];
        }
      }
  
      // Merge data to the table
      if (newData.length > 0) {
        this.data = [...this.data || [], ...newData];
        this.form1.patchValue({
          senderName: this.data[0]?.senderName || ''            
        });
        this.setFormArray('grnNo', this.data.map((d: any) => d.grnNo));
        this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber));
      }
  
      // Show toast depending on success/failure
      if (res.success) {
       
        this.toast.success(res.message || 'Parcel loaded successfully', 'Success');
      } else {
        this.toast.success(res.message || 'Parcel loaded successfully', 'Success');
      }
    }, err => {
      this.toast.error('Parcel already loaded', 'Error');
    });
  }
  
  
  // jkasdbksabd
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
      senderName:this.form1.value.senderName,
      toCity: this.form1.value.toCity,
      grnNo: this.form1.value.grnNo,
      lrNumber: this.form1.value.lrNumber,
    };
  
    console.log('Final Payload:', payload);
    
    this.api.ParcelLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        this.toast.success('Parcel loaded successfully','Success')
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/parcelloading']);
          });
        }, 1000);
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        this.toast.error('Parcel Loading Failed. Please try again', 'Error')

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
  }
  

    


