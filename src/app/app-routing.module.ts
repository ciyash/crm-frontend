import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './USER/login/login.component';

import { SignupComponent } from './USER/signup/signup.component';
import { ParcelbookingComponent } from './Branch/parcelbooking/parcelbooking.component';
import { ParcelloadingComponent } from './Branch/parcelloading/parcelloading.component';
import { BookingReportComponent } from './Branch/booking-report/booking-report.component';
import { PrintGrnNumberComponent } from './Branch/print-grn-number/print-grn-number.component';
import { ParcelOnloadingComponent } from './Branch/parcel-onloading/parcel-onloading.component';
import { ParcelLoadingDataComponent } from './Branch/parcel-loading-data/parcel-loading-data.component';
import { ParcelOnLoadingDataComponent } from './Branch/parcel-on-loading-data/parcel-on-loading-data.component';
import { authGuard } from './service/auth.guard';
import { CreateBranchComponent } from './pages/Admin/create-branch/create-branch.component';
import { CreateEmployeeComponent } from './pages/Admin/create-employee/create-employee.component';
import { AdminProfileComponent } from './pages/Admin/admin-profile/admin-profile.component';
import { ProfileComponent } from './USER/profile/profile.component';
import { ParcelBranchComponent } from './Branch/parcel-branch/parcel-branch.component';
import { CreateVehicleComponent } from './pages/Admin/create-vehicle/create-vehicle.component';
import { CreateCitynameComponent } from './pages/Admin/create-cityname/create-cityname.component';
import { AddPackagesTypeComponent } from './Branch/add-packages-type/add-packages-type.component';
import { SearchGrnNumberComponent } from './Branch/Widgets/search-grn-number/search-grn-number.component';
import { VoucerOfflineListComponent } from './Branch/voucer-offline-list/voucer-offline-list.component';
import { AddDispatchTypeComponent } from './pages/Admin/add-dispatch-type/add-dispatch-type.component';
import { AddExtraChargesComponent } from './pages/Admin/add-extra-charges/add-extra-charges.component';
import { BrachToBranchUnloadingComponent } from './Branch/brach-to-branch-unloading/brach-to-branch-unloading.component';
import { FilterGrnComponent } from './Branch/filter-grn/filter-grn.component';
import { PrintVoucherslistDataComponent } from './Branch/print-voucherslist-data/print-voucherslist-data.component';
import { DispatchedReportComponent } from './Branch/dispatched-report/dispatched-report.component';
import { BranchReportsDashboardComponent } from './Branch/Reports/branch-reports-dashboard/branch-reports-dashboard.component';
import { GetCfmasterDataComponent } from './Branch/Cfmaster/get-cfmaster-data/get-cfmaster-data.component';
import { CreditVoucherGenerateComponent } from './Branch/Cfmaster/credit-voucher-generate/credit-voucher-generate.component';
import { VoucherDetailsCfmasterComponent } from './Branch/Cfmaster/voucher-details-cfmaster/voucher-details-cfmaster.component';
import { AddCfmasterComponent } from './Branch/Cfmaster/add-cfmaster/add-cfmaster.component';
import { RegularcustomerBookingComponent } from './Branch/Reports/regularcustomer-booking/regularcustomer-booking.component';
import { ParcelBookingMobileComponent } from './Branch/Reports/parcel-booking-mobile/parcel-booking-mobile.component';
import { ParcelBookingReportComponent } from './Branch/Reports/parcel-booking-report/parcel-booking-report.component';
import { AllParcelBookingReportComponent } from './Branch/Reports/all-parcel-booking-report/all-parcel-booking-report.component';
import { ParcelbookingSerialnoComponent } from './Branch/Reports/parcelbooking-serialno/parcelbooking-serialno.component';
import { ParcelCancelComponent } from './Branch/Reports/parcel-cancel/parcel-cancel.component';
import { ParcelBookingSummaryComponent } from './Branch/Reports/parcel-booking-summary/parcel-booking-summary.component';
import { CancelBookingComponent } from './Branch/cancel-booking/cancel-booking.component';
import { CollectionReportComponent } from './Branch/Reports/collection-report/collection-report.component';
import { ConsolidatedComponent } from './Branch/Reports/consolidated/consolidated.component';
import { GstReportComponent } from './Branch/Reports/gst-report/gst-report.component';
import { GstDataComponent } from './Branch/Reports/gst-data/gst-data.component';
import { PendingDeliveryStockReportComponent } from './Branch/Reports/pending-delivery-stock-report/pending-delivery-stock-report.component';
import { CollectionDataComponent } from './Branch/Reports/collection-data/collection-data.component';
import { ParcelStatusDateDifferentComponent } from './Branch/Reports/parcel-status-date-different/parcel-status-date-different.component';
import { StatusDateReportComponent } from './Branch/Reports/status-date-report/status-date-report.component';
import { DeliveryStockReportComponent } from './Branch/Reports/delivery-stock-report/delivery-stock-report.component';
import { PendingDeliveryLuggageReportComponent } from './Branch/Reports/pending-delivery-luggage-report/pending-delivery-luggage-report.component';
import { ParcelReceivedStockReportComponent } from './Branch/Reports/parcel-received-stock-report/parcel-received-stock-report.component';
import { ParcelIncomingLuggagesReportComponent } from './Branch/Reports/parcel-incoming-luggages-report/parcel-incoming-luggages-report.component';
import { ParcelIncomingReportComponent } from './Branch/Reports/parcel-incoming-report/parcel-incoming-report.component';
import { DispatchedMemoReportComponent } from './Branch/Reports/dispatched-memo-report/dispatched-memo-report.component';
import { PendingDispatchedStockReportComponent } from './Branch/Reports/pending-dispatched-stock-report/pending-dispatched-stock-report.component';
import { DashboardComponent } from './USER/dashboard/dashboard.component';
import { ParcelDeliveryComponent } from './Branch/parcel-delivery/parcel-delivery.component';
import { ParcelLoadingOfflineReportComponent } from './Branch/Reports/parcel-loading-offline-report/parcel-loading-offline-report.component';
import { DispatchedStockReportComponent } from './Branch/Reports/dispatched-stock-report/dispatched-stock-report.component';
import { ReportDeliveryComponent } from './Branch/Reports/report-delivery/report-delivery.component';
import { VocherDetailsReportComponent } from './Branch/Cfmaster/vocher-details-report/vocher-details-report.component';
import { BookingComponent } from './empolyee/booking/booking.component';
import { LoadingComponent } from './empolyee/loading/loading.component';
import { UnloadingComponent } from './empolyee/unloading/unloading.component';
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
import { SubUnloadingComponent } from './SubAdmin/sub-unloading/sub-unloading.component';
import { SubBranchToBranchLoadingComponent } from './SubAdmin/sub-branch-to-branch-loading/sub-branch-to-branch-loading.component';
import { SubBranchToBranchUnloadingComponent } from './SubAdmin/sub-branch-to-branch-unloading/sub-branch-to-branch-unloading.component';

const routes: Routes = [
  {path:"login",component:LoginComponent },
  {path:"",component:LoginComponent },
  {path:"signup",component:SignupComponent, canActivate: [authGuard] },
  {path:"dashboard",component:DashboardComponent, canActivate: [authGuard] },


  //Branch type Component
  {path:"booking",component:ParcelbookingComponent, canActivate: [authGuard] },
  {path:'parcelloading',component:ParcelloadingComponent, canActivate: [authGuard]},
  {path:'bookingreport',component:BookingReportComponent, canActivate: [authGuard]},
  { path: 'printgrn/:grnNo', component: PrintGrnNumberComponent, canActivate: [authGuard] },
  {path:'parcelloadingdata',component:ParcelLoadingDataComponent, canActivate: [authGuard]},
  {path:'cancel-booking',component:CancelBookingComponent, canActivate: [authGuard]},

  {path:'parcelunloading',component:ParcelOnloadingComponent, canActivate: [authGuard]},
  {path:'parcelonloadingdata',component:ParcelOnLoadingDataComponent, canActivate: [authGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'parcel-branch', component: ParcelBranchComponent, canActivate: [authGuard] },
  { path: 'barnchtobranchunloading', component: BrachToBranchUnloadingComponent, canActivate: [authGuard] },
  { path: 'addpackagestype', component: AddPackagesTypeComponent, canActivate: [authGuard] },
  { path: 'searchgrn', component: SearchGrnNumberComponent, canActivate: [authGuard] },
  { path: 'gnrnumberstatus', component: FilterGrnComponent, canActivate: [authGuard] },
  { path: 'printvouchersdata/:vocherNoUnique', component: PrintVoucherslistDataComponent, canActivate: [authGuard] },
  { path: 'voucherslistoffline', component: VoucerOfflineListComponent, canActivate: [authGuard] },
  { path: 'addpackagetype', component: AddPackagesTypeComponent, canActivate: [authGuard],},
  { path: 'parcel-delivery', component: ParcelDeliveryComponent, canActivate: [authGuard],},

  // Reportslll
  //cf master
  { path: 'addcfmaster', component: AddCfmasterComponent, canActivate: [authGuard] },
  { path: 'getcfmasterdata', component: GetCfmasterDataComponent, canActivate: [authGuard] },
  { path: 'creditvouchergenerate', component: CreditVoucherGenerateComponent, canActivate: [authGuard] },
  { path: 'voucherdetailscf', component: VoucherDetailsCfmasterComponent, canActivate: [authGuard] },
  { path: 'voucher-report', component: VocherDetailsReportComponent, canActivate: [authGuard] },


  // Reports
  { path: 'dispatchedreport', component: DispatchedReportComponent, canActivate: [authGuard] },
  { path: 'reportsdashboard', component: BranchReportsDashboardComponent, canActivate: [authGuard] },
  { path: 'regularcustmer', component: RegularcustomerBookingComponent, canActivate: [authGuard] },
  { path: 'bookingserial', component: ParcelbookingSerialnoComponent, canActivate: [authGuard] },
  { path: 'reports', component: ParcelBookingReportComponent, canActivate: [authGuard] },
  {path:'allpercelbooking',component:AllParcelBookingReportComponent,canActivate: [authGuard] },
  {path:'bookingmobile',component:ParcelBookingMobileComponent, canActivate: [authGuard]},
  {path:'cancel-report',component:ParcelCancelComponent, canActivate: [authGuard]},
  {path:'bookingsummary',component:ParcelBookingSummaryComponent, canActivate: [authGuard]},
  {path:'collectionreport',component:CollectionReportComponent, canActivate: [authGuard]},
  {path:'Consolidate',component:ConsolidatedComponent, canActivate: [authGuard]},
  {path:'gdtreport',component:GstReportComponent, canActivate: [authGuard]},
  {path:'gstdata',component:GstDataComponent, canActivate: [authGuard]},
  {path:'pending-delivery',component:PendingDeliveryStockReportComponent, canActivate: [authGuard]},
  {path:'collectiondata',component:CollectionDataComponent, canActivate: [authGuard]},
  
  {path:'parcelstatusdate',component:ParcelStatusDateDifferentComponent, canActivate: [authGuard]},
  {path:'datereport',component:StatusDateReportComponent, canActivate: [authGuard]},
  {path:'devliveryreport',component:DeliveryStockReportComponent, canActivate: [authGuard]},
  {path:'pendingluggage',component:PendingDeliveryLuggageReportComponent, canActivate: [authGuard]},
  {path:'receivedstock-report',component:ParcelReceivedStockReportComponent, canActivate: [authGuard]},
  {path:'incoming-report',component:ParcelIncomingLuggagesReportComponent, canActivate: [authGuard]},
  {path:'parcel-incoming-report',component:ParcelIncomingReportComponent, canActivate: [authGuard]},
  {path:'dispacthed-memo-report',component:DispatchedMemoReportComponent, canActivate: [authGuard]},
  {path:'pending-dispatchedStock-report',component:PendingDispatchedStockReportComponent, canActivate: [authGuard]},
  {path:'parcelloading-offlinereport',component:ParcelLoadingOfflineReportComponent, canActivate: [authGuard]},
  {path:'dispatched-stock-report',component:DispatchedStockReportComponent, canActivate: [authGuard]},
  {path:'report-delivery',component:ReportDeliveryComponent, canActivate: [authGuard]},
     //Admin Routing components
  { path: 'createbranch', component: CreateBranchComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createemployee', component: CreateEmployeeComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'adminprofile', component: AdminProfileComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createvehicle', component: CreateVehicleComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createcity', component: CreateCitynameComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'adddispatchtype', component: AddDispatchTypeComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'addextracharges', component: AddExtraChargesComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'addpackagetype', component: AddPackagesTypeComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  // subadmin
  {path:"dashboard",component:DashboardComponent, canActivate: [authGuard], data: { roles: ['subadmin'] }},
    // Empolyee Routing components 
  { path: 'employee-booking', component: BookingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-loading', component: LoadingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-unloading', component: UnloadingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-branch-loading', component:BranchToBranchLoadingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-parcel-devlivery', component:ParcelDeliveryComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-parcel-cancel', component:CancelBookingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-status', component:FilterGrnComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-branch-unloading', component:BranchToBranchUnloadingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  { path: 'employee-voucherdetails', component:VoucherDetailsListComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  // { path: 'employee-cfmaster-data', component:CfmasterDataComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
  // { path: 'employee-addmaster', component:CfmasterDataComponent, canActivate: [authGuard],data: { roles: ['employee'] }},


// cfmaster
  { path: 'addcfmaster', component: AddCfmasterComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
  { path: 'getcfmasterdata', component: GetCfmasterDataComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
  { path: 'creditvouchergenerate', component: CreditVoucherGenerateComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
  { path: 'voucherdetailscf', component: VoucherDetailsCfmasterComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
  { path: 'voucher-report', component: VocherDetailsReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },

// Employee Reports
{ path: 'todaybooking', component:TodaybookingComponent, canActivate: [authGuard],data: { roles: ['employee'] }},
{ path: 'employee-printgrn/:grnNo', component: PrintGrnNumberComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'collection-report', component: CollectionreportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'conslidated-report', component: ConslidatedReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'parcel-status', component: ReportStatusDateComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'pending-deliverystock', component: PendingdeliveryStockComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'pending-luggage', component: PendingdevliveryLuggagereportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'dispacthedstock-report', component: DispatchedstockReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'received-stock', component: ReceivedstockReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'deliverystock-report', component: DeliveryReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'pendingdispached-stock-report', component: PendingdispacthedstockReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'memo-stock-report', component: DisptchedMemoReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'incomingreport', component: IncomingReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },
{ path: 'dashboard-report', component: DashboardReportComponent, canActivate: [authGuard],data: { roles: ['employee'] } },


// subAdmin 
  {path:"sub-booking",component:SubBookingComponent, canActivate: [authGuard], data: { roles: ['subadmin'] }},
  {path:"sub-loading",component:SubLoadingComponent, canActivate: [authGuard], data: { roles: ['subadmin'] }},
  {path:"sub-unloading",component:SubUnloadingComponent, canActivate: [authGuard], data: { roles: ['subadmin'] }},
  {path:"sub-branch-loading",component:SubBranchToBranchLoadingComponent, canActivate: [authGuard], data: { roles: ['subadmin'] }},
  {path:"sub-branch-unloading",component:SubBranchToBranchUnloadingComponent, canActivate: [authGuard], data: { roles: ['subadmin'] }},


























  






  
  

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
