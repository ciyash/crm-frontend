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
import { ProfileComponent } from './USER/profile/profile.component';
import { ParcelBranchComponent } from './Branch/parcel-branch/parcel-branch.component';


const routes: Routes = [
  {path:"login",component:LoginComponent },
  {path:"",component:LoginComponent },
  {path:"signup",component:SignupComponent, canActivate: [authGuard] },

  //Admin Component

  //Branch Component
  {path:"booking",component:ParcelbookingComponent, canActivate: [authGuard] },
  {path:'parcelloading',component:ParcelloadingComponent, canActivate: [authGuard]},
  {path:'bookingreport',component:BookingReportComponent, canActivate: [authGuard]},
  {path:'printgrn/:grnNumber',component:PrintGrnNumberComponent, canActivate: [authGuard]},
  {path:'parcelloadingdata',component:ParcelLoadingDataComponent, canActivate: [authGuard]},
  {path:'parcelunloading',component:ParcelOnloadingComponent, canActivate: [authGuard]},
  {path:'parcelonloadingdata',component:ParcelOnLoadingDataComponent, canActivate: [authGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'parcel-branch', component: ParcelBranchComponent, canActivate: [authGuard] },




  //Routing components
  { path: 'createbranch', component: CreateBranchComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  { path: 'createemployee', component: CreateEmployeeComponent, canActivate: [authGuard], data: { roles: ['admin'] }},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
