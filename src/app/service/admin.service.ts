import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// const AUTH_API = 'https://cargo-backend-bpq4.onrender.com/'


const AUTH_API = 'https://cargo-logistics-zsqp.onrender.com/'




// const AUTH_API = 'http://3.109.182.152:4000/'


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient ,private route:Router, private token:TokenService) { }

  createBranch(value: {
    name: string;
    branchType: string;
    city: string;
    location: string;
    address: string;
    phone: number;
    email: string;
    pincode: number;
    state: string;
    country: string;
    alternateMobile: number;
  }) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
  
    return this.http.post(
      AUTH_API + 'branch',  
      { 
        name: value.name,
        branchType: value.branchType,
        city: value.city,
        location: value.location,
        address: value.address,
        phone: value.phone,
        email: value.email,
        pincode: value.pincode,
        state: value.state,
        country: value.country,
        alternateMobile: value.alternateMobile
      },
      httpOptions 
    );
  }


  UpdateBranch(id: any, value: {
    name: string;
    branchType: string;
    city: string;
    location: string;
    address: string;
    phone: number;
    email: string;
    pincode: number;
    state: string;
    country: string;
    alternateMobile: number;
  }) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    };

    return this.http.patch(
      AUTH_API + 'branch/update/' + id,
      {
        "name": value.name,
        "branchType": value.branchType,
        "city": value.city,
        "location": value.location,
        "address": value.address,
        "phone": value.phone,
        "email": value.email,
        "pincode": value.pincode,
        "state": value.state,
        "country": value.country,
        "alternateMobile": value.alternateMobile
    },
      httpOptions
    );
  }


  ALLGetBranch(){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
      return this.http.get(AUTH_API + 'branch', httpOptions);
  }


    DeleteBranch(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
      return this.http.delete(
        AUTH_API + 'branch/delete/'+id,
        httpOptions
      );
    }

  createEmployee(value: {
    name: string;
    username: string;
    branchId: string;
    location: string;
    phone: number;
    email: string;
    password: string;
    documents: string;
    role: string;
    // companyName:String;
  }) {
    const token1 = this.token.getToken();
    console.log('Token being used for createEmployee:', token1); // ✅ Log the token

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
  
    return this.http.post(
      AUTH_API + 'subadmin-auth/signup',  
      { 
        name: value.name,
        'username': value.username,
        'branchId': value.branchId,
        'location': value.location,
        'phone': value.phone,
        'email': value.email,
        'password': value.password,
        'documents': value.documents,
        'role': value.role,
        // "companyName":value.companyName
        

      },
      httpOptions 
    );
  }
  createAdmin(value: {
    name: string;
    username: string;
    branchId: string;
    location: string;
    phone: number;
    email: string;
    password: string;
    documents: string;
    role: string;
    // companyName:String;
  }) {
    const token1 = this.token.getToken();
    console.log('Token being used for createEmployee:', token1); // ✅ Log the token

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
  
    return this.http.post(
      AUTH_API + 'subadmin-auth/signup-by-company',  
      { 
        name: value.name,
        'username': value.username,
        'branchId': value.branchId,
        'location': value.location,
        'phone': value.phone,
        'email': value.email,
        'password': value.password,
        'documents': value.documents,
        'role': value.role,
        // "companyName":value.companyName
        

      },
      httpOptions 
    );
  }


  // UpdateEmployee(value: {
  //   name: string;
  //   username: string;
  //   branchId: string;
  //   location: string;
  //   phone: number;
  //   email: string;
  //   password: string;
  //   documents: string;
  //   role: string;
  //   companyName:String;

  // }) {
  //   const token1 = this.token.getToken();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token1
  //     })
  //   };
  //   return this.http.patch(
  //     AUTH_API + 'subadmin-auth/update-profile/{id}',
  //     {
  //       name: value.name,
  //       'username': value.username,
  //       'branchId': value.branchId,
  //       'location': value.location,
  //       'phone': value.phone,
  //       'email': value.email,
  //       'password': value.password,
  //       'documents': value.documents,
  //       'role': value.role,
  //       "companyName":value.companyName,

  //   },
  //     httpOptions
  //   );
  // }
  UpdateEmployee(value: {
    _id: string;
    name: string;
    username: string;
    branchId: string;
    location: string;
    phone: number;
    email: string;
    password: string;
    documents: string;
    role: string;
    companyName: string;
  }) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    };
  
    // Append _id to the URL
    return this.http.patch(
      `${AUTH_API}subadmin-auth/update-profile/${value._id}`,
      {
        name: value.name,
        username: value.username,
        branchId: value.branchId,
        location: value.location,
        phone: value.phone,
        email: value.email,
        password: value.password,
        documents: value.documents,
        role: value.role,
        companyName: value.companyName
      },
      httpOptions
    );
  }
  

   GetProfileData(){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
        return this.http.get<any>(AUTH_API + 'subadmin-auth/profile', httpOptions);
    }

    UpdateAdminProfile(value: {
      companyName: string;
      name: string;
      username: string;
      location: string;
      address: string;
      phone: string;
      email: string;
      branchId:string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.patch(
        AUTH_API + 'subadmin-auth/admin-profile',   { 
          "companyName":value.companyName, 
          "name":value.name, 
          "username":value.username, 
          "location":value.location, 
          "address":value.address, 
          "phone":value.phone, 
          "email":value.email, 
          "branchId":value.branchId,
        },
        httpOptions
      );
    }

    ChangePassword(value: {
      oldPassword: string;
      newPassword: string;
    }){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.post(
        AUTH_API + 'subadmin-auth/change-password',
        { 
        "oldPassword":value.oldPassword, 
        "newPassword":value.newPassword, 
      },
         httpOptions 
      );
    }

    Forgotemailentry(value: {
      email: string;
    }){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.post(
        AUTH_API + 'subadmin-auth/forgot-password',
        { 
        "email":value.email, 
      },
         httpOptions 
      );
    }

    resetPassword(value: {
      email: string;
      otp: number;
      newPassword: string;
    }){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.post(
        AUTH_API + 'subadmin-auth/reset-password',
        { 
        "email":value.email, 
        "otp":value.otp, 
        "newPassword":value.newPassword, 
      },
         httpOptions 
      );
    }

    createVehicle(value: {
      vehicleNo: string;
      vehicleType: string;
      registrationNo: string;
      date: string;
      RC: string;
      polutionExpDate: string;
      fuelType: string;
      branch: string;
      vehicleStatus: string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
        })
      };
    
      return this.http.post(
        AUTH_API + 'vehicle',  
        { 
          vehicleNo: value.vehicleNo,
          vehicleType: value.vehicleType,
          registrationNo: value.registrationNo,
          date: value.date,
          RC: value.RC,
          polutionExpDate: value.polutionExpDate,
          fuelType: value.fuelType,
          branch: value.branch,
          vehicleStatus: value.vehicleStatus,
        },
        httpOptions 
      );
    }

    UpdateVehicle(id: any, value: {
      vehicleNo: string;
      vehicleType: string;
      registrationNo: string;
      date: string;
      RC: string;
      polutionExpDate: string;
      fuelType: string;
      branch: string;
      vehicleStatus: string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.patch(
        AUTH_API + 'vehicle/' + id,
        {
          vehicleNo: value.vehicleNo,
          vehicleType: value.vehicleType,
          registrationNo: value.registrationNo,
          date: value.date,
          RC: value.RC,
          polutionExpDate: value.polutionExpDate,
          fuelType: value.fuelType,
          branch: value.branch,
          vehicleStatus: value.vehicleStatus,
      },
        httpOptions
      );
    }

    DeleteVehicleData(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
      return this.http.delete(
        AUTH_API + 'vehicle/'+id,
        httpOptions
      );
    }

    //city name apis
    createCityname(value: {
      cityName: string;
      state: string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
        })
      };
    
      return this.http.post(
        AUTH_API + 'multi-router/cities',  
        { 
          "cityName": value.cityName,
          "state": value.state,
        },
        httpOptions 
      );
    }

    UpdateCityname(id: any, value: {
      cityName: string;
      state: string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.patch(
        AUTH_API + 'multi-router/cities/' + id,
        {
          "cityName": value.cityName,
          "state": value.state,
      },
        httpOptions
      );
    }

    DeleteCityname(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
      return this.http.delete(
        AUTH_API + 'multi-router/cities/'+id,
        httpOptions
      );
    }

    //add dispatch type
    createdispatch(value: {
      name: string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
        })
      };
    
      return this.http.post(
        AUTH_API + 'multi-router/dispatch-types',  
        { 
          "name": value.name,
        },
        httpOptions 
      );
    }

    GetDispatchtypeData(){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
        return this.http.get(AUTH_API + 'multi-router/dispatch-types', httpOptions);
    }

    Updatedispatch(id: any, value: {
      name: string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.patch(
        AUTH_API + 'multi-router/dispatch-types/' + id,
        {
          "name": value.name,
      },
        httpOptions
      );
    }

    Deletedispatch(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
      return this.http.delete(
        AUTH_API + 'multi-router/dispatch-types/'+id,
        httpOptions
      );
    }
    
    //add extra charges
    creatextracharges(value: {
      fromCity: string;
      toCity:string;
      serviceCharge:string;
      loadingCharge:string;
      cartageCharge:string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
        })
      };
    
      return this.http.post(
        AUTH_API + 'extra-charge',  
        { 
          "fromCity": value.fromCity,
          "toCity": value.toCity,
          "serviceCharge": value.serviceCharge,
          "loadingCharge": value.loadingCharge,
          "cartageCharge": value.cartageCharge,
        },
        httpOptions 
      );
    }

    GetextrachargesData(){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
        return this.http.get(AUTH_API + 'extra-charge', httpOptions);
    }

    Updateextracharges(id: any, value: {
      fromCity: string;
      toCity:string;
      serviceCharge:string;
      loadingCharge:string;
      cartageCharge:string;
    }) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.patch(
        AUTH_API + 'extra-charge/' + id,
        {
          "fromCity": value.fromCity,
          "toCity": value.toCity,
          "serviceCharge": value.serviceCharge,
          "loadingCharge": value.loadingCharge,
          "cartageCharge": value.cartageCharge,
      },
        httpOptions
      );
    }

    Deletecharges(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
      return this.http.delete(
        AUTH_API + 'extra-charge/'+id,
        httpOptions
      );
    }
