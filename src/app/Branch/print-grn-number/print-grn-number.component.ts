import { Location } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
// import html2canvas from 'html2canvas';
// import * as jspdf from 'jspdf';
 
@Component({
  selector: 'app-print-grn-number',
  templateUrl: './print-grn-number.component.html',
  styleUrls: ['./print-grn-number.component.scss'],
})
export class PrintGrnNumberComponent {
  @Input() grnNo: string = ''; // Receive grnNumber from parent
  qrData: string = '';
  data1: any;
  loading: boolean = false;
  id: any;
  pfdata: any;
  constructor(
    private api: BranchService,
    private activeroute: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit() {
    this.id = this.activeroute.snapshot.params['grnNo'];
    this.api.GetGRNnumber(this.id).subscribe(
      (res: any) => {
        console.log('API Response:', res);
        this.data1 = res?.booking; // ✅ FIXED: assign correct booking data
        if (this.id) {
          this.qrData = String(this.id).trim();
          console.log('QR Data Set:', this.qrData);
        } else {
          console.error('Invalid QR Data:', this.id);
        }
      },
      (err: any) => {
        console.error('Error fetching data:', err);
      }
    );
    this.getProfileData();
  }
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      console.log("res:",res);

      this.pfdata = res;
      
      console.log( 'profiledata:',this.pfdata);
    });
  }
 
printPage() {
  document.title = `LR-${this.data1?.lrNumber || 'Print'}`;
  window.print();
}
 
 
  goBack() {
    this.location.back();
 
  }
}