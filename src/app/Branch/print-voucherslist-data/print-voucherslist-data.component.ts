import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-print-voucherslist-data',
  templateUrl: './print-voucherslist-data.component.html',
  styleUrls: ['./print-voucherslist-data.component.scss']
})
export class PrintVoucherslistDataComponent {
    searchTerm: string = '';      
    searchResult: any[] = [];
    data2: any;
    branchData: any;
    branchId: string | undefined;
  getgrndata: any;
  
    constructor(private api: BranchService, private activeroute: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.searchTerm = this.activeroute.snapshot.params['vocherNoUnique'];
      this.api.GetVouchersListData(this.searchTerm).subscribe((res:any)=>{
        console.log('getgrndata',res);
        this.getgrndata=res
      })
    }
    getBranchDetails(): void {
      if (!this.branchId) {
        console.error('Branch ID is not provided.');
        return;
      }
      this.api.getbranchId(this.branchId).subscribe({
        next: (res: any) => {
          console.log('Branch Data:', res);
          this.branchData = res;
        },
        error: (err: any) => {
          console.error('Error fetching branch data:', err);
        }
      });
    }
  
    getGrandTotal(packages: any[]): number {
      return packages.reduce((sum, pkg) => sum + (pkg.totalPrice || 0), 0);
  }
  
  getTotalQuantity(packages: any[]): number {
      return packages.reduce((sum, pkg) => sum + (pkg.quantity || 0), 0);
  }

  getToPayCount(bookingDetails: any[] = []): number {
    return bookingDetails.filter(booking => booking.bookingType === "toPay").length;
}
getPaidCount(bookingDetails: any[] = []): number {
  return bookingDetails.filter(booking => booking.bookingType === "paid").length;
}







}
