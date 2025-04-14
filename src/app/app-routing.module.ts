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


const routes: Routes = [
  {path:"login",component:LoginComponent },
  {path:"",component:LoginComponent },
  {path:"signup",component:SignupComponent, canActivate: [authGuard] },

  //Branch type Component
  {path:"booking",component:ParcelbookingComponent, canActivate: [authGuard] },
  {path:'parcelloading',component:ParcelloadingComponent, canActivate: [authGuard]},
  {path:'bookingreport',component:BookingReportComponent, canActivate: [authGuard]},
  { path: 'printgrn/:grnNo', component: PrintGrnNumberComponent, canActivate: [authGuard] },
  {path:'parcelloadingdata',component:ParcelLoadingDataComponent, canActivate: [authGuard]},
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

  //cf master
  { path: 'getcfmasterdata', component: GetCfmasterDataComponent, canActivate: [authGuard] },
  { path: 'creditvouchergenerate', component: CreditVoucherGenerateComponent, canActivate: [authGuard] },
  { path: 'voucherdetailscf', component: VoucherDetailsCfmasterComponent, canActivate: [authGuard] },

  // Reports
  { path: 'dispatchedreport', component: DispatchedReportComponent, canActivate: [authGuard] },
  { path: 'reportsdashboard', component: BranchReportsDashboardComponent, canActivate: [authGuard] },

     //Admin Routing components
  { path: 'createbranch', component: CreateBranchComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createemployee', component: CreateEmployeeComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'adminprofile', component: AdminProfileComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createvehicle', component: CreateVehicleComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createcity', component: CreateCitynameComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'adddispatchtype', component: AddDispatchTypeComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'addextracharges', component: AddExtraChargesComponent, canActivate: [authGuard], data: { roles: ['admin'] }},


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
