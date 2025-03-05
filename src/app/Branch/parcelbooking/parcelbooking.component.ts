import { Component,OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BranchService } from 'src/app/service/branch.service';
@Component({
  selector: 'app-parcelbooking',
  templateUrl: './parcelbooking.component.html',
  styleUrls: ['./parcelbooking.component.scss'],
})
export class ParcelbookingComponent {
  formRows: any[] = [];
  adminData: any;
  bookingForm!: FormGroup;
  showTable: boolean = false;

  constructor(private fb: FormBuilder, private service: BranchService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.adminData = this.service.getAdminData();
    console.log('Admin Data:', this.adminData);
    this.initForm();
  }

    initForm() {
      this.bookingForm = this.fb.group({
        senderName: ['', Validators.required],
        senderMobile: ['', Validators.required],
        senderAddress: ['', Validators.required],  
        senderGST: ['', Validators.required],  
        receiverName: ['', Validators.required],
        receiverMobile: ['', Validators.required],
        receiverAddress: ['', Validators.required],
        ReceiverGST: ['', Validators.required],
        fromCity: ['', Validators.required],  
        toCity: ['', Validators.required],    
        pickUpBranch: ['', Validators.required],
        dropBranch: ['', Validators.required],
        dispatchType: ['', Validators.required],
        bookingType: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        packageType: ['', Validators.required],
        contains: [0],
        weight: ['', Validators.required],
        unitPrice: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        totalPrice: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        serviceCharge: [50],  
        hamaliCharge: [30],    
        doorDeliveryCharge: [20],
        doorPickupCharge: [25],
        valueOfGoods: [5000],
        receiptNo: [''],
        eWayBillNo: [''],
        parcelGst: [0],
        Remark: [''],
      });
    }
  onSubmit() {
    console.log("Submit button clicked!"); 
    if (!this.showTable) {
      this.showTable = true; 
    }
    this.cdr.detectChanges(); 
  }

  addRow() {
    this.formRows.push({});
    this.cdr.detectChanges();
  }

  deleteRow(index: number) {
    this.formRows.splice(index, 1);
  }

  onBook() {
  
    const formValues = this.bookingForm.value;

    const bookingData = {
      adminId: this.adminData?.id || '', 
      adminUniqueId: this.adminData?.uniqueId || '', 
      fromCity: formValues.fromCity,
      toCity: formValues.toCity,
      pickUpBranch: formValues.pickUpBranch,
      dropBranch: formValues.dropBranch,
      location: this.adminData?.branch || '', 
      dispatchType: formValues.dispatchType,
      bookingType: formValues.bookingType,

      quantity: formValues.quantity,
      packageType: formValues.packageType,
      contains: formValues.contains || 0,
      weight: formValues.weight,
      unitPrice: formValues.unitPrice,
      totalPrice: formValues.totalPrice,
      
      senderName: formValues.senderName,
      senderMobile: formValues.senderMobile,
      senderAddress: formValues.senderAddress,
      receiverName: formValues.receiverName,
      receiverMobile: formValues.receiverMobile,
      receiverAddress: formValues.receiverAddress,
      serviceCharge: formValues.serviceCharge || 50,  
      hamaliCharge: formValues.hamaliCharge || 30,    
      doorDeliveryCharge: formValues.doorDeliveryCharge || 20,
      doorPickupCharge: formValues.doorPickupCharge || 25,
      valueOfGoods: formValues.valueOfGoods || 5000,
      bookingStatus: 0, 
      receiptNo: formValues.receiptNo || '',
      eWayBillNo: formValues.eWayBillNo || '',
      parcelGst: formValues.parcelGst || 0,
      receiverGst:formValues.receiverGst
    };

    console.log("Final Booking Data:", bookingData);

    this.service.postData('booking', bookingData).subscribe({
      next: (response: any) => {
        console.log('Booking successful:', JSON.stringify(response, null, 2));
        alert('Booking Successful!');
        this.bookingForm.reset();
      },
      error: (error: any) => {
        console.error('Booking failed:', JSON.stringify(error, null, 2));
        alert('Booking Failed. Please try again.');
      }
    });
  }
}