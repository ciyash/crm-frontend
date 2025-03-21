import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

const AUTH_API = 'https://cargo-backend-bpq4.onrender.com/'

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private baseUrl = environment.baseUrl
  private storageKey = 'adminData';

  constructor(private http: HttpClient ,private route:Router, private token:TokenService ) {}

  // GetProfile(id:any){
  //   const token1 = this.token.getToken();
  //   return this.http.get(
  //     AUTH_API + 'subadmin-auth/'+id,
  //     httpOptions
  //   );
  // }

  // Generic function to handle all POST API calls
  postData(endpoint: string, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${endpoint}`;
    return this.http.post(apiUrl, data);
  }

  GetProfileData(){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
    return this.http.get(
      AUTH_API + 'subadmin-auth/profile',
      httpOptions
    );   
  }

  GetCities(){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
      return this.http.get(AUTH_API + 'multi-router/cities', httpOptions);
  }


  
  GetBranch(){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
      return this.http.get(AUTH_API + 'branch', httpOptions);
  }


  createBooking(value:{
    bookedBy: string;
    fromCity: string;
    toCity: string;
    pickUpBranch:string;
    dropBranch:string;
    totalPrice:number;
    location:string;
    dispatchType:string;
    bookingType:string;
    senderName:string;
    senderMobile:number;
    senderAddress:string;
    senderGst:string;
    receiverName:string;
    receiverMobile:number;
    receiverAddress:string;
    receiverGst:string;
    adminUniqueId:string;
    packages: [];
  }){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    };
    return this.http.post(
      AUTH_API + 'booking',  { 
        "bookedby": value.bookedBy,
      "fromCity": value.fromCity,
      "toCity": value.toCity,
      "pickUpBranch": value.pickUpBranch,
      "dropBranch": value.dropBranch,
      "totalPrice": value.totalPrice,
      "location": value.location,
      "dispatchType": value.dispatchType,
      "bookingType": value.bookingType,
      "senderName": value.senderName,
      "senderMobile": value.senderMobile,
      "senderAddress": value.senderAddress ,
      "senderGst": value.senderGst,
      "receiverName": value.receiverName,
      "receiverMobile": value.receiverMobile,
      "receiverAddress": value.receiverAddress,
      "reciverGst":value.receiverGst,
      "adminUniqueId": value.adminUniqueId,
      "packages":value.packages, 
      },
       httpOptions 
    );
  }

  getData(endpoint: string, paramsObj?: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`; // Ensure no leading slash
    let params = new HttpParams();
    if (paramsObj) {
      Object.keys(paramsObj).forEach((key) => {
        params = params.append(key, paramsObj[key]);
      });
    }
  
    return this.http.get(apiUrl, { params });
  }

  GetBookings(){
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    }
      return this.http.get<any>(AUTH_API + 'booking', httpOptions);
  }




  

  
BookingsPage(page: number, perPage: number) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  const pageDetails = `page=${page}&per_page=${perPage}`;
  return this.http.get(
    AUTH_API + `Admin/booking/pages?${pageDetails}`,
    httpOptions
  );
}


GetGRNnumber(id:any){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
  return this.http.get(
    AUTH_API + 'booking/grnNo/'+id,
    httpOptions
  );   
}


FilterParcelLoading(value:{
  startDate: string;
  endDate:string;
  fromCity: string;
  toCity: [];
  pickUpBranch:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/filterDates',  { 
      "startDate": value.startDate,
      "endDate": value.endDate,
    "fromCity": value.fromCity,
    "toCity": value.toCity,
    "pickUpBranch": value.pickUpBranch,
    
    },
     httpOptions 
  );
}

ParcelLoading(value:{
  fromBranch: string;
  toBranch:string;
  vehicalNumber:string;
  driverName:string;
  driverNo:string;
  fromBookingDate:string;
  toBookingDate:string;
  fromCity:string;
  userName:string;
  toCity: [];
  grnNo: [];
  lrNumber : [];
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'parcel-loading',  { 
      "fromBranch": value.fromBranch,
      "toBranch": value.toBranch,
    "vehicalNumber": value.vehicalNumber,
    "driverName": value.driverName,
    "driverNo": value.driverNo,
    "fromBookingDate": value.fromBookingDate,
  "toBookingDate": value.toBookingDate,
  "fromCity": value.fromCity,
  "userName": value.userName,
  "toCity": value.toCity,
  "grnNo": value.grnNo,
  "lrNumber": value.lrNumber,
    },
     httpOptions 
  );
}


GetParcelLodingData(){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
    return this.http.get<any>(AUTH_API + 'parcel-loading', httpOptions);
}

VehicleData(){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
    return this.http.get<any>(AUTH_API + 'vehicle', httpOptions);
}

FilterParcelUnLoading(value:{
  fromDate: string;
  toDate:string;
  fromCity: [];
  toCity: string;
  vehicalNumber:string;
  branch:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'parcel-unloading/parcel-filter-Unloading',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
    "fromCity": value.fromCity,
    "toCity": value.toCity,
    "vehicalNumber": value.vehicalNumber,
    "branch": value.branch,
    },
     httpOptions 
  );
}

ParcelUnLoading(value:{
  fromBookingDate: string;
  toBookingDate:string;
  fromCity: [];
  toCity:string;
  branch:string;
  vehicleNo:string;
  grnNo: [];
  bookingType:string;
  lrNumber:[]
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'parcel-unloading',  { 
    "fromBookingDate": value.fromBookingDate,
  "toBookingDate": value.toBookingDate,
  "fromCity": value.fromCity,
  "toCity": value.toCity,
  "branch": value.branch,
  "vehicleNo": value.vehicleNo,
  "grnNo": value.grnNo,
  "bookingType":value.bookingType,
  "lrNumber":value.lrNumber
    },
     httpOptions 
  );
}

ParcelOfflineReport(value:{
  fromBookingDate: string;
  toBookingDate:string;
  fromCity: string;
  toCity: string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'parcel-loading/offline-report',  { 
      "fromBookingDate": value.fromBookingDate,
      "toBookingDate": value.toBookingDate,
    "fromCity": value.fromCity,
    "toCity": value.toCity,
    },
     httpOptions 
  );
}


patchData(endpoint: string, data: any): Observable<any> {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  
  const apiUrl = `${AUTH_API}${'parcel-loading/branch-to-branch'}`; 
  return this.http.patch(apiUrl, data, httpOptions);
}


  // profile update
  profileData(endpoint: string, data: any): Observable<any> {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    };
    const apiUrl = `${AUTH_API}${'subadmin-auth/update-profile'}`; // Ensures no leading slash
    return this.http.patch(apiUrl, data, httpOptions);
  }


// GNR NO FILTER

GNRfilter(){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
    return this.http.get<any>(AUTH_API + 'booking/pages', httpOptions);
}

// parcel -branch
postBranchLoading(value: {
  fromDate: string;
  toDate: string;
  pickUpBranch: string;
}): Observable<any> {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  return this.http.post(
    AUTH_API + 'parcel-loading/branch-to-branch-load',  
    {
      "fromDate": value.fromDate,  
      "toDate": value.toDate,
      "pickUpBranch": value.pickUpBranch
    },
    httpOptions
  );
}

// get search by names by data 
getNames(){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
    return this.http.get<any>(AUTH_API + 'booking/search/query', httpOptions);
}

}

