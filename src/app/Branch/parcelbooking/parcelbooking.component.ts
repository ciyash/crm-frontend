import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { HeaderComponent } from '../../USER/header/header.component';
import { AdminService } from 'src/app/service/admin.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare const SlimSelect: any;
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-parcelbooking',
  templateUrl: './parcelbooking.component.html',
  styleUrls: ['./parcelbooking.component.scss'],
})
export class ParcelbookingComponent {
  @ViewChild('selectElem') selectElem!: ElementRef;
  @ViewChild('pickupbranch') pickupbranch!: ElementRef;
  @ViewChild('selectElem2') selectElem2!: ElementRef;
  @ViewChild('droupbranch') droupbranch!: ElementRef;
  @ViewChild('Company') Company!: ElementRef;
  adminData: any;
  form!: FormGroup;
  showTable: boolean = false;
  id: any;
  citydata: any;
  branchdata: any;
  bdata: any[] = [];
  totalPrice: any;
  total1: any;
  pfdata: any;
  bookingSuccess: boolean = false;
  gdata: any;
  packdata: any;
  fbcdata: any;
  tbcdata: any;
  pdata: any;
  form1: FormGroup;
  sdata: number = 0;
  searchTerm: string = ''; // For binding with input field
  searchResult: any[] = [];
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  userList: any[] = [];
  showDropdown: boolean = true;
  dptype: any;
  cdata: any;
  grnNo: any;
  grnnumber: any;
  onPickupBranchSelect: any;
  onDropBranchSelect: any;
  modelData: any;
  showModal: boolean = false;
  companyList: any;
  updateid: any;
  mogoId: any;
  form2:FormGroup
  today = new Date();
  brachid: any;
  tdata: any;
  Ttotal: any;
  showFOCOption = true;
  selectedBookingType: string = '';
   disableUnitPrice: boolean = false;   // For readonly input control
  hideChargesRow: boolean = false;
  constructor(
    private fb: FormBuilder,
    private api: BranchService,
    private token: TokenService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private admin: AdminService
  ) {
    this.form = this.fb.group({
      fromCity: ['', Validators.required],
      receiverMobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  senderMobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      toCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
      dropBranch: ['', Validators.required],
      dispatchType: [''],
      bookingType: ['', Validators.required],
      senderName: ['', Validators.required],
    //  senderMobile: ['', Validators.required],
      senderAddress: [''],
      senderGST: [''],
      receiverName: ['', Validators.required],
      // receiverMobile: ['', Validators.required],
      receiverAddress: [''],
      receiverGst: [''],
      serviceCharges: [0], // ₹10 per item
      hamaliCharges: [0],
      doorDeliveryCharges: [0],
      doorPickupCharges: [0],
      valueOfGoods: [''],
      grandTotal: [''],
      agent: [''],
      packages: this.fb.array([]),
    });
    this.form1 = this.fb.group({
      fromCity: [''],
      toCity: ['', Validators.required],
    });
    this.form2=this.fb.group({
      bookingDate:['',Validators.required],
      pickupBranch:['',Validators.required]
    })
  }

