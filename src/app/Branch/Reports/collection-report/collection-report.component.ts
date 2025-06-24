import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent implements OnInit, AfterViewInit {

  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
  form: FormGroup;
  citydata: any;
  branchdata: any;
  pfdata: any;
  collectiondata: any;  
  pdata: any;
  onPickupBranchSelect:any;
  collectionData: any;
  constructor(private fb: FormBuilder, private api: BranchService, private router: Router,private toast:ToastrService) {
    this.form = this.fb.group({ 
      fromDate: [this.getTodayDateString(), Validators.required],
      toDate: [this.getTodayDateString(), Validators.required],
      fromCity: [''],
      pickUpBranch: [''],
      bookedBy: [''],
      reportType: ['ALL']  // ✅ Set default value here

    });
    
  }

  ngOnInit() {
    this.api.GetCities().subscribe((res: any) => {
      this.citydata = res;
      console.log("citydata:", this.citydata);
    });

    this.api.GetBranch().subscribe((res: any) => {
      this.branchdata = res;
      console.log("branchdata:", this.branchdata);
      
    });

    this.getProfileData();
  }
  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // From City
      $(this.selectElem.nativeElement).select2();
      $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
        const selectedCity = event.params.data.id;
        this.form.patchValue({ fromCity: selectedCity });
        this.onFromcitySelect({ target: { value: selectedCity } });
      });
  
      // Pickup Branch
      $(this.pickupbranch.nativeElement).select2();
      $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedBranch = event.params.data.id;
        this.form.patchValue({ pickUpBranch: selectedBranch });
        this.onPickupBranchSelect({ target: { value: selectedBranch } });
      });
    }, 0);
  }
  
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log('profile', this.pfdata);
    });
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

//   getCollectionReport() {
//     const payload = this.form.value;
//     console.log("Payload:", payload);

//     this.api.SummaryBranchWiseReport(payload).subscribe({
//       next: (res: any) => {
//         console.log("collectiodata:",res);
        
//         const successMsg = res?.message || 'Report fetched successfully';
//         this.toast.success(successMsg);
//         const finalData = {
//           ...res,
//           fromDate: payload.fromDate,
//           toDate: payload.toDate
//         };
//         localStorage.setItem('collectiondata', JSON.stringify(finalData));
//         const baseUrl = window.location.origin;
//         const collectiondataUrl = `${baseUrl}/cloud/collectiondata`;
//         window.open(collectiondataUrl, '_blank');

//       },

//       error: (err: any) => {
//         console.error('Error fetching report:', err);
//         const errorMsg = err?.error?.message || err?.message || 'Failed to fetch report';
//         this.toast.error(errorMsg);
//       }
//     });
// }

getCollectionReport() {
  const payload = this.form.value;
  const { reportType, fromDate, toDate } = payload;

  let apiCall;
  let redirectRoute = '';

  // Decide API and route based on report type
  switch (reportType) {
    case 'ALL':
    case 'report':
      apiCall = this.api.SummaryBranchWiseReport(payload);
      redirectRoute = '/collectiondata';
      break;

    case 'topay':
      apiCall = this.api.topayReport(payload);
      redirectRoute = '/topayreport';
      break;

    case 'AllCollection':
      apiCall = this.api.ALLCollectionReport(payload);
      redirectRoute = '/allcollectionreport';
      break;

    case 'BookingTypeWise':
      apiCall = this.api.TypeWise(payload);
      redirectRoute = '/bookingtypewise';
      break;

    default:
      this.toast.warning('Invalid report type selected');
      return;
  }

  // Make API call and handle response
  apiCall.subscribe({
    next: (res: any) => {
      console.log('collectiodata:', res);

      const finalData = {
        ...res,
        fromDate,
        toDate
      };

      // Save to localStorage and navigate
      localStorage.setItem('collectiondata', JSON.stringify(finalData));
      this.router.navigate([redirectRoute]);
    },
    error: (err: any) => {
      console.error('Error fetching report:', err);
      this.toast.error('Failed to fetch report');
    }
  });
}

}

