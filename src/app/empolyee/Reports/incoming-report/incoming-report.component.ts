import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Component({
  selector: 'app-incoming-report',
  templateUrl: './incoming-report.component.html',
  styleUrls: ['./incoming-report.component.scss']
})
export class IncomingReportComponent {


    @ViewChild('selectElem2') selectElem2!: ElementRef;
    @ViewChild('droupbranch') droupbranch!: ElementRef;
  
  
    onPickupBranchSelect: any;
    onDropBranchSelect: any;
      form!: FormGroup;
      reportData: any;
      citydata: any;
      branchdata: any;
      allgetvechicle: any;
      pfdata: any;
      today = new Date(); 
      payload: any;
    pdata: any;
    tbcdata: any;
  ffdata: any;
  profileData: any;
  pffffffdata: any;
      constructor(private api: BranchService, private fb: FormBuilder,private router:Router,private toast:ToastrService) {
        this.form = this.fb.group({
          // fromDate: ['', Validators.required],
          // toDate: ['', Validators.required],
          fromDate: [this.getTodayDateString(), Validators.required],
          toDate: [this.getTodayDateString(), Validators.required],
          fromCity: [''],
          toCity: [''],
          pickUpBranch: [''],
          dropBranch: [''],
        });
      }
    
      getTodayDateString(): string {
        const today = new Date();
        const day = ('0' + today.getDate()).slice(-2);
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const year = today.getFullYear();
        return `${year}-${month}-${day}`; // ✔ HTML date input format
      }
      
    
      ngOnInit() {
        // Fetch cities
        this.api.GetCities().subscribe((res: any) => {
          console.log('citydata', res);
          this.citydata = res;
        });
    
        // Fetch branches
  
        this.api.GetBranch().subscribe((res: any) => {
          this.branchdata = res;
          console.log('branchdata:', this.branchdata);
        });
  
    
        // Fetch vehicles
        this.api.VehicleData().subscribe((res: any) => {
          console.log('allvechicle:', res);
          this.allgetvechicle = res;
        });
        this.getProfileData();
      }
  
  // hh
      LuaggageReport() {
        this.payload = {
          fromDate: this.form.value.fromDate,
          toDate: this.form.value.toDate,
          fromCity: this.form.value.fromCity,
          toCity: this.form.value.toCity,
          pickUpBranch: this.form.value.pickUpBranch,
          dropBranch: this.form.value.dropBranch,
        };
        console.log("payload:", this.payload);
      
        this.api.ParcelIncomingReport(this.payload).subscribe(
          (res: any) => {
            this.reportData = res.data;
            console.log('Luggage Report:', this.reportData);
            const  ddsts = res.data
            
            const finalData = {
              ...this.reportData,
              fromDate: this.payload.fromDate,
              toDate: this.payload.toDate
            };
      
            // Save to localStorage
            localStorage.setItem('incomingReportData', JSON.stringify(finalData));
      
            // Open new tab
            window.open('/parcel-incoming-report', '_blank');
          },
          (error) => {
            console.error('API Error:', error);
          }
        );
      }
      
      getProfileData() {
        this.api.GetProfileData().subscribe((res: any) => {
          console.log('profile', res);
          this.ffdata = res.branchId;
          this.pfdata = res.branchId.city;
          this.profileData = res;
          this.pffffffdata = res;
  
          console.log("profileData:", this.profileData);
      
          // Update form controls with profile data
          this.form.patchValue({
            fromCity: this.pfdata || '', // Set fromCity to the city from branchId
            pickUpBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
          });
            });
      }
    

  
      ngAfterViewInit(): void {
        setTimeout(() => {
      
          // To City
          $(this.selectElem2.nativeElement).select2();
          $(this.selectElem2.nativeElement).val('all').trigger('change'); // ✅
          $(this.selectElem2.nativeElement).on('select2:select', (event: any) => {
            const selectedToCity = event.params.data.id;
            this.form.patchValue({ toCity: selectedToCity });
            this.onTocitySelect({ target: { value: selectedToCity } });
          });
      
          // Drop Branch
          $(this.droupbranch.nativeElement).select2();
          $(this.droupbranch.nativeElement).val('all').trigger('change'); // ✅
          $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
            const selectedDropBranch = event.params.data.id;
            this.form.patchValue({ dropBranch: selectedDropBranch });
            this.onDropBranchSelect({ target: { value: selectedDropBranch } });
          });
        }, 0);
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
  }