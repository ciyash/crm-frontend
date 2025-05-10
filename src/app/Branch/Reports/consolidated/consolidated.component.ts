import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;
declare const SlimSelect: any; 


@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss']
})
export class ConsolidatedComponent {

  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('branchselect') branchselect!: ElementRef;

 BranchSelect: any;
  form: FormGroup;
  citydata: any;
  branchdata: any;
  pfdata: any;
  Cdata: any;
  bdata:any;
  tbcdata: any
  cities: any;

  constructor(private fb: FormBuilder, private api: BranchService) {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      fromCity: [''],
      pickUpBranch: [''],
      bookedBy: [''],
      displayBookingDetails: [false],
      branchSummary: [false],
    });
  }

  ngOnInit() {
    this.getCities();
    this.branchData();
    this.getProfileData();
  
  }
  getCities() {
    this.api.GetCities().subscribe({
      next: (response: any) => {
        console.log('Cities data:', response);
        this.cities = response; 
      },
      error: (error: any) => {
        console.error('Error fetching cities:', error);

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


  ngAfterViewInit(): void {
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
  

    }, 0);
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
  
  getProfileData(){
    this.api.GetProfileData().subscribe((res: any) => {
      console.log('profile', res);
      this.pfdata = res;
      console.log(this.pfdata, "branchid");
      
      if (this.pfdata && this.pfdata.username) {
        this.form.patchValue({
          bookedBy: this.pfdata.username
        });
      }
    });
  }
  
  getCollectionReport() {
    const payload = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate,
      fromCity: this.form.value.fromCity,
      pickUpBranch: this.form.value.pickUpBranch,
      bookedBy: this.form.value.bookedBy,
    };
    console.log("payload:",payload);
    this.bdata=payload
    
    

    this.api.ConsolidatedReport(payload).subscribe({
      next: (res) => {
        console.log('ConsolidatedReport:', res);
        this.Cdata=res
            },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }
  today = new Date();

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${day}-${month}-${year}`; 
  }

  get showFilter(): boolean {
    return this.form.get('displayBookingDetails')?.value || this.form.get('branchSummary')?.value;
  }
}










  

  
  