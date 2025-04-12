import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './USER/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './USER/login/login.component';
import { ParcelbookingComponent } from './Branch/parcelbooking/parcelbooking.component';
import { ParcelloadingComponent } from './Branch/parcelloading/parcelloading.component';
import { HeaderComponent } from './USER/header/header.component';
import { ProfileComponent } from './USER/profile/profile.component';
import { BookingReportComponent } from './Branch/booking-report/booking-report.component';
import { TableModule } from 'primeng/table';
import { FooterComponent } from './USER/footer/footer.component';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { PrintGrnNumberComponent } from './Branch/print-grn-number/print-grn-number.component';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SearchGrnNumberComponent } from './Branch/Widgets/search-grn-number/search-grn-number.component';
import { ParcelOnloadingComponent } from './Branch/parcel-onloading/parcel-onloading.component';
import { ParcelLoadingDataComponent } from './Branch/parcel-loading-data/parcel-loading-data.component';
import { ParcelOnLoadingDataComponent } from './Branch/parcel-on-loading-data/parcel-on-loading-data.component';
import { CreateBranchComponent } from './pages/Admin/create-branch/create-branch.component';
import { CreateEmployeeComponent } from './pages/Admin/create-employee/create-employee.component';
import { AdminProfileComponent } from './pages/Admin/admin-profile/admin-profile.component';
import { ParcelBranchComponent } from './Branch/parcel-branch/parcel-branch.component';
import { CreateVehicleComponent } from './pages/Admin/create-vehicle/create-vehicle.component';
import { CreateCitynameComponent } from './pages/Admin/create-cityname/create-cityname.component';
import { AddPackagesTypeComponent } from './Branch/add-packages-type/add-packages-type.component';
import { VoucerOfflineListComponent } from './Branch/voucer-offline-list/voucer-offline-list.component';
import { ToastrModule } from 'ngx-toastr';
import { AddDispatchTypeComponent } from './pages/Admin/add-dispatch-type/add-dispatch-type.component';
import { AddExtraChargesComponent } from './pages/Admin/add-extra-charges/add-extra-charges.component';
import { BrachToBranchUnloadingComponent } from './Branch/brach-to-branch-unloading/brach-to-branch-unloading.component';
import { FilterGrnComponent } from './Branch/filter-grn/filter-grn.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


import { PrintVoucherslistDataComponent } from './Branch/print-voucherslist-data/print-voucherslist-data.component';
import { ParcelBookingReportComponent } from './Branch/Reports/parcel-booking-report/parcel-booking-report.component';
import { DispatchedReportComponent } from './Branch/dispatched-report/dispatched-report.component';
import { BranchReportsDashboardComponent } from './Branch/Reports/branch-reports-dashboard/branch-reports-dashboard.component';
import { BranchCollectionReportComponent } from './Branch/Reports/branch-collection-report/branch-collection-report.component';
import { SenderReceiverGstReportComponent } from './Branch/Reports/sender-receiver-gst-report/sender-receiver-gst-report.component';
import { PendingDeliveryStockReportComponent } from './Branch/Reports/pending-delivery-stock-report/pending-delivery-stock-report.component';
import { PendingDeliveryLuggageReportComponent } from './Branch/Reports/pending-delivery-luggage-report/pending-delivery-luggage-report.component';
import { ParcelReceivedStockReportComponent } from './Branch/Reports/parcel-received-stock-report/parcel-received-stock-report.component';
import { DeliveredStockReportComponent } from './Branch/Reports/delivered-stock-report/delivered-stock-report.component';
import { PendingDispatchedStockReportComponent } from './Branch/Reports/pending-dispatched-stock-report/pending-dispatched-stock-report.component';
import { DispatchedMemoReportComponent } from './Branch/Reports/dispatched-memo-report/dispatched-memo-report.component';
import { ParcelIncomingLauggageReportComponent } from './Branch/Reports/parcel-incoming-lauggage-report/parcel-incoming-lauggage-report.component';
import { AllParcelBookingReportComponent } from './Branch/Reports/all-parcel-booking-report/all-parcel-booking-report.component';
import { ParcelbookingSerialnoComponent } from './Branch/Reports/parcelbooking-serialno/parcelbooking-serialno.component';
import { ParcelBookingMobileComponent } from './Branch/Reports/parcel-booking-mobile/parcel-booking-mobile.component';
import { RegularcustomerBookingComponent } from './Branch/Reports/regularcustomer-booking/regularcustomer-booking.component';
import { ParcelCancelComponent } from './Branch/Reports/parcel-cancel/parcel-cancel.component';
import { ParcelBookingSummaryComponent } from './Branch/Reports/parcel-booking-summary/parcel-booking-summary.component';




@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ParcelbookingComponent,
    ParcelloadingComponent,
    HeaderComponent,
    ProfileComponent,
    BookingReportComponent,
    FooterComponent,
    PrintGrnNumberComponent,
    SearchGrnNumberComponent,
    ParcelOnloadingComponent,
    ParcelLoadingDataComponent,
    ParcelOnLoadingDataComponent,
    CreateBranchComponent,
    CreateEmployeeComponent,
    AdminProfileComponent,
    ParcelBranchComponent,
    CreateVehicleComponent,
    CreateCitynameComponent,
    AddPackagesTypeComponent,
    VoucerOfflineListComponent,
    AddDispatchTypeComponent,
    AddExtraChargesComponent,
    BrachToBranchUnloadingComponent,
    FilterGrnComponent,
    PrintVoucherslistDataComponent,
    ParcelBookingReportComponent,
    DispatchedReportComponent,
    BranchReportsDashboardComponent,
    BranchCollectionReportComponent,
    SenderReceiverGstReportComponent,
    PendingDeliveryStockReportComponent,
    PendingDeliveryLuggageReportComponent,
    ParcelReceivedStockReportComponent,
    DeliveredStockReportComponent,
    PendingDispatchedStockReportComponent,
    DispatchedMemoReportComponent,
    ParcelIncomingLauggageReportComponent,
    AllParcelBookingReportComponent,
    ParcelbookingSerialnoComponent,
    ParcelBookingMobileComponent,
    RegularcustomerBookingComponent,
    ParcelCancelComponent,
    ParcelBookingSummaryComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, FormsModule,
    HttpClientModule, TableModule, MessagesModule,
     DialogModule, BrowserAnimationsModule, QRCodeModule, ToastModule, ButtonModule, RippleModule,ZXingScannerModule,
     ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Toast appears in the top-right
      timeOut: 3000, // Toast disappears after 3 seconds
      closeButton: true, // Show close button
      progressBar: true, // Show progress bar
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
