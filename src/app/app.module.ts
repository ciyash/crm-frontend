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
import { AddCfmasterComponent } from './Branch/Cfmaster/add-cfmaster/add-cfmaster.component';
import { GetCfmasterDataComponent } from './Branch/Cfmaster/get-cfmaster-data/get-cfmaster-data.component';
import { SetChargesComponent } from './Branch/Cfmaster/set-charges/set-charges.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CreditVoucherGenerateComponent } from './Branch/Cfmaster/credit-voucher-generate/credit-voucher-generate.component';
import { VoucherDetailsCfmasterComponent } from './Branch/Cfmaster/voucher-details-cfmaster/voucher-details-cfmaster.component';



import { ParcelBookingMobileComponent } from './Branch/Reports/parcel-booking-mobile/parcel-booking-mobile.component';
import { ParcelBookingSummaryComponent } from './Branch/Reports/parcel-booking-summary/parcel-booking-summary.component';
import { ParcelCancelComponent } from './Branch/Reports/parcel-cancel/parcel-cancel.component';
import { ParcelbookingSerialnoComponent } from './Branch/Reports/parcelbooking-serialno/parcelbooking-serialno.component';
import { AllParcelBookingReportComponent } from './Branch/Reports/all-parcel-booking-report/all-parcel-booking-report.component';
import { RegularcustomerBookingComponent } from './Branch/Reports/regularcustomer-booking/regularcustomer-booking.component';
import { CancelBookingComponent } from './Branch/cancel-booking/cancel-booking.component';
import { CollectionReportComponent } from './Branch/Reports/collection-report/collection-report.component';