// 
//Employees Apis
    GetEmployeesData(){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
        return this.http.get(AUTH_API + 'subadmin-auth/subadmins', httpOptions);
    }

    GetEmployees(){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
        return this.http.get(AUTH_API + 'subadmin-auth/employees', httpOptions);
    }
    
  GetUnderBranchEmployees(id:any){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
    return this.http.get(
      AUTH_API + 'subadmin-auth/branch-wise/'+id,
      httpOptions
    );   
  }
  PostData(value: { date: string; }) {

    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
  
    return this.http.post(
      AUTH_API + 'booking/sales-summary-branchwise',  
      { 
        "date": value.date,
       
      },
      httpOptions 
    );
  }


  StatusWiseSummary(){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
      return this.http.get(AUTH_API + 'booking/status-wise-summary',
       httpOptions);
  }

SummaryReport(value:{date:string}){
  const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
    return this.http.post(
      AUTH_API + 'booking/summary-report',  
      { 
        "date": value.date,
       
      },
      httpOptions 
    );
}


BranchData(value:{date:string}){
  const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
    return this.http.post(
      AUTH_API + 'booking/branch-account',  
      { 
        "date": value.date,
       
      },
      httpOptions 
    );
}

ACpartyData(value:{date:string}){
  const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1 // ✅ Added space after 'Bearer'
      })
    };
    return this.http.post(
      AUTH_API + 'booking/acparty-account',  
      { 
        "date": value.date,
       
      },
      httpOptions 
    );
}
AddCompany(value:{
  phone: number;
  address: string;
  state: string;
  customerName: string;
  name: string;
  email: string;
  password: string;
  parentCompanyId: string;

}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'company/subsidiary/register',  { 
      phone: value.phone,
      address: value.address,
      state: value.state,
      customerName: value.customerName,
      name: value.name,
      email: value.email,
      password: value.password,
      parentCompanyId: value.parentCompanyId,
    },
     httpOptions 
  );
}
vendorCreation(value: {
  name: string;
  companyName: string;
  displayName: string;
  address: string;
  workPhone: number;
  mobile: number;
  bankDetails: {
    accountNumber: number;
    accountName: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
  };
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  return this.http.post(
    AUTH_API + 'vendor/create',
    {
      name: value.name,
      companyName: value.companyName,
      displayName: value.displayName,
      address: value.address,
      workPhone: value.workPhone,
      mobile: value.mobile,
      bankDetails: {
        accountNumber: value.bankDetails.accountNumber,
        accountName: value.bankDetails.accountName,
        bankName: value.bankDetails.bankName,
        branchName: value.bankDetails.branchName,
        ifscCode: value.bankDetails.ifscCode
      }
    },
    httpOptions
  );
}
addSubscription(value: {
  plan: string;
  bookingLimit: number;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  return this.http.post(
    AUTH_API + 'company/subscription',
    {
      plan: value.plan,
      bookingLimit: value.bookingLimit
    },
    httpOptions
  );
}



}
