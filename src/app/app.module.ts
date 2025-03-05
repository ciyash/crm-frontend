import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './USER/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './USER/login/login.component';
import { ParcelbookingComponent } from './Branch/parcelbooking/parcelbooking.component';
import { ParcelloadingComponent } from './Branch/parcelloading/parcelloading.component';
import { HeaderComponent } from './USER/header/header.component';
import { ProfileComponent } from './USER/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ParcelbookingComponent,
    ParcelloadingComponent,
    HeaderComponent,
    ProfileComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
