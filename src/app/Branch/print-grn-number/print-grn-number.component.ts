import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';
// import html2canvas from 'html2canvas';
// import * as jspdf from 'jspdf';

@Component({
  selector: 'app-print-grn-number',
  templateUrl: './print-grn-number.component.html',
  styleUrls: ['./print-grn-number.component.scss']
})
export class PrintGrnNumberComponent {
  @Input() grnNumber: string = ''; // Receive grnNumber from parent
  qrData: string = '';
  data1: any;
  loading: boolean = false;
id:any;
  constructor(private api: BranchService, private activeroute:ActivatedRoute) {}

  ngOnInit(){
    this.id = this.activeroute.snapshot.params['grnNumber'];
    this.api.GetGRNnumber(this.id).subscribe(
          (res: any) => {
            console.log('API Response:', res);
            this.data1 = res;
            
            if (this.id) {
              this.qrData = String(this.id).trim(); 
              console.log('QR Data Set:', this.qrData);
            } else {
              console.error('Invalid QR Data:', this.grnNumber);
            }
          },
          (err: any) => {
            console.error('Error fetching data:', err);
          }
        );
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['grnNumber'] && this.grnNumber) {
  //     this.loadData(); 
  //   }
  // }

  // loadData() {
  //   this.api.GetGRNnumber(this.grnNumber).subscribe(
  //     (res: any) => {
  //       console.log('API Response:', res);
  //       this.data1 = res;
        
  //       if (this.grnNumber) {
  //         this.qrData = String(this.grnNumber).trim(); 
  //         console.log('QR Data Set:', this.qrData);
  //       } else {
  //         console.error('Invalid QR Data:', this.grnNumber);
  //       }
  //     },
  //     (err: any) => {
  //       console.error('Error fetching data:', err);
  //     }
  //   );
  // }

 

  printPage() {
      window.print()
    
  }
  

}
