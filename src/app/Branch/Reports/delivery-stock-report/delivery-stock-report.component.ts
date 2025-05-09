import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-delivery-stock-report',
  templateUrl: './delivery-stock-report.component.html',
  styleUrls: ['./delivery-stock-report.component.scss']
})
export class DeliveryStockReportComponent implements OnInit {
  reportData: any = { formattedBookings: [] };
  pfdata: any;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private api: BranchService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { data: any };
    this.reportData = state?.data?.data || { formattedBookings: [] };
    console.log('pending stock:', this.reportData);
  }

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
    });
  }

  get paginatedBookings() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.reportData?.formattedBookings?.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil((this.reportData?.formattedBookings?.length || 0) / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
