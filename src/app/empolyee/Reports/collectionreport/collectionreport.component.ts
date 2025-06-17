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
        reportType: ['']
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
    console.log("Payload:", payload);

    this.api.ParcelBranchWiseReport(payload).subscribe({
      next: (res: any) => {
        console.log("collectiodata:",res);
        
        const successMsg = res?.message || 'Report fetched successfully';
        this.toast.success(successMsg);
        const finalData = {
          ...res,
          fromDate: payload.fromDate,
          toDate: payload.toDate
        };


        localStorage.setItem('collectiondata', JSON.stringify(finalData));
        const baseUrl = window.location.origin;
        const collectiondataUrl = `${baseUrl}/cloud/collectiondata`;
        window.open(collectiondataUrl, '_blank');

      },

      error: (err: any) => {
        console.error('Error fetching report:', err);
        const errorMsg = err?.error?.message || err?.message || 'Failed to fetch report';
        this.toast.error(errorMsg);
      }
    });
}
  
  }
  