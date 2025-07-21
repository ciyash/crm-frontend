import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any;
@Component({
  selector: 'app-branch-to-branch-unloading',
  templateUrl: './branch-to-branch-unloading.component.html',
  styleUrls: ['./branch-to-branch-unloading.component.scss'],
})
export class BranchToBranchUnloadingComponent {
  @ViewChild('toBranch') toBranch!: ElementRef;
  @ViewChild('demoSelect') demoSelect!: ElementRef;
  citydata: any = [];
  form: FormGroup;
  vdata: any;
  data: any;
  form1: FormGroup;
  LoadSuccess: boolean = false;
  allSelected: boolean = false;
  pdata: any;
  ffdata: any;
  pfdata: any;
  profileData: any;
  cities: any;
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: this.fb.array([]),  // ✅ Changed from string to FormArray
      toBranch: ['',Validators.required],
    });

    this.form1 = this.fb.group({
      lrNumber: this.fb.array([]),
      grnNo: this.fb.array([]),
      fromDate: [''],
      toDate: [''],
      branch: [''],
      unloadBranch: [''],
      remarks: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.api.GetBranch().subscribe({
      next: (res: any) => {
        this.citydata = res;
        console.log('Branch data fetched successfully:', this.citydata);
      },
      error: (err) => console.error('Error fetching branch data:', err),
    });

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

    this.api.VehicleData().subscribe((res: any) => {
      console.log('vdata', res);
      this.vdata = res;
    });
  
    this.getProfileData();
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`; // yyyy-MM-dd
  }


  loaddata() {
  const payload = {
    fromDate: this.form.value.fromDate,
    toDate: this.form.value.toDate,
    fromCity: this.form.value.fromCity,
    toBranch: this.form.value.toBranch,
  };
  console.log('Final Payload:', payload);
  this.api.postBranchtobranchUnLoadingFilter(payload).subscribe({
    next: (response: any) => {
      console.log('loaded successfully:', response);
      this.toast.success('ParcelBranch to Branch Unloaded Successfully', 'Success');
      this.data = response;
      this.LoadSuccess = true;

      if (this.data.length > 0) {
        this.form1.patchValue({
          fromDate: payload.fromDate,
          toDate: payload.toDate,
          fromCity: payload.fromCity,
          unloadBranch: payload.toBranch,
        });
       this.setFormArray('lrNumber', this.data.map((d: any) => d.lrNumber))
      }
    },
    error: (error: any) => {
      console.error('loading failed:', error);
      this.toast.error('NO Parcel Loading. Please try again.', 'failed');
    },
  });
}

  setFormArray(controlName: string, values: any[]) {
    const formArray = this.form1.get(controlName) as FormArray;
    formArray.clear(); // ✅ Clear previous values

    values.forEach((value) => {
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

    this.allSelected = this.data.length === formArray.value.length;
    console.log('Selected GRN Numbers:', formArray.value);
  }

  onSelectAllChange(event: any) {
    const formArray = this.form1.get('grnNo') as FormArray;

    if (event.target.checked) {
      // ✅ Select all if checked
      this.data.forEach((row: any) => {
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

  ParcelLoad() {
    const selectedGrns: string[] = this.form1.value.grnNo;
  
    if (!selectedGrns || selectedGrns.length === 0) {
      alert('Please select at least one GRN number.');
      return;
    }
    const filteredLrNumbers = this.data
      .filter((item: any) => selectedGrns.includes(item.grnNo))
      .map((item: any) => item.lrNumber);
  
    const payload = {
      grnNo: selectedGrns,
      lrNumber: filteredLrNumbers,
      fromDate: this.form1.value.fromDate,
      toDate: this.form1.value.toDate,
      branch: this.form1.value.branch,
      unloadBranch: this.form1.value.unloadBranch,
      remarks: this.form1.value.remarks,
    };
  
    console.log('Final Payload:', payload);
  
    this.api.BranchtobranchUnLoading(payload).subscribe({
      next: (response: any) => {
        console.log('Parcel loaded successfully:', response);
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/employee-branch-unloading']);
          });
        }, 1000);
      },
      error: (error: any) => {
        console.error('Parcel loading failed:', error);
        alert('Parcel Loading Failed. Please try again.');
      },
    });
  }
  

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      console.log('profile', res);
      this.ffdata = res.branchId;
      this.pfdata = res.branchId.city;
      this.profileData = res;
      console.log('profileData:', this.profileData);
      this.form.patchValue({
        toBranch: this.ffdata?.branchUniqueId || '',  // ✅ Correct binding to hidden input
      });
      
    });
  }
  


  ngAfterViewInit(): void {
    new SlimSelect({
      select: this.demoSelect.nativeElement
    });
  
    setTimeout(() => {
      $(this.demoSelect.nativeElement).on('change', () => {
        const selectedCities = Array.from(this.demoSelect.nativeElement.selectedOptions).map(
          (option: any) => option.value
        );
        this.updateFromCityFormArray(selectedCities);
      });
    }, 0);
  }
  
  updateFromCityFormArray(selectedCities: string[]) {
    const fromCityArray = this.form.get('fromCity') as FormArray;
    fromCityArray.clear();
    selectedCities.forEach((city) => fromCityArray.push(new FormControl(city)));
  
    console.log('Selected From Cities:', fromCityArray.value);
  }
  

}