  ngOnInit() {
    this.NumberofBooking();

    this.form.get('bookingType')?.valueChanges.subscribe((val: string) => {
    this.disableUnitPrice = (val === 'FOC');
    this.hideChargesRow = (val === 'FOC');
    const packagesArray = (this.form.get('packages') as FormArray).controls;
    if (val === 'FOC') {
      for (let pkg of packagesArray) {
        pkg.get('unitPrice')?.setValue(0);
      }
      this.form.get('serviceCharges')?.setValue(0); // Force serviceCharges = 0
    } else {
      // If from-to cities already selected, fetch charges again
      const fromCity = this.form.get('fromCity')?.value;
      const toCity = this.form.get('toCity')?.value;
      if (fromCity && toCity) {
        this.fetchServiceCharges(); // Get correct charges based on cities
      }
    }
  });
  // Optionally: Fetch service charges automatically when cities change
  this.form.get('fromCity')?.valueChanges.subscribe(() => this.fetchServiceCharges());
  this.form.get('toCity')?.valueChanges.subscribe(() => this.fetchServiceCharges());

    this.grnNo = '';
    this.route.paramMap.subscribe((params) => {
      this.grnNo = params.get('grnNo');
      console.log('updateid:', this.grnNo);
      if (this.grnNo) {
        this.api.GetGRNnumber(this.grnNo).subscribe((res: any) => {
          console.log('Booking', res);
          this.gdata = res;
          this.mogoId = res.booking._id;
          console.log('mogoId:', this.mogoId);
          const booking = res.booking;
          // Patch main form fields
          this.form.patchValue({
            fromCity: booking.fromCity,
            toCity: booking.toCity,
            pickUpBranch: booking.pickUpBranch,
            dropBranch: booking.dropBranch,
            dispatchType: booking.dispatchType,
            bookingType: booking.bookingType,
            agent: booking.agent,
            senderName: booking.senderName,
            senderMobile: booking.senderMobile,
            senderAddress: booking.senderAddress,
            senderGST: booking.senderGst,
            receiverName: booking.receiverName,
            receiverMobile: booking.receiverMobile,
            receiverAddress: booking.receiverAddress,
            receiverGST: booking.receiverGst,
            serviceCharges: booking.serviceCharges,
            hamaliCharges: booking.hamaliCharges,
            doorDeliveryCharges: booking.doorDeliveryCharges,
            doorPickupCharges: booking.doorPickupCharges,
            valueOfGoods: booking.valueOfGoods,
            grandTotal: booking.grandTotal,
          });

          // Clear and refill the packages FormArray
          const packageFGs = booking.packages.map((p: any) =>
            this.fb.group({
              quantity: [p.quantity],
              packageType: [p.packageType],
              contains: [p.contains],
              weight: [p.weight],
              unitPrice: [p.unitPrice],
              totalPrice: [p.totalPrice],
            })
          );

          const packageFormArray = this.fb.array(packageFGs);
          this.form.setControl('packages', packageFormArray);
        });
      }
    });

    this.getAllCompany();
    this.api.GetCities().subscribe((res: any) => {
      console.log('citys', res);
      this.citydata = res;
    });
    //get branches
    this.api.GetBranch().subscribe((res: any) => {
      console.log(res);
      this.branchdata = res;
    });
    //get Packages
    this.api.GetPAckagesType().subscribe((res: any) => {
      console.log(res);
      this.packdata = res;
      console.log('packageData:', this.packdata);
    });

    this.admin.GetDispatchtypeData().subscribe((res: any) => {
      console.log(res);
      this.dptype = res;
    });

    this.getProfileData();
    this.addOrderItem();

    this.form.get('bookingType')?.valueChanges.subscribe((value) => {
      console.log('Booking type changed to:', value);
      if (value !== 'credit') {
        this.form.patchValue({
          agent: '', // Clear selected company
          senderName: '',
          senderMobile: '',
          senderAddress: '',
          senderGST: '',
        });
        console.log('Sender info and company selection cleared.');
      }
    });
  }
  BookingId() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // highlight validation errors
      console.warn('Form is invalid. Please fill all required fields.');
      return;
    }
   const orderDataToSend = (this.form.get('packages') as FormArray).getRawValue().map((item: any) => ({
      quantity: item.quantity,
      packageType: item.packageType,
      contains: item.contains,
      weight: item.weight,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    const pickupBranchId = this.form.value.pickUpBranch;
    const dropBranchId = this.form.value.dropBranch;

    const pickupBranchName =
      this.pdata.find((b: any) => b.branchUniqueId === pickupBranchId)?.name ||
      'N/A';
    const dropBranchName =
      this.tbcdata.find((b: any) => b.branchUniqueId === dropBranchId)?.name ||
      'N/A';

    const val: any = {
      fromCity: this.form.value.fromCity,
      toCity: this.form.value.toCity,
      pickUpBranchName: pickupBranchName,
      dropBranchName: dropBranchName,
      pickUpBranch: pickupBranchId,
      dropBranch: dropBranchId,
      dispatchType: this.form.value.dispatchType,
      bookingType: this.form.value.bookingType,
      senderName: this.form.value.senderName,
      senderMobile: this.form.value.senderMobile,
      senderAddress: this.form.value.senderAddress,
      senderGst: this.form.value.senderGST || '',
      receiverName: this.form.value.receiverName,
      receiverMobile: this.form.value.receiverMobile,
      receiverAddress: this.form.value.receiverAddress,
      receiverGst: this.form.value.receiverGST || '',
      packages: orderDataToSend,
      serviceCharges: this.form.value.serviceCharges,
      hamaliCharges: this.form.value.hamaliCharges,
      doorDeliveryCharges: this.form.value.doorDeliveryCharges,
      doorPickupCharges: this.form.value.doorPickupCharges,
      valueOfGoods: this.form.value.valueOfGoods,
      grandTotal: this.form.value.grandTotal,
      agent: this.form.value.agent || '',
    };
    console.log('payload', val);

    if (!this.mogoId) {
      console.error('No ID to update');
      return;
    }

    this.api.BookingId(this.mogoId, val).subscribe({
      next: (res: any) => {
        console.log('Booking updated:', res);
        this.gdata = res;
        this.toastr.success(res.message, 'Success');
        this.router.navigateByUrl(`/booking`).then(() => {
          // window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error updating booking:', error);
        this.toastr.success(error.message, 'Success');
      },
    });
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Only digits (0–9)
    }
  }
  searchUser(): void {
    const searchTerm = this.form.get('senderName')?.value?.trim();
  
    // ✅ Check required dropdowns are selected
    const fromCity = this.form.get('fromCity')?.value;
    const toCity = this.form.get('toCity')?.value;
    const pickUpBranch = this.form.get('pickUpBranch')?.value;
    const dropBranch = this.form.get('dropBranch')?.value;
  
    const allSelected = fromCity && toCity && pickUpBranch && dropBranch;
  
    if (!allSelected) {
      console.warn('Please select From City, To City, Pickup Branch, and Drop Branch before searching.');
      this.userList = [];
      this.showDropdown = false;
      return;
    }
  
    if (searchTerm) {
      this.api.searchUser(searchTerm).subscribe(
        (res: any) => {
          console.log('API Response:', res);
          this.userList = res?.results?.length ? res.results : [];
          this.showDropdown = this.userList.length > 0;
        },
        (err: any) => {
          console.error('Search Error:', err);
          this.userList = [];
          this.showDropdown = false;
        }
      );
    } else {
      this.userList = [];
      this.showDropdown = false;
    }
  }

 
  

  ngAfterViewInit(): void {
    setTimeout(() => {
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

      // Initialize Select2 for Drop Branch
      $(this.droupbranch.nativeElement).select2();
      $(this.droupbranch.nativeElement).on('select2:select', (event: any) => {
        const selectedDropBranch = event.params.data.id;
        console.log('Selected Drop Branch:', selectedDropBranch);
        this.form.patchValue({ dropBranch: selectedDropBranch });
        console.log('Updated form value:', this.form.value);
        this.onDropBranchSelect({ target: { value: selectedDropBranch } });
      });
    }, 0);
  }



getProfileData() {
  this.api.GetProfileData().subscribe((res: any) => {
    const branchObj = res.branchId;
    this.pfdata = branchObj;
    this.brachid = branchObj.branchUniqueId;

    const fromCity = branchObj.city;
    const pickUpBranchId = branchObj.branchUniqueId;

    console.log("Profile From City:", fromCity);
    console.log("Pickup Branch ID:", pickUpBranchId);

    this.form.patchValue({
      fromCity: fromCity,
      pickUpBranch: pickUpBranchId
    });

    // Fetch branches for that city and populate pickupBranch list
    if (fromCity) {
      this.api.GetBranchbyCity(fromCity).subscribe(
        (res: any) => {
          this.pdata = res;

          // ✅ If current profile branch exists in list, keep it selected
          const match = this.pdata.find((branch: { branchUniqueId: any; }) => branch.branchUniqueId === pickUpBranchId);
          if (!match && this.pdata.length > 0) {
            this.form.patchValue({ pickUpBranch: this.pdata[0].branchUniqueId });
          }

          setTimeout(() => {
            $(this.pickupbranch.nativeElement).trigger('change.select2');
            $(this.selectElem.nativeElement).trigger('change.select2');
          }, 0);

          this.fetchServiceCharges();
        },
        (error: any) => {
          console.error('Error fetching branches in getProfileData:', error);
        }
      );
    }

    this.NumberofBooking();
  });
}



  fetchServiceCharges() {
  const fromCity = this.form.get('fromCity')?.value;
  const toCity = this.form.get('toCity')?.value;

  if (fromCity && toCity) {
    this.api.FilterBookingServiceCharges({ fromCity, toCity }).subscribe(
      (res: any) => {
        if (res && res.length > 0) {
          const chargeData = res[0];
          this.sdata = chargeData.serviceCharge || 0;

          // ✅ Check if FOC selected, set 0; else use API value
          const bookingType = this.form.get('bookingType')?.value;
          const updatedCharge = bookingType === 'FOC' ? 0 : this.sdata;

          this.form.patchValue({ serviceCharges: updatedCharge });
          this.calculateGrandTotal();
        } else {
          console.warn('No service charge found for cities');
          this.form.patchValue({ serviceCharges: 0 });
          this.calculateGrandTotal();
        }
      },
      (error: any) => {
        console.error('Error fetching service charges:', error);
      }
    );
  }
}


  // onFromcitySelect(event: any) {
  //   const cityName = event.target.value;
  //   if (cityName) {
  //     this.api.GetBranchbyCity(cityName).subscribe(
  //       (res: any) => {
  //         console.log('Branches for selected city:', res);
  //         this.pdata = res;
  //         this.fetchServiceCharges();
  //       },
  //       (error: any) => {
  //         console.error('Error fetching branches:', error);
  //       }
  //     );
  //   } else {
  //     this.pdata = [];
  //   }
  // }
  onFromcitySelect(event: any) {
    const cityName = event.target.value;
    this.form.get('pickUpBranch')?.reset(); // clear pickup branch
    this.pdata = [];
  
    if (cityName) {
      this.api.GetBranchbyCity(cityName).subscribe(
        (res: any) => {
          this.pdata = res;
  
          if (this.pdata.length > 0) {
            const defaultBranchId = this.pdata[0].branchUniqueId;
            this.form.patchValue({ pickUpBranch: defaultBranchId });
          }
  
          setTimeout(() => {
            $(this.pickupbranch.nativeElement).trigger('change.select2');
          }, 0);
  
          this.fetchServiceCharges();
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    }
  }
  
  
  onTocitySelect(event: any) {
    const selectedToCity = event.target.value;
  
    if (selectedToCity) {
      this.api.GetBranchbyCity(selectedToCity).subscribe(
        (res: any) => {
          console.log('Drop branches for selected ToCity:', res);
          this.tbcdata = res;
  
          // If only 1 branch is found, you can optionally auto-select
          if (this.tbcdata.length === 1) {
            this.form.patchValue({ dropBranch: this.tbcdata[0].branchUniqueId });
          }
  
          // Refresh Select2
          setTimeout(() => {
            $(this.droupbranch.nativeElement).trigger('change.select2');
          }, 0);
        },
        (err) => {
          console.error('Error fetching drop branches:', err);
          this.tbcdata = [];
        }
      );
    } else {
      this.tbcdata = [];
      this.form.get('dropBranch')?.reset();
    }
  }
  

  get packages(): FormArray {
    return this.form.get('packages') as FormArray;
  }

  addOrderItem() {
    this.packages.push(
      this.fb.group({
        quantity: [1, Validators.required],
        packageType: ['', Validators.required],
        unitPrice: [0, Validators.required],
        contains: [''],
        weight: [],
        totalPrice: [0],
      })
    );
    this.calculateGrandTotal();
  }

  removeBarcodeData(index: number) {
    this.packages.removeAt(index);
    this.calculateGrandTotal();
  }

  calculateTotal(index: number) {
    const packageArray = this.form.get('packages') as FormArray;
    const packageForm = packageArray.at(index);
    const quantity = packageForm.get('quantity')?.value || 0;
    const unitPrice = packageForm.get('unitPrice')?.value || 0;
    const totalPrice = quantity * unitPrice;
    packageForm.get('totalPrice')?.setValue(totalPrice);

    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    const packageArray = this.form.get('packages') as FormArray;

    // Calculate total price from all packages
    let totalValue = 0;
    packageArray.controls.forEach((pkg) => {
      totalValue += pkg.get('totalPrice')?.value || 0;
    });

    // Get charges from form inputs
    const serviceCharges = this.form.get('serviceCharges')?.value || 0;
    const hamaliCharges = this.form.get('hamaliCharges')?.value || 0;
    const doorDeliveryCharges =
      this.form.get('doorDeliveryCharges')?.value || 0;
    const doorPickupCharges = this.form.get('doorPickupCharges')?.value || 0;

    // Calculate Grand Total
    const grandTotal =
      totalValue +
      serviceCharges +
      hamaliCharges +
      doorDeliveryCharges +
      doorPickupCharges;

    // Update Grand Total without triggering another event
    this.form.get('grandTotal')?.setValue(grandTotal, { emitEvent: false });
  }

  openPreviewModal() {
    if (this.form.valid) {
      const orderDataToSend = (this.form.get('packages') as FormArray).getRawValue().map((item: any) => ({
        quantity: item.quantity,
        packageType: item.packageType,
        contains: item.contains,
        weight: item.weight,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));

      const pickupBranchId = this.form.value.pickUpBranch;
      const dropBranchId = this.form.value.dropBranch;

      const pickupBranchName =
        this.pdata.find((b: any) => b.branchUniqueId === pickupBranchId)
          ?.name || 'N/A';
      const dropBranchName =
        this.tbcdata.find((b: any) => b.branchUniqueId === dropBranchId)
          ?.name || 'N/A';

      this.modelData = {
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        pickUpBranch: pickupBranchId,
        dropBranch: dropBranchId,
        pickUpBranchName: pickupBranchName,
        dropBranchName: dropBranchName,
        dispatchType: this.form.value.dispatchType,
        bookingType: this.form.value.bookingType,
        senderName: this.form.value.senderName,
        senderMobile: this.form.value.senderMobile,
        senderAddress: this.form.value.senderAddress,
        senderGst: this.form.value.senderGST || '',
        receiverName: this.form.value.receiverName,
        receiverMobile: this.form.value.receiverMobile,
        receiverAddress: this.form.value.receiverAddress,
        receiverGst: this.form.value.receiverGST || '',
        packages: orderDataToSend,
        serviceCharges: this.form.value.serviceCharges,
        hamaliCharges: this.form.value.hamaliCharges,
        doorDeliveryCharges: this.form.value.doorDeliveryCharges,
        doorPickupCharges: this.form.value.doorPickupCharges,
        valueOfGoods: this.form.value.valueOfGoods,
        grandTotal: this.form.value.grandTotal,
        agent: this.form.value.agent,
      };

      // Then open modal using Bootstrap JS if needed (or it's already bound by button trigger)
      console.log('Preview Data:', this.modelData);
    } else {
      this.toastr.warning(
        'Please fill all required fields before previewing.',
        'Form Incomplete'
      );
    }
  }

  confirmBooking() {
    if (!this.grnNo) {
      this.add();
    }
    this.BookingId();
  }

  add() {
    console.log('Form Data Before Submission:', this.form.value);

    if (this.form.valid) {
      const orderDataToSend = (this.form.get('packages') as FormArray).getRawValue().map((item: any) => ({
        quantity: item.quantity,
        packageType: item.packageType,
        contains: item.contains,
        weight: item.weight,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));
      const pickupBranchId = this.form.value.pickUpBranch;
      const dropBranchId = this.form.value.dropBranch;

      // Find branch names by ID
      const pickupBranchName =
        this.pdata.find((b: any) => b.branchUniqueId === pickupBranchId)
          ?.name || 'N/A';
      const dropBranchName =
        this.tbcdata.find((b: any) => b.branchUniqueId === dropBranchId)
          ?.name || 'N/A';
      const val: any = {
        fromCity: this.form.value.fromCity,
        toCity: this.form.value.toCity,
        pickUpBranchName: pickupBranchName,
        dropBranchName: dropBranchName,
        pickUpBranch: this.form.value.pickUpBranch || 'N/A',
        dropBranch: this.form.value.dropBranch,
        dispatchType: this.form.value.dispatchType,
        bookingType: this.form.value.bookingType,
        senderName: this.form.value.senderName,
        senderMobile: this.form.value.senderMobile,
        senderAddress: this.form.value.senderAddress,
        senderGst: this.form.value.senderGST || '', // Default empty string
        receiverName: this.form.value.receiverName,
        receiverMobile: this.form.value.receiverMobile,
        receiverAddress: this.form.value.receiverAddress,
        receiverGst: this.form.value.receiverGST || '', // Default empty string
        packages: orderDataToSend,
        serviceCharges: this.form.value.serviceCharges,
        hamaliCharges: this.form.value.hamaliCharges,
        doorDeliveryCharges: this.form.value.doorDeliveryCharges,
        doorPickupCharges: this.form.value.doorPickupCharges,
        valueOfGoods: this.form.value.valueOfGoods,
        grandTotal: this.form.value.grandTotal,
        agent: this.form.value.agent,
      };

      console.log('Final Data to Submit:', val);

      this.modelData = val;
      this.api.createBooking(val).subscribe(
        (response: any) => {
          console.log('✅ Parcel saved successfully:', response);
      
          if (response?.success) {
            this.toastr.success(response.message || 'Booking successful', 'Success');
          }
      
          if (response?.data?.grnNo) {
            this.gdata = response.data;
            console.log('📦 GRN Number:', this.gdata.grnNo);
            this.router.navigateByUrl(`/printgrn/${this.gdata.grnNo}`).then(() => {
              window.location.reload();
            });
          } else {
            console.warn('⚠️ Booking success, but GRN number missing.');
            this.toastr.warning('Booking done, but GRN number missing', 'Warning');
          }
        },
        (error) => {
          console.error('❌ Error saving order:', error);
          const errorMsg = error?.error?.message || 'Booking failed. Please try again.';
          this.toastr.error(errorMsg, 'Error');
        }
      );
      

      // this.api.createBooking(val).subscribe(
      //   (response: any) => {
      //     console.log('Parcel saved successfully:', response);

      //     if (response?.data?.grnNo) {
      //       this.gdata = response.data;
      //       console.log('GRN Number:', this.gdata.grnNo);
      //       this.toastr.success(response.message);
      //       this.router
      //         .navigateByUrl(`/printgrn/${this.gdata.grnNo}`)
      //         .then(() => {
      //           window.location.reload();
      //         });
      //     } else {
      //       console.error('❌ Error: grnNo not found in response.');
      //       this.toastr.warning(
      //         'Booking successful, but grnNo is missing.',
      //         'Warning'
      //       );
      //     }
      //   },
      //   (error) => {
      //     console.error('❌ Error saving order:', error);
      //     this.toastr.error(response.error
      //     );
      //   }
      // );
    }
  }

  selectUser(user: any): void {
    this.form.patchValue({
      senderName: user.name || '',
      senderMobile: user.phone || '',
      senderAddress: user.address || '',
      senderGST: user.gst || '',
    });

    console.log('sender-address:', this.form.get('senderAddress')?.value);
    console.log('sender-mobile:', this.form.get('senderMobile')?.value);

    this.showDropdown = false;
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Small delay to allow selection click
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

  getAllCompany(): void {
    this.api.GetcfmasterData().subscribe(
      (res: any) => {
        this.companyList = res.data;
        console.log('comapany:', this.companyList);
      },
      (err: any) => {
        console.error('Error fetching company data:', err);
      }
    );
  }

  onCompanySelect(event: any): void {
    const selectedCompanyName = event.target.value;
    console.log('Selected company name:', selectedCompanyName);
    const selectedCompany = this.companyList.find(
      (company: { name: string }) => company.name === selectedCompanyName
    );
    console.log('Selected company object:', selectedCompany);
    if (selectedCompany) {
      this.form.patchValue({
        senderName: selectedCompany.senderName || '',
        senderMobile: selectedCompany.senderMobile || '',
        senderAddress: selectedCompany.address || '',
        senderGST: selectedCompany.gst || '',
      });
      console.log('Auto-filled address:', selectedCompany.address);
    }
  }
  

  NumberofBooking() {
    const payload = {
      bookingDate: this.today.toISOString().split('T')[0],
      pickupBranch: this.brachid
    };
  
    console.log('Payload:', payload);
  
    this.api.GetTotal(payload).subscribe({
      next: (res: any) => {
        this.Ttotal=res
        console.log('Total bookings response:', res);
      },
      error: (err) => {
        console.error('Error fetching total bookings:', err);
      }
    });
  }

 onBookingTypeChange(event: any) {
  const value = event.target.value;
  this.selectedBookingType = value;

  if (value === 'FOC') {
    this.disableUnitPrice = true;
    this.hideChargesRow = true;

    // Set unitPrice = 0 for all packages
    const packagesArray = (this.form.get('packages') as FormArray).controls;
    for (let pkg of packagesArray) {
      pkg.get('unitPrice')?.setValue(0);
    }

    // Set serviceCharges = 0
    this.form.get('serviceCharges')?.setValue(0);

  } else {
    this.disableUnitPrice = false;
    this.hideChargesRow = false;

    // Restore default serviceCharges = 10
    this.form.get('serviceCharges')?.setValue(10);
  }
}


disableUnitPricesInPackages() {
 const packagesArray = (this.form.get('packages') as FormArray).controls;
  for (let pkg of packagesArray) {
     pkg.get('unitPrice')?.disable();
  }
}

enableUnitPricesInPackages() {
  const packagesArray = (this.form.get('packages') as FormArray).controls;
  for (let pkg of packagesArray) {
    pkg.get('unitPrice')?.enable(); // ✅ Correct: ENABLE
  }
}
  
}