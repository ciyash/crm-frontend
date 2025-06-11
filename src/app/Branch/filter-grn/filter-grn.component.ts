import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-filter-grn',
  templateUrl: './filter-grn.component.html',
  styleUrls: ['./filter-grn.component.scss']
})
export class FilterGrnComponent implements OnInit {

  searchTerm: string = '';      
  searchResult: any[] = [];
  data2: any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  branchData: any;
  branchId: string | undefined;

  constructor(private api: BranchService, private activeroute: ActivatedRoute) {}

  ngOnInit(): void {
    this.searchTerm = this.activeroute.snapshot.params['grnNo'];
  }
  searchUser(searchInput: any): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      searchInput.control.markAsTouched();
      this.errorMessage = 'Please enter a valid GRN Number.';
      this.data2 = [];
      return;
    }
  
    console.log('Search Term:', this.searchTerm);
  
    this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
      (res: any) => {
        console.log('API Response:', res);
  
        if (res && Array.isArray(res.data)) {
          this.data2 = res.data;
          if (this.data2.length > 0) {
            this.branchId = this.data2[0].dropBranch;
          }
          this.errorMessage = '';
        } else if (res && typeof res === 'object' && res.booking) {
          this.data2 = [res.booking]; // ✅ correct
          if (res.booking.dropBranch) {
            this.branchId = res.booking.dropBranch;
          }
          this.errorMessage = '';
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
  }
  
  
  
}
