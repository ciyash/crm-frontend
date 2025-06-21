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
      toCity: ['', Validators.required],
      pickUpBranch: ['', Validators.required],
      dropBranch: ['', Validators.required],
      dispatchType: [''],
      bookingType: ['', Validators.required],
      senderName: ['', Validators.required],
      senderMobile: ['', Validators.required],
      senderAddress: [''],
      senderGST: [''],
      receiverName: ['', Validators.required],
      receiverMobile: ['', Validators.required],
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
    const orderDataToSend = this.packages.value.map((item: any) => ({
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
      console.log('profile', res);
      this.pfdata = res.branchId;
      this.tdata=res.branchId;
      this.brachid=this.tdata.branchUniqueId
      console.log("brachid:",this.brachid);
      
      console.log(this.pfdata, 'branchid');
      this.NumberofBooking(); // 👈 Call it here

    });

  }

  fetchServiceCharges() {
    const fromCity = this.form.get('fromCity')?.value;
    const toCity = this.form.get('toCity')?.value;
    if (fromCity && toCity) {
      this.api.FilterBookingServiceCharges({ fromCity, toCity }).subscribe(
        (res: any) => {
          console.log('Service Charges:', res);

          if (res && res.length > 0) {
            const chargeData = res[0]; // First item in the array
            this.sdata = chargeData.serviceCharge || 0;

            // Update form with service charges and recalculate total
            this.form.patchValue({ serviceCharges: this.sdata });
            this.calculateGrandTotal();
          } else {
            console.warn('No service charge found for the given cities.');
            this.form.patchValue({ serviceCharges: 0 });
            this.calculateGrandTotal();
          }
        },
        (error: any) => {
          console.error('Error fetching service charges:', error);
        }
      );
    } else {
      console.warn('Both fromCity and toCity must be selected.');
    }
  }

  onFromcitySelect(event: any) {
    const cityName = event.target.value;
    if (cityName) {
      this.api.GetBranchbyCity(cityName).subscribe(
        (res: any) => {
          console.log('Branches for selected city:', res);
          this.pdata = res;
          this.fetchServiceCharges();
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
          this.fetchServiceCharges(); // Fetch service charges
        },
        (error: any) => {
          console.error('Error fetching branches:', error);
        }
      );
    } else {
      this.tbcdata = [];
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
      const orderDataToSend = this.packages.value.map((item: any) => ({
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
      const orderDataToSend = this.packages.value.map((item: any) => ({
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
          console.log('Parcel saved successfully:', response);

          if (response?.data?.grnNo) {
            this.gdata = response.data;
            console.log('GRN Number:', this.gdata.grnNo);
            this.toastr.success('Parcel Booked Successfully', 'Success');
            this.router
              .navigateByUrl(`/printgrn/${this.gdata.grnNo}`)
              .then(() => {
                window.location.reload();
              });
          } else {
            console.error('❌ Error: grnNo not found in response.');
            this.toastr.warning(
              'Booking successful, but grnNo is missing.',
              'Warning'
            );
          }
        },
        (error) => {
          console.error('❌ Error saving order:', error);
          this.toastr.error(
            'Failed to book the parcel. Please try again.',
            'Error'
          );
        }
      );
    }
  }
  // search Sender and Receiver Names
  searchUser(): void {
    const searchTerm = this.form.get('senderName')?.value?.trim();
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
  
}