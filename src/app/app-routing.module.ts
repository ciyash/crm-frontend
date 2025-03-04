import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './USER/login/login.component';
import { SignupComponent } from './USER/signup/signup.component';
import { ParcelbookingComponent } from './Branch/parcelbooking/parcelbooking.component';
import { ParcelloadingComponent } from './Branch/parcelloading/parcelloading.component';




const routes: Routes = [
  {path:"login",component:LoginComponent },
  {path:"",component:LoginComponent },
  {path:"signup",component:SignupComponent },
  {path:"booking",component:ParcelbookingComponent },
  {path:'parcelloading',component:ParcelloadingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
