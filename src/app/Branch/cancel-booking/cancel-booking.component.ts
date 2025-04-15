import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.scss']
})
export class CancelBookingComponent {
  searchTerm: string = '';      
  searchResult: any[] = [];
  data2:any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  items: any; // Your data object

  updata:any;
  form:FormGroup;
  constructor(private api:BranchService, private activeroute:ActivatedRoute, private fb:FormBuilder, private router:Router){
     this.form = this.fb.group({
            date: ['', Validators.required],
            refundAmount:['', Validators.required],
            refundCharge:[''],
         });
  }

  ngOnInit(): void {
    this.searchTerm = this.activeroute.snapshot.params['grnNo'];
  }


cancel(id:any){
  const value={
    date:this.form.value.date,
    refundAmount:this.form.value.refundAmount,
    refundCharge:this.form.value.refundCharge
  }
  this.api.cancelBooking(id,value).subscribe((res:any)=>{

  })

}



  updateParcelStatus(grnNo: string) {
    const payload = {
      grnNo: grnNo, 
    };
    console.log('Final Payload:', payload);
    this.api.ReceivedParcelUpdate(payload).subscribe(
      (res: any) => {
        console.log('Update Status:', res);
        this.updata = res;
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/booking']);
          });
        }, 500);
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }
  
  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('Search Term:', this.searchTerm);
      this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log('API Response:', res);
            if (res && Array.isArray(res.data)) {
            this.data2 = res.data;
            console.log("data2:",this.data2)
            this.errorMessage = '';
          } else if (res && typeof res === 'object') {
            this.data2 = [res]; // Wrap the object into an array
            this.errorMessage = '';
            console.log("this data is :",this.data2);
            
          } else {
            this.data2 = [];
            this.errorMessage = 'No results found for the given search term.';
          }
        },
        (err: any) => {
          this.errorMessage = err.error?.message || 'An error occurred while searching.';
          this.data2 = [];
        }
      );
    } else {
      this.errorMessage = 'Please enter a valid search term.';
      this.data2 = [];
    }
  }


  

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Booking Branch';
      case 1:
        return 'Departed / Shipped';
      case 2:
        return 'Arrived at Delivery App';
      case 3:
        return 'Parcel Missing';
      case 4:
        return 'Delivered';
      case 5:
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  }


  // TrackBy function for performance optimization
  trackByFn(index: number, item: any): number {
    return index; // Or use a unique identifier from item, e.g., item.id
  }
  
}
  


