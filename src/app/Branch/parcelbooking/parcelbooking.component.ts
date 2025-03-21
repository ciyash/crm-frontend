import { Component,OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { HeaderComponent } from "../../USER/header/header.component";
@Component({
  selector: 'app-parcelbooking',
  templateUrl: './parcelbooking.component.html',
  styleUrls: ['./parcelbooking.component.scss'],
})
export class ParcelbookingComponent {
  adminData: any;
  form!:FormGroup;
  showTable: boolean = false;
  id:any;
  citydata:any;
  branchdata:any;
  bdata: any[] = [];
  totalPrice:any;
  total1:any;
  pfdata:any;
  bookingSuccess: boolean = false;
  names: any;
  constructor(private fb: FormBuilder, private api: BranchService, private token:TokenService, private cdr: ChangeDetectorRef, private activate:ActivatedRoute, private router:Router) {
    this.form = this.fb.group({
      fromCity: [''],
      toCity: ['', Validators.required],
      pickUpBranch:[''],
      dropBranch: ['', Validators.required],
      dispatchType: ['', Validators.required],
      bookingType: ['', Validators.required],
      senderName: ['', Validators.required],
      senderMobile: ['', Validators.required],
      senderAddress: ['', Validators.required],
      senderGST: [''],
      receiverName: [''],
      receiverMobile: [''],
      receiverAddress: [''],
      receiverGST: [''],
      packages: this.fb.array([])
    });
   }

  ngOnInit() {
    // const id = this.activate.snapshot.paramMap.get('id');
  
    // get city's
    this.api.GetCities().subscribe((res:any)=>{
      console.log('citys',res);
      this.citydata=res;
    });
    //get branches
    this.api.GetBranch().subscribe((res:any)=>{
      console.log(res);
      this.branchdata=res;
    });
this.getProfileData();
    this.addOrderItem();
    this.searchNames();

  }
getProfileData(){
  this.api.GetProfileData().subscribe((res:any)=>{
    console.log('profile',res);
    this.pfdata=res.branchId;
  });
}


  get packages(): FormArray {
    return this.form.get('packages') as FormArray;
  }

  addOrderItem() {
    this.packages.push(
      this.fb.group({
        quantity: [1, Validators.required],
        packageType: ['', Validators.required],
        contains: ['', Validators.required],
        weight: [0, Validators.required],
        unitPrice: [0, Validators.required],
        totalPrice: [0],
      })
    );
  }

  removeBarcodeData(index: number) {
    this.packages.removeAt(index);
  }

  calculateTotal(index: number) {
    const item = this.packages.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
  
    item.get('totalPrice')?.setValue(total); // Update form control
  }

  add() {
    console.log(this.form.value);
  
    if (this.form.valid) {
      // Extract package data from form
      const orderDataToSend = this.packages.value.map((item: any) => ({
        quantity: item.quantity,
        packageType: item.packageType,
        contains: item.contains,
        weight: item.weight,
        unitPrice: item.unitPrice,
        totalPrice:item.totalPrice
      }));
  
      const val: any = {
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        pickUpBranch: this.form.value.pickUpBranch,
        dropBranch: this.form.value.dropBranch,
        dispatchType: this.form.value.dispatchType,
        bookingType: this.form.value.bookingType,
        senderName: this.form.value.senderName,
        senderMobile: this.form.value.senderMobile,
        senderAddress: this.form.value.senderAddress,
        senderGst: this.form.value.senderGST,
        receiverName: this.form.value.receiverName,
        receiverMobile: this.form.value.receiverMobile,
        receiverAddress: this.form.value.receiverAddress,
        receiverGst: this.form.value.receiverGST,
        packages: orderDataToSend,
      };
  
      console.log('Final data to submit:', val);
      
      // Call API to save data
      this.api.createBooking(val).subscribe((response:any) => {
        console.log('Order saved successfully', response);
        this.bookingSuccess = true;
        this.form.reset();
        setTimeout(() => {
          this.bookingSuccess = false;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/booking']);
          });
        }, 1000);
      }, error => {
        console.error('Error saving order', error);
      });
    }
  }
  
  toggleSameAsSender(event: any) {
    if (event.target.checked) {
      this.form.patchValue({
        receiverName: this.form.value.senderName,
        receiverMobile: this.form.value.senderMobile,
        receiverAddress: this.form.value.senderAddress,
        receiverGST: this.form.value.senderGST,
      });
    } else {
      this.form.patchValue({
        receiverName: '',
        receiverMobile: '',
        receiverAddress: '',
        receiverGST: '',
      });
    }
  }



  searchNames() {
    this.api.getNames().subscribe({
      next: (response: any) => {
        console.log('searchbynames:', response);
        this.names = response; 
      },
      error: (error: any) => {
        console.error('Error fetching searchbynames data:', error);
      }
    });
  }



}