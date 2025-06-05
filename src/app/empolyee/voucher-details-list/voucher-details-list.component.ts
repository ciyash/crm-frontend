import { Component,ViewChild,ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
declare var $: any;
declare const SlimSelect: any; 
@Component({
  selector: 'app-voucher-details-list',
  templateUrl: './voucher-details-list.component.html',
  styleUrls: ['./voucher-details-list.component.scss']
})
export class VoucherDetailsListComponent {
  @ViewChild('selectElem2') selectElem2!: ElementRef;

       citydata: any = []; // Ensure it's initialized to prevent undefined 
        form: FormGroup;
        vdata:any;
        data1:any = [];ffdata: any;
  pfdata: any;
  profileData: any;
  tbcdata: any;
;
        LoadSuccess: boolean = false;
        allSelected: boolean = false;
        pdata:any;
        cbdata:any;
        branchData:any;
        vldata:any;
        constructor(private api: BranchService, private fb: FormBuilder, private router:Router) {
          this.form = this.fb.group({
            fromDate: [this.getTodayDateString(), Validators.required],
            toDate: [this.getTodayDateString(), Validators.required],
            vehicalNumber: ['', ],
            fromCity: ['', ],
            toCity: ['',],
            fromBranch: ['', ],
          });
        }
      
        ngOnInit() {
          this.getProfileData();
          this.api.GetBranch().subscribe({
            next: (res: any) => {
              this.branchData = res;
              console.log('Branch data fetched successfully:', this.citydata);
            },
            error: (err) => console.error('Error fetching branch data:', err)
          });
          this.api.VehicleData().subscribe((res:any)=>{
              console.log('vdata',res);
              this.vdata=res;
          });
          this.api.GetCities().subscribe((res:any)=>{
            console.log('citydata',res);
            this.citydata=res;
        });
       
        }

        ngAfterViewInit(): void {
          setTimeout(() => {
      
        
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


  
        getTodayDateString(): string {
          const today = new Date();
          const year = today.getFullYear();
          const month = ('0' + (today.getMonth() + 1)).slice(-2);
          const day = ('0' + today.getDate()).slice(-2);
          return `${year}-${month}-${day}`; // yyyy-MM-dd
        }
      
   
      
         setFormArray(controlName: string, values: any[]) {
            const formArray = this.form.get(controlName) as FormArray;
            formArray.clear(); // ✅ Clear previous values
          
            values.forEach(value => {
              formArray.push(this.fb.control(value));
            });
          }
      
          onGrnNoChange(event: any, grnNo: string) {
            const formArray = this.form.get('grnNo') as FormArray;
          
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
            this.allSelected = this.data1.length === formArray.value.length;
            console.log('Selected GRN Numbers:', formArray.value);
          }
          
          
          VoucherLoad() {
            const payload = {
              fromDate: this.form.value.fromDate,
              toDate: this.form.value.toDate,
              vehicalNumber: this.form.value.vehicalNumber,
              fromCity: this.form.value.fromCity,
              toCity: this.form.value.toCity,
              fromBranch: this.form.value.fromBranch,
            };
          
            console.log('Final Payload:', payload);
            
            this.api.ParcelVouchersDetails(payload).subscribe({
              next: (response: any) => {
                console.log('Parcel loaded successfully:', response);
                // alert('Parcel Loaded Successfully!');
                this.data1=response;
                
              },
              error: (error: any) => {
                console.error('Parcel loading failed:', error);
                alert('Parcel Loading Failed. Please try again.');
              },
            });
          }
  
            getvouchersdata(id:any){
          this.api.GetVouchersListData(id).subscribe((res)=>{
              console.log('vouchersdata',res);
              this.vldata=res;
              console.log("thisvladata:",this.vldata)
          })
        }
  
          printgrnData(id:any){
            this.router.navigateByUrl('/printvouchersdata/'+id);
          }
          getProfileData() {
            this.api.GetProfileData().subscribe((res: any) => {
              console.log('profile', res);
              this.ffdata = res.branchId;
              this.pfdata = res.branchId.city;
              this.profileData = res;
              console.log("profileData:", this.profileData);
          
              // Update form controls with profile data
              this.form.patchValue({
                fromCity: this.pfdata || '', // Set fromCity to the city from branchId
                fromBranch: this.ffdata?.branchUniqueId || '' // Set pickUpBranch to branchUniqueId
              });
          
              // Fetch service charges after setting fromCity
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
  
  }
  
