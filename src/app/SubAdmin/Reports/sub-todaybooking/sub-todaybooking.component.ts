
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
@Component({
  selector: 'app-sub-todaybooking',
  templateUrl: './sub-todaybooking.component.html',
  styleUrls: ['./sub-todaybooking.component.scss']
})
export class SubTodaybookingComponent {

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


