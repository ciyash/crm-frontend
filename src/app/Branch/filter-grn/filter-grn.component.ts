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

  searchUser(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('Search Term:', this.searchTerm);

      this.api.GetGRNnumber(this.searchTerm.trim()).subscribe(
        (res: any) => {
          console.log('API Response:', res);

          if (res && Array.isArray(res.data)) {
            this.data2 = res.data;

            if (this.data2.length > 0) {
              this.branchId = this.data2[0].dropBranch; // Get dropBranch from first item
            }

            this.errorMessage = '';
          } else if (res && typeof res === 'object') {
            this.data2 = [res]; // Wrap the object into an array

            if (res.dropBranch) {
              this.branchId = res.dropBranch;
              console.log('Drop Branch:', this.branchId);
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
    } else {
      this.errorMessage = 'Please enter a valid search term.';
      this.data2 = [];
    }
  }

  

  
}
