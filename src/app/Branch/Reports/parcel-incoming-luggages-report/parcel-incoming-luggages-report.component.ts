import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-parcel-incoming-luggages-report',
  templateUrl: './parcel-incoming-luggages-report.component.html',
  styleUrls: ['./parcel-incoming-luggages-report.component.scss']
})
export class ParcelIncomingLuggagesReportComponent {
    @ViewChild('summaryfromcity') summaryfromcity!: ElementRef;
    @ViewChild('summarytocity') summarytocity!: ElementRef;
    @ViewChild('summarypickup') summarypickup!: ElementRef;
    @ViewChild('summarydroup') summarydroup!: ElementRef;
    form!: FormGroup;
    reportData: any;
    citydata: any;
    branchdata: any;
    allgetvechicle: any;
    pfdata: any;
    today = new Date(); 
    payload: any;
  
  
    constructor(private api: BranchService, private fb: FormBuilder,private router:Router) {
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
        console.log('allbranch:', res);
        this.branchdata = res;
      });
  
      // Fetch vehicles
      this.api.VehicleData().subscribe((res: any) => {
        console.log('allvechicle:', res);
        this.allgetvechicle = res;
      });
      this.getProfileData();
    }
    ngAfterViewInit(): void {
      setTimeout(() => {
        // Helper method to initialize Select2
        const initializeSelect2 = (
          element: ElementRef,
          form: FormGroup,
          controlName: string
        ) => {
          $(element.nativeElement).select2();
          $(element.nativeElement).on('select2:select', (event: any) => {
            const value = event.params.data.id;
            console.log(`Selected ${controlName}:`, value);
            form.patchValue({ [controlName]: value });
          });
        };
       
        initializeSelect2(this.summaryfromcity, this.form, 'fromCity');
        initializeSelect2(this.summarytocity, this.form, 'toCity');
        initializeSelect2(this.summarypickup, this.form, 'pickUpBranch');
        initializeSelect2(this.summarydroup, this.form, 'dropBranch');
      });
    }
  
  

  

  

  
    LuaggageReport() {
      this.payload = {
        fromDate: this.form.value.fromDate,
        toDate: this.form.value.toDate,
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        pickUpBranch: this.form.value.pickUpBranch,
        dropBranch: this.form.value.dropBranch,
      };
      console.log("payload:",this.payload);
      this.api.ParcelIncomingReport(this.payload).subscribe(
        (res: any) => {
          this.reportData = res.data;
          console.log('Luggage Report:', this.reportData);


          const finalData = {
            ...this.reportData,
            fromDate: this.payload.fromDate,
            toDate: this.payload.toDate
          };
    
          this.router.navigate(['/parcel-incoming-report'], { state:
             { data: finalData } });
        },


        (error) => {
          console.error('API Error:', error);
        }
      );
      
    }
  
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.pfdata = res;
        console.log('profiledata:', this.pfdata);
      });
    
  }
  
  
  }