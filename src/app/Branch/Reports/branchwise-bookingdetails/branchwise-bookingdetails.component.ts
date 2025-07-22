import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
declare var $: any;
@Component({
  selector: 'app-branchwise-bookingdetails',
  templateUrl: './branchwise-bookingdetails.component.html',
  styleUrls: ['./branchwise-bookingdetails.component.scss'],
})
export class BranchwiseBookingdetailsComponent {
  ffdata: any;
  pfdata: any;
  profileData: any;
  pffffffdata: any;
  today= new Date()
  branchReportData: any;
  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService
  ) {}

  getTodayDateString(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // ✔ HTML date input format
  }
  ngOnInit() {
    this.getProfileData();

    const data = localStorage.getItem('collectiondata');
    if (data) {
      this.branchReportData = JSON.parse(data);
      console.log('Branchwise Report Data:', this.branchReportData);
    }
  }
  
  getTotal(field: string): number {
    return this.branchReportData.cityWiseDeliveryDetails.reduce((sum: number, item: any) => {
      return sum + (item[field] || 0);
    }, 0);
  }
  

  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      console.log('profile', res);
      this.ffdata = res.branchId;
      this.pfdata = res.branchId.city;
      this.profileData = res;
      this.pffffffdata = res;
      console.log('profileData:', this.profileData);
    });
  }

  printReport() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const popupWin = window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );
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

  exportToExcel(): void {
    const wb = XLSX.utils.book_new();
  
    // Booked Paid Details
    const paidData = this.branchReportData.paidDetails.map((item: { grnNo: any; bookingDate: string | number | Date; toCity: any; senderName: any; receiverName: any; toTalPackages: any; doorPickupCharges: any; totalCharge: any; grandTotal: any; }, index: number) => ({
      No: index + 1,
      'LR No': item.grnNo,
      'Booking Date': new Date(item.bookingDate).toLocaleString(),
      'Destination': item.toCity,
      'Consignor': item.senderName,
      'Consignee': item.receiverName,
      'Pkgs': item.toTalPackages,
      'Door Pickup': item.doorPickupCharges,
      'Other': item.totalCharge,
      'Net Amount': item.grandTotal
    }));
    const paidSheet = XLSX.utils.json_to_sheet(paidData);
    XLSX.utils.book_append_sheet(wb, paidSheet, 'Paid Bookings');
  
    // Booked To Pay Details
    const toPayData = this.branchReportData.toPayDetails.map((item: { grnNo: any; bookingDate: string | number | Date; toCity: any; senderName: any; receiverName: any; toTalPackages: any; doorPickupCharges: any; totalCharge: any; grandTotal: any; }, index: number) => ({
      No: index + 1,
      'LR No': item.grnNo,
      'Booking Date': new Date(item.bookingDate).toLocaleString(),
      'Destination': item.toCity,
      'Consignor': item.senderName,
      'Consignee': item.receiverName,
      'Pkgs': item.toTalPackages,
      'Door Pickup': item.doorPickupCharges,
      'Other': item.totalCharge,
      'Net Amount': item.grandTotal
    }));
    const toPaySheet = XLSX.utils.json_to_sheet(toPayData);
    XLSX.utils.book_append_sheet(wb, toPaySheet, 'To Pay Bookings');
  
    // Delivered To Pay Details
    const deliveredData = this.branchReportData.deliveredToPayDetails.map((item: { grnNo: any; deliveryDate: string | number | Date; deliveryEmployee: any; toCity: any; senderName: any; receiverName: any; totalPackages: any; doorDeliveryCharges: any; otherCharges: any; totalAmount: any; grandTotal: any; }, index: number) => ({
      No: index + 1,
      'LR No': item.grnNo,
      'Delivery Date': new Date(item.deliveryDate).toLocaleString(),
      'Delivered By': item.deliveryEmployee,
      'Destination': item.toCity,
      'Consignor': item.senderName,
      'Consignee': item.receiverName,
      'Pkgs': item.totalPackages,
      'Door Delivery Charge': item.doorDeliveryCharges,
      'Other': item.otherCharges,
      'Amount': item.totalAmount,
      'Net Amount': item.grandTotal
    }));
    const deliveredSheet = XLSX.utils.json_to_sheet(deliveredData);
    XLSX.utils.book_append_sheet(wb, deliveredSheet, 'Delivered ToPay');
  
    // City Wise Booking
    const cityBooking = this.branchReportData.branchWiseBookingDetails.map((item: { deliveryCity: any; noOfParcels: any; paid: any; toPay: any; FOC: any; credit: any; totalBooking: any; totalAmount: any; refundAmount: any; }) => ({
      City: item.deliveryCity,
      'No Of Parcel': item.noOfParcels,
      'Paid Amount': item.paid,
      'To Pay': item.toPay,
      'FOC': item.FOC,
      'Credit': item.credit,
      'Total Booking': item.totalBooking,
      'Total Amount': item.totalAmount,
      'Refund Amount': item.refundAmount,
      'Net Amount': (item.totalAmount || 0) - (item.refundAmount || 0),
    }));
    const cityBookingSheet = XLSX.utils.json_to_sheet(cityBooking);
    XLSX.utils.book_append_sheet(wb, cityBookingSheet, 'City Booking');
  
    // City Wise Delivery
    const cityDelivery = this.branchReportData.cityWiseDeliveryDetails.map((item: { deliveryCity: any; noOfParcels: any; paid: any; toPay: any; FOC: any; credit: any; totalBooking: any; totalAmount: any; refundAmount: any; }) => ({
      City: item.deliveryCity,
      'No Of Parcel': item.noOfParcels,
      'Paid Amount': item.paid,
      'To Pay': item.toPay,
      'FOC': item.FOC,
      'Credit': item.credit,
      'Total Booking': item.totalBooking,
      'Total Amount': item.totalAmount,
      'Refund Amount': item.refundAmount,
      'Net Amount': (item.totalAmount || 0) - (item.refundAmount || 0),
    }));
    const cityDeliverySheet = XLSX.utils.json_to_sheet(cityDelivery);
    XLSX.utils.book_append_sheet(wb, cityDeliverySheet, 'City Delivery');
  
    // Save workbook
    const fileName = `Daily_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, fileName);
  }
  
}
