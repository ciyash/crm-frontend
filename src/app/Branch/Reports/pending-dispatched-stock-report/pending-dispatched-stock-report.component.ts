import { Component,OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { AdminService } from 'src/app/service/admin.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any; 
import {  ElementRef, ViewChild, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-pending-dispatched-stock-report',
  templateUrl: './pending-dispatched-stock-report.component.html',
  styleUrls: ['./pending-dispatched-stock-report.component.scss']
})
export class PendingDispatchedStockReportComponent {
    @ViewChild('selectElem') selectElem!: ElementRef;
    @ViewChild('pickupbranch') pickupbranch!: ElementRef;
    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
  
    cdata: any;
    grnNo: any;
    grnnumber: any;
    onPickupBranchSelect: any;
    onDropBranchSelect: any;
    form!:FormGroup;
    id:any;
    citydata:any;
    branchdata:any;   
    pfdata:any;
    bookingSuccess: boolean = false;
    packdata:any;
    fbcdata:any;
    tbcdata:any;
    pdata:any;
    dptype:any;
  dispacthedReport: any;
  dispatchedReport: any;
  reportData: any;
  
    constructor(private fb: FormBuilder, private api: BranchService, private token:TokenService,
       private cdr: ChangeDetectorRef,  private route: ActivatedRoute,private toastr:ToastrService, 
       private router:Router, private admin:AdminService) {
      this.form = this.fb.group({
        fromCity:  ['all',],
        toCity: ['all', ],
        pickUpBranch: ['all',],
          });
       
       
     }
  
    ngOnInit() {
      // const id = this.activate.snapshot.paramMap.get('id');
      this.api.GetCities().subscribe((res:any)=>{
        console.log('citys',res);
        this.citydata=res;
      });
      //get branches
      this.api.GetBranch().subscribe((res:any)=>{
        console.log(res);
        this.branchdata=res;
        
      });
   
  
    
  
      this.getProfileData()
  
    }
    
   
    
    ngAfterViewInit(): void {
      setTimeout(() => {
        // Initialize Select2 for From City
        $(this.selectElem.nativeElement).select2();
        $(this.selectElem.nativeElement).on('select2:select', (event: any) => {
          const selectedCity = event.params.data.id;
          console.log('Selected City:', selectedCity);
          this.form.patchValue({ fromCity: selectedCity });
          console.log('Updated form value:', this.form.value);
          this.onFromcitySelect({ target: { value: selectedCity } });
        });
    
        // Initialize Select2 for Pickup Branch
        $(this.pickupbranch.nativeElement).select2();
        $(this.pickupbranch.nativeElement).on('select2:select', (event: any) => {
          const selectedBranch = event.params.data.id;
          console.log('Selected Pickup Branch:', selectedBranch);
          this.form.patchValue({ pickUpBranch: selectedBranch });
          console.log('Updated form value:', this.form.value);
          this.onPickupBranchSelect({ target: { value: selectedBranch } });
        });
    
        // Initialize Select2 for To City
        $(this.selectElem2.nativeElement).select2();
        $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
          const selectedToCity = event.params.data.id;
          console.log('Selected To City:', selectedToCity);
          this.form.patchValue({ toCity: selectedToCity });
          console.log('Updated form value:', this.form.value);
          this.onTocitySelect({ target: { value: selectedToCity } });
        });  
      }, 0);
    }

    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        console.log('profile', res);
        this.pfdata = res; // ✅ Assign full profile, not just branchId
        console.log(this.pfdata, "full profile");
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
  
  DispatchedStockReport() {
    const payload = this.form.value;
    console.log("payload:", payload);
  
    this.api.PendingDispatchedStockReport(payload).subscribe((res: any) => {
      this.reportData = res;
      console.log("report:", this.reportData);
    });
  }
  

    
  }
   
    
    
    
    
  
