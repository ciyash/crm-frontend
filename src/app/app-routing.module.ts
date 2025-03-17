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


const routes: Routes = [
  {path:"login",component:LoginComponent },
  {path:"",component:LoginComponent },
  {path:"signup",component:SignupComponent },
  {path:"booking",component:ParcelbookingComponent },
  {path:'parcelloading',component:ParcelloadingComponent},
  {path:'bookingreport',component:BookingReportComponent},
  {path:'printgrn/:grnNumber',component:PrintGrnNumberComponent},
  {path:'parcelloadingdata',component:ParcelLoadingDataComponent},
  {path:'parcelunloading',component:ParcelOnloadingComponent},
  {path:'parcelonloadingdata',component:ParcelOnLoadingDataComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
