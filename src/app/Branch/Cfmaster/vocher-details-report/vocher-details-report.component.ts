

import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-vocher-details-report',
  templateUrl: './vocher-details-report.component.html',
  styleUrls: ['./vocher-details-report.component.scss']
})
export class VocherDetailsReportComponent implements OnInit {
  pfdata: any;
  today = new Date();
  vocherReport: any = null;

  constructor(private api: BranchService) {}

  ngOnInit(): void {
    this.loadVoucherDetails();
    this.getProfileData();
  }

  loadVoucherDetails(): void {
    try {
      const data = localStorage.getItem('voucherDetails');
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('Loaded voucher data:', parsedData);

        this.vocherReport = parsedData;
      } else {
        console.warn('No voucher data found in localStorage');
      }
    } catch (error) {
      console.error('Error parsing voucher details from localStorage:', error);
    }
  }

  getProfileData(): void {
    this.api.GetProfileData().subscribe({
      next: (res: any) => {
        this.pfdata = res;
      },
      error: (err: any) => {
        console.error('Failed to load profile data:', err);
      }
    });
  }
}

