import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-collectionreport',
  templateUrl: './collectionreport.component.html',
  styleUrls: ['./collectionreport.component.scss']
})
export class CollectionreportComponent {
   
    form: FormGroup;
    citydata: any;
    branchdata: any;
    pfdata: any;
    collectiondata: any;  
    pdata: any;
    onPickupBranchSelect:any;
  ffdata: any;
  profileData: any;
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
      
      this.getProfileData();
      this.api.GetCities().subscribe((res: any) => {
        this.citydata = res;
        console.log("citydata:", this.citydata);
      });
  
      this.api.GetBranch().subscribe((res: any) => {
        this.branchdata = res;
        console.log("branchdata:", this.branchdata);
        
      });
  
    }
    getTodayDateString(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        console.log('profile', res);
        this.ffdata = res.branchId;
        this.citydata = res;

        this.pfdata = res.branchId.city;
        this.profileData = res;
        console.log("profileData:", this.profileData);
    
        // Update form controls with profile data
        this.form.patchValue({
          fromCity: this.pfdata || '', // Set fromCity to the city from branchId
          pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
        });
    
        // Fetch service charges after setting fromCity
      });
    }


    

  

  
  //   getCollectionReport() {
  //     const payload = this.form.value;
  //     console.log("Payload:", payload);
  
  //     this.api.ParcelBranchWiseReport(payload).subscribe({
  //       next: (res: any) => {
  //         const successMsg = res?.message || 'Report fetched successfully';
  //         this.toast.success(successMsg);
  //         const finalData = {
  //           ...res,
  //           fromDate: payload.fromDate,
  //           toDate: payload.toDate
  //         };
  //         const dataStr = encodeURIComponent(JSON.stringify(finalData));
  //                 const url = this.router.serializeUrl(
  //           this.router.createUrlTree(['/collectiondata'], {
  //             queryParams: { data: dataStr }
  //           })
  //         );
  //         window.open(url, '_blank');
  //         console.log("dataStr:",dataStr);
          
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
  