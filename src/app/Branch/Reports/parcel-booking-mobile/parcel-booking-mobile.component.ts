import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-parcel-booking-mobile',
  templateUrl: './parcel-booking-mobile.component.html',
  styleUrls: ['./parcel-booking-mobile.component.scss']
})
export class ParcelBookingMobileComponent {
  data: any[] = []; // Renamed from data6 to data
  today = new Date();
  fromDate: string | null = null;
  toDate: string | null = null;
  printBy: string = 'Unknown';
  pfdata: any;
  mdata: any;

  constructor(private router: Router,private api:BranchService) {
    const navigation = this.router.getCurrentNavigation();
    const stateData = navigation?.extras?.state?.['data6']; // Adjust key if needed

    this.mdata=stateData;

    console.log("mobile report:",this.mdata)
 

  }

  ngOnInit(){
    this.getProfileData()
  }
    getProfileData() {
      this.api.GetProfileData().subscribe((res: any) => {
        this.pfdata = res;
        console.log( 'profiledata:',this.pfdata);
      });
    }

    printReport() {
      const printContents = document.getElementById('print-section')?.innerHTML;
      if (printContents) {
        const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin!.document.open();
        popupWin!.document.write(`
          <html>
            <head>
              <title>Print Report</title>
              <style>
                /* You can include more styles here as needed */
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
    
                table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 12px;
                }
    
                th, td {
                  border: 1px solid #000;
                  padding: 4px;
                  text-align: center;
                }
    
                h4, h6, p {
                  margin: 4px 0;
                }
    
                .text-center {
                  text-align: center;
                }
    
                .fw-bold {
                  font-weight: bold;
                }
    
                .text-decoration-underline {
                  text-decoration: underline;
                }
    
                .d-flex {
                  display: flex;
                  justify-content: space-between;
                }
    
                @media print {
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContents}
            </body>
          </html>
        `);
        popupWin!.document.close();
      }
    }
}