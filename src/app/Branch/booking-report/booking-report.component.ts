// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { ColumnFilter } from 'primeng/table';
// import { BranchService } from 'src/app/service/branch.service';

// interface Column {
//   field: string;
//   header: string;
// }

// @Component({
//   selector: 'app-booking-report',
//   templateUrl: './booking-report.component.html',
//   styleUrls: ['./booking-report.component.scss']
// })
// export class BookingReportComponent {
//   data1:any;
//   totalBookings: number = 0;
//   loading: boolean = true;

//   visible: boolean = false;
//   repd:any;
//   showDialog(row: string) {
//   this.visible = true;
//   this.repd = row;
//   console.log(this.repd);
//   }

//   constructor(private api:BranchService, private router:Router){}

//   ngOnInit(){
//     this.getbookingData();
//     this.loadUsers({ first: 0, rows: 10 });
//   }

//   getbookingData() {
//     this.api.GetBookings().subscribe((res: any) => {
//       console.log(res);
      
//       if (Array.isArray(res.data)) {  // Ensure it's an array
//         this.data1 = res.data;
//       } else {
//         console.error("Error: Expected an array but received", res.data);
//         this.data1 = [];  // Prevent issues
//       }
  
//       this.loading = false;
//     });
//   }
  
  

//   orderinvoice(id:any){
//     this.router.navigate(['/printgrn/'+id]);
//   }

 
  
//   loadUsers(event: any) {
//     const first = event.first;  
//     const rows = event.rows;    
//     const page = Math.floor(first / rows) + 1; 
//     const perPage = rows;  
  
//     this.api.BookingsPage(page, perPage).subscribe((res: any) => {
//       console.log(res);
      
//       if (Array.isArray(res.bookings)) {  // Ensure `res.data` is an array
//         this.data1 = res.bookings; 
//         this.totalBookings = res.totalBookings; 
//       } else {
//         console.error("Error: Expected an array but received", res.bookings);
//         this.data1 = [];  // Set an empty array to prevent issues
//       }
//     });
//   }
  
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss'],
})
export class BookingReportComponent {
  data1: any[] = [];
  totalBookings: number = 0;
  loading: boolean = true;

  visible: boolean = false;
  repd: any;

  // Pagination
  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalPages: number = 0;

  constructor(private api: BranchService, private router: Router) {}

  ngOnInit() {
    this.loadUsers(this.currentPage);
  }

  loadUsers(page: number) {
    this.loading = true;

    this.api.BookingsPage(page, this.rowsPerPage).subscribe(
      (res: any) => {
        if (Array.isArray(res.bookings)) {
          this.data1 = res.bookings;
          this.totalBookings = res.totalBookings;
          this.totalPages = Math.ceil(this.totalBookings / this.rowsPerPage);
          this.currentPage = page;
        } else {
          console.error('Expected array, got:', res.bookings);
          this.data1 = [];
        }

        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.error('Error loading bookings:', err);
      }
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadUsers(page);
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  orderinvoice(id: any) {
    this.router.navigate(['/printgrn/' + id]);
  }

  showDialog(row: string) {
    this.visible = true;
    this.repd = row;
    console.log(this.repd);
  }
}