import { ConsolidatedComponent } from './Branch/Reports/consolidated/consolidated.component';
import { CollectionDataComponent } from './Branch/Reports/collection-data/collection-data.component';
import { GstReportComponent } from './Branch/Reports/gst-report/gst-report.component';
import { GstDataComponent } from './Branch/Reports/gst-data/gst-data.component';
import { ParcelStatusDateDifferentComponent } from './Branch/Reports/parcel-status-date-different/parcel-status-date-different.component';
import { StatusDateReportComponent } from './Branch/Reports/status-date-report/status-date-report.component';
import { DeliveryStockReportComponent } from './Branch/Reports/delivery-stock-report/delivery-stock-report.component';
import { ParcelIncomingLuggagesReportComponent } from './Branch/Reports/parcel-incoming-luggages-report/parcel-incoming-luggages-report.component';
import { ParcelIncomingReportComponent } from './Branch/Reports/parcel-incoming-report/parcel-incoming-report.component';
import { DashboardComponent } from './USER/dashboard/dashboard.component';
import { ParcelDeliveryComponent } from './Branch/parcel-delivery/parcel-delivery.component';
import { ParcelLoadingOfflineReportComponent } from './Branch/Reports/parcel-loading-offline-report/parcel-loading-offline-report.component';
import { DispatchedStockReportComponent } from './Branch/Reports/dispatched-stock-report/dispatched-stock-report.component';
import { ReportDeliveryComponent } from './Branch/Reports/report-delivery/report-delivery.component';
import { VocherDetailsReportComponent } from './Branch/Cfmaster/vocher-details-report/vocher-details-report.component';
import { BookingComponent } from './empolyee/booking/booking.component';
import { LoadingComponent } from './empolyee/loading/loading.component';
import { UnloadingComponent } from './empolyee/unloading/unloading.component';
import { LoadingReportComponent } from './empolyee/loading-report/loading-report.component';
import { BranchToBranchLoadingComponent } from './empolyee/branch-to-branch-loading/branch-to-branch-loading.component';
import { BranchToBranchUnloadingComponent } from './empolyee/branch-to-branch-unloading/branch-to-branch-unloading.component';
import { VoucherDetailsListComponent } from './empolyee/voucher-details-list/voucher-details-list.component';
import { CfmasterDataComponent } from './empolyee/cfmaster/cfmaster-data/cfmaster-data.component';
import { TodaybookingComponent } from './empolyee/Reports/todaybooking/todaybooking.component';
import { CollectionreportComponent } from './empolyee/Reports/collectionreport/collectionreport.component';
import { ConslidatedReportComponent } from './empolyee/Reports/conslidated-report/conslidated-report.component';
import { ReportStatusDateComponent } from './empolyee/Reports/report-status-date/report-status-date.component';
import { PendingdeliveryStockComponent } from './empolyee/Reports/pendingdelivery-stock/pendingdelivery-stock.component';
import { PendingdevliveryLuggagereportComponent } from './empolyee/Reports/pendingdevlivery-luggagereport/pendingdevlivery-luggagereport.component';
import { DispatchedstockReportComponent } from './empolyee/dispatchedstock-report/dispatchedstock-report.component';
import { ReceivedstockReportComponent } from './empolyee/Reports/receivedstock-report/receivedstock-report.component';
import { DeliveryReportComponent } from './empolyee/Reports/delivery-report/delivery-report.component';
import { PendingdispacthedstockReportComponent } from './empolyee/Reports/pendingdispacthedstock-report/pendingdispacthedstock-report.component';
import { DisptchedMemoReportComponent } from './empolyee/Reports/disptched-memo-report/disptched-memo-report.component';
import { IncomingReportComponent } from './empolyee/Reports/incoming-report/incoming-report.component';
import { DashboardReportComponent } from './empolyee/Reports/dashboard-report/dashboard-report.component';
import { SubBookingComponent } from './SubAdmin/sub-booking/sub-booking.component';
import { SubLoadingComponent } from './SubAdmin/sub-loading/sub-loading.component';
import { SubLoadingreportComponent } from './SubAdmin/sub-loadingreport/sub-loadingreport.component';
import { SubUnloadingComponent } from './SubAdmin/sub-unloading/sub-unloading.component';
import { SubBranchToBranchLoadingComponent } from './SubAdmin/sub-branch-to-branch-loading/sub-branch-to-branch-loading.component';
import { SubBranchToBranchUnloadingComponent } from './SubAdmin/sub-branch-to-branch-unloading/sub-branch-to-branch-unloading.component';
import { SubTodaybookingComponent } from './SubAdmin/Reports/sub-todaybooking/sub-todaybooking.component';
import { SubDashboardBookingComponent } from './SubAdmin/Reports/sub-dashboard-booking/sub-dashboard-booking.component';
import { SubCollectionComponent } from './SubAdmin/Reports/sub-collection/sub-collection.component';
import { ConsolidateComponent } from './SubAdmin/Reports/consolidate/consolidate.component';
import { SubStatusDateDifferentComponent } from './SubAdmin/Reports/sub-status-date-different/sub-status-date-different.component';
import { SubPendingDeliveryStockComponent } from './SubAdmin/Reports/sub-pending-delivery-stock/sub-pending-delivery-stock.component';
import { SubPendingDeliveryLuggageComponent } from './SubAdmin/Reports/sub-pending-delivery-luggage/sub-pending-delivery-luggage.component';
import { SubDispatchedStockComponent } from './SubAdmin/Reports/sub-dispatched-stock/sub-dispatched-stock.component';
import { SubReceivedStockComponent } from './SubAdmin/Reports/sub-received-stock/sub-received-stock.component';
import { SubDeliveryStockComponent } from './SubAdmin/Reports/sub-delivery-stock/sub-delivery-stock.component';
import { SubPendingDispatchStockComponent } from './SubAdmin/Reports/sub-pending-dispatch-stock/sub-pending-dispatch-stock.component';
import { SubMemoDispatchedComponent } from './SubAdmin/Reports/sub-memo-dispatched/sub-memo-dispatched.component';
import { SubIncomingLuggageComponent } from './SubAdmin/Reports/sub-incoming-luggage/sub-incoming-luggage.component';
@NgModule({
  declarations: [
    // reports

    ParcelBookingMobileComponent,
    ParcelBookingSummaryComponent,
    RegularcustomerBookingComponent,
    ParcelCancelComponent,
    ParcelbookingSerialnoComponent,
    AllParcelBookingReportComponent,
    VocherDetailsReportComponent,
    GetCfmasterDataComponent,
    AddCfmasterComponent,


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
    AddCfmasterComponent,
    GetCfmasterDataComponent,
    SetChargesComponent,
    CreditVoucherGenerateComponent,
    VoucherDetailsCfmasterComponent,
    CancelBookingComponent,
    CollectionReportComponent,
    
    
    
    ConsolidatedComponent,
    CollectionDataComponent,
    GstReportComponent,
    GstDataComponent,
    ParcelStatusDateDifferentComponent,
    StatusDateReportComponent,
    DeliveryStockReportComponent,
    ParcelIncomingLuggagesReportComponent,
    ParcelIncomingReportComponent,
    DashboardComponent,
    ParcelDeliveryComponent,
    ParcelLoadingOfflineReportComponent,
    DispatchedStockReportComponent,
    ReportDeliveryComponent,
    BookingComponent,
    LoadingComponent,
    UnloadingComponent,
    LoadingReportComponent,
    BranchToBranchLoadingComponent,
    BranchToBranchUnloadingComponent,
    VoucherDetailsListComponent,
    CfmasterDataComponent,
    TodaybookingComponent,
    CollectionreportComponent,
    ConslidatedReportComponent,
    ReportStatusDateComponent,
    PendingdeliveryStockComponent,
    PendingdevliveryLuggagereportComponent,
    DispatchedstockReportComponent,
    ReceivedstockReportComponent,
    DeliveryReportComponent,
    PendingdispacthedstockReportComponent,
    DisptchedMemoReportComponent,
    IncomingReportComponent,
    DashboardReportComponent,
    SubBookingComponent,
    SubLoadingComponent,
    SubLoadingreportComponent,
    SubUnloadingComponent,
    SubBranchToBranchLoadingComponent,
    SubBranchToBranchUnloadingComponent,
    SubTodaybookingComponent,
    SubDashboardBookingComponent,
    SubCollectionComponent,
    ConsolidateComponent,
    SubStatusDateDifferentComponent,
    SubPendingDeliveryStockComponent,
    SubPendingDeliveryLuggageComponent,
    SubDispatchedStockComponent,
    SubReceivedStockComponent,
    SubDeliveryStockComponent,
    SubPendingDispatchStockComponent,
    SubMemoDispatchedComponent,
    SubIncomingLuggageComponent,
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule, TableModule, MessagesModule,
     DialogModule, BrowserAnimationsModule, QRCodeModule, ToastModule, ButtonModule, RippleModule,ZXingScannerModule,
     ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Toast appears in the top-right
      timeOut: 3000, // Toast disappears after 3 seconds
      closeButton: true, // Show close button
      progressBar: true, // Show progress bar
      preventDuplicates: true, // Prevent duplicate toa
    }),
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
 
 