import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;
declare const SlimSelect: any; 

@Component({
  selector: 'app-parcel-loading-data',
  templateUrl: './parcel-loading-data.component.html',
  styleUrls: ['./parcel-loading-data.component.scss']
})
export class ParcelLoadingDataComponent {
  data1: any;
  form1: FormGroup;
  cities: any;
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.form1 = this.fb.group({
      fromBookingDate: ['', Validators.required],
      toBookingDate: ['', Validators.required],
      fromCity: ['', Validators.required],
      toCity: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() {
    this.getCities();
  }

  ngAfterViewInit(): void {
    new SlimSelect({
      select: this.demoSelect.nativeElement
    });  
    
    setTimeout(() => {
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form1.patchValue({ fromCity: selectedCity });
      });
    }, 0);
  }

  getCities() {
    this.api.GetCities().subscribe({
      next: (response: any) => {
        this.cities = response;
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);
        alert('Failed to fetch cities data.');
      },
    });
  }

  get toCityArray() {
    return this.form1.get('toCity') as FormArray;
  }


  onToCityChange(event: any) {
    const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
    const toCityArray = this.form1.get('toCity') as FormArray;
    toCityArray.clear(); // ✅ Clear old values before updating
    selectedOptions.forEach(city => toCityArray.push(new FormControl(city)));
    console.log('Selected To Cities:', toCityArray.value);
  }
  ParcelLoad() {
    console.log("Before Load: Payload being sent", {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity,
    });
  
    const payload = {
      fromBookingDate: this.form1.value.fromBookingDate,
      toBookingDate: this.form1.value.toBookingDate,
      fromCity: this.form1.value.fromCity,
      toCity: this.form1.value.toCity,
    };
  
    this.api.ParcelOfflineReport(payload).subscribe({
      next: (response: any) => {
        console.log("After Load: Response received", response);
  
        if (response?.bookingDetails?.length > 0) {
          this.data1 = response.bookingDetails.map((booking: any) => {
            const driverData = response.parcelLoadingDetails.find(
              (parcel: any) => parcel.grnNo.includes(parseInt(booking.lrNumber.split('/').pop()))
            );
            return {
              ...booking,
              driverName: driverData ? driverData.driverName : 'N/A',
            };
          });
        } else {
          this.data1 = [];
        }
  
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('No Parcel Loading. Please try again.');
        this.data1 = [];
      },
    });
  }
  
 
}