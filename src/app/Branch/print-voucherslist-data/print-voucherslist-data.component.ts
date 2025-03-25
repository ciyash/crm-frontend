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
  
    constructor(private api: BranchService, private activeroute: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.searchTerm = this.activeroute.snapshot.params['vocherNoUnique'];
      this.api.GetVouchersListData(this.searchTerm).subscribe((res:any)=>{
        console.log('getgrndata',res);
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
  

}
