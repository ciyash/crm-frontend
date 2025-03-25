import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-search-grn-number',
  templateUrl: './search-grn-number.component.html',
  styleUrls: ['./search-grn-number.component.scss']
})
export class SearchGrnNumberComponent {
  searchTerm: string = '';      
  searchResult: any[] = [];
  data2:any;
  idselectmsg: string = '';
  regname: any[] = [];
  errorMessage: string = '';
  updata:any;
  form:FormGroup;
  constructor(private api:BranchService, private activeroute:ActivatedRoute, private fb:FormBuilder, private router:Router){
     this.form = this.fb.group({
            grnNo: ['', Validators.required],
              });
  }

  ngOnInit(): void {
    this.searchTerm = this.activeroute.snapshot.params['grnNo'];
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
  
          // If `res` is an object, extract the data into an array
          if (res && Array.isArray(res.data)) {
            this.data2 = res.data;
            this.errorMessage = '';
          } else if (res && typeof res === 'object') {
            this.data2 = [res]; // Wrap the object into an array
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
