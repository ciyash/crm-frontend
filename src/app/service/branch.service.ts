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
  AUTH_API: any;

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
//
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

  
    GetBranchbyCity(cityName: any) {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
      return this.http.get(AUTH_API + 'branch/city/' + encodeURIComponent(cityName), httpOptions);
      
    }
  




  FilterBookingServiceCharges(value: { fromCity: string; toCity: string }) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    };
    return this.http.post(AUTH_API + 'extra-charge/filter-city-wise', 
      { 
        fromCity: value.fromCity,
        toCity: value.toCity
      }, 
      httpOptions
    );
  }

  searchUser(qry:string) {
    const token1 = this.token.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token1
      })
    };
    return this.http.get(
      AUTH_API + `booking/users/search?query=${qry}`,
      httpOptions
    );
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
    serviceCharges:number;
    hamaliCharges:number;
    doorDeliveryCharges:number;
    doorPickupCharges:number;
    valueOfGoods:number;
    grandTotal:number;

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
      "serviceCharges": value.serviceCharges,
      "hamaliCharges": value.hamaliCharges,
      "doorDeliveryCharges": value.doorDeliveryCharges,
      "doorPickupCharges":value.doorPickupCharges,
      "valueOfGoods": value.valueOfGoods,
      "grandTotal":value.grandTotal, 
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

  
BookingsPage(page: number, limit: number) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  const pageDetails = `page=${page}&limit=${limit}`;
  return this.http.get(
    AUTH_API + `booking/pages?${pageDetails}`,
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


// cancelBooking(value: { grnlrn: string }) {
//   const token1 = this.token.getToken();
//   const httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + token1
//     })
//   };

//   return this.http.post(
//     AUTH_API + 'booking/grnNolrNo/',
//     value,          // ✅ Body goes here
//     httpOptions     // ✅ Headers go here
//   );
// }






GetQrGRNnumber(id:any){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
  return this.http.get(
    AUTH_API + 'parcel-loading/grnNo/'+id,
    httpOptions
  );   
}

GetQrUnloadGRNnumber(id:any){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
  return this.http.get(
    AUTH_API + 'parcel-unloading/grnNo/'+id,
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
    AUTH_API + 'parcel-loading/parcel-loding-load',  { 
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
  loadingType:string;
  fromBranch: string;
  toBranch:string;
  vehicalNumber:string;
  driverName:string;
  driverNo:string;
  fromBookingDate:string;
  toBookingDate:string;
  fromCity:string;
  // userName:string;
  senderName:string,
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
      "loadingType": value.loadingType,
      "fromBranch": value.fromBranch,
      "toBranch": value.toBranch,
    "vehicalNumber": value.vehicalNumber,
    "driverName": value.driverName,
    "driverNo": value.driverNo,
    "fromBookingDate": value.fromBookingDate,
  "toBookingDate": value.toBookingDate,
  "fromCity": value.fromCity,
  // "userName": value.userName,
  'senderName':value.senderName,
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
  vehicalNumber:string;
  grnNo: [];
  bookingType:string;
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
  "vehicalNumber": value.vehicalNumber,
  "grnNo": value.grnNo,
  "bookingType":value.bookingType,
    },
     httpOptions 
  );
}

ParcelOfflineReport(value:{
  fromDate: string;  
  toDate:string   
  fromCity:string  
  toCity: [];   
  fromBranch:string;  
  dropBranch:string
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'parcel-loading/parcel-offline-report',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
    "fromCity": value.fromCity,
    "toCity": value.toCity,
    "fromBranch":value.fromBranch,
    "dropBranch":value.dropBranch,
    },
     httpOptions 
  );
}



// parcel -branch
postBranchLoading(value: {
  fromBookingDate: string;
  toBookingDate: string;
  fromBranch: string;
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
      "fromBookingDate": value.fromBookingDate,  
      "toBookingDate": value.toBookingDate,
      "fromBranch": value.fromBranch
    },
    httpOptions
  );
}

BranchtoBranchLoad(value: {
  loadingType: string;
  lrNumber: [];
  grnNo: [];
  fromBookingDate:string;
  toBookingDate:string;
  fromBranch:string;
  toBranch:string;
  vehicalNumber:string;
  remarks:string;

}): Observable<any> {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  return this.http.post(
    AUTH_API + 'parcel-loading/branch-to-branch-post',  
    {
      "loadingType": value.loadingType,
      "lrNumber": value.lrNumber,
      "grnNo": value.grnNo,
      "fromBookingDate": value.fromBookingDate,
      "toBookingDate": value.toBookingDate,
      "fromBranch": value.fromBranch,
      "toBranch":value.toBranch,
      "vehicalNumber":value.vehicalNumber,
      "remarks":value.remarks
    },
    httpOptions
  );
}

//branch to branch unloading apis
postBranchtobranchUnLoadingFilter(value: {
  fromLoadingDate: string;
  toLoadingDate: string;
  fromBranch: string;
  toBranch:string;
}): Observable<any> {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  return this.http.post(
    AUTH_API + 'parcel-unloading/branch-to-branch-load',  
    {
      "fromLoadingDate": value.fromLoadingDate,  
      "toLoadingDate": value.toLoadingDate,
      "fromBranch": value.fromBranch,
      "toBranch": value.toBranch,
    },
    httpOptions
  );
}

BranchtobranchUnLoading(value: {
  grnNo: string;
  lrNumber: string;
  fromDate: string;
  toDate:string;
  branch:string;
  unloadBranch:string;
  remarks:string;
}): Observable<any> {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  return this.http.post(
    AUTH_API + 'parcel-unloading/branch-to-branch-post',  
    {
      "grnNo": value.grnNo,  
      "lrNumber": value.lrNumber,
      "fromDate": value.fromDate,
      "toDate": value.toDate,
      "branch":value.branch,
      "unloadBranch":value.unloadBranch,
      "remarks": value.remarks,
    },
    httpOptions
  );
}

//packages type apis
packageType(value:{
  name:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'multi-router/package-types',  { 
      "name": value.name,
    },
     httpOptions 
  );
}

GetPAckagesType(){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
    return this.http.get<any>(AUTH_API + 'multi-router/package-types', httpOptions);
}

UpdatePackagestype(id: any, value: {
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
        AUTH_API + 'multi-router/package-types/' + id,
        {
          name: value.name,
      },
        httpOptions
      );
    }



    cancelBooking(id:any, value:{ 
        refundCharge:string,
        refundAmount:string,
        date:string,
       }){
        const token1 = this.token.getToken();
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token1
          })
        };
        return this.http.post(
          AUTH_API + 'booking/cancelBooking/'+id,
          {
            refundCharge:value.refundCharge,
            refundAmount:value.refundCharge,
            date:value.date,
          },
          httpOptions     
        );
      }





    DeletePackagesType(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
      return this.http.delete(
        AUTH_API + 'multi-router/package-types/'+id,
        httpOptions
      );
    }

    //Parcel Vouchers details
    ParcelVouchersDetails(value: {
      fromDate: string;
      toDate: string;
      vehicalNumber: string;
      fromCity:string;
      toCity:string;
      fromBranch:string;
    }): Observable<any> {
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      };
    
      return this.http.post(
        AUTH_API + 'parcel-loading/offline-parcel-voucher-details',  
        {
          "fromDate": value.fromDate,  
          "toDate": value.toDate,
          "vehicalNumber": value.vehicalNumber,
          "fromCity": value.fromCity,
          "toCity":value.toCity,
          "fromBranch": value.fromBranch,
        },
        httpOptions
      );
    }

    GetVouchersListData(id:any){
      const token1 = this.token.getToken();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1
        })
      }
        return this.http.get<any>(AUTH_API + 'parcel-loading/vocherNoUnique/'+id, httpOptions);
    }




// branch/branchUniqueId/HYAM2687

getbranchId(id: any) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.get(AUTH_API + 'branch/branchUniqueId/' + id, httpOptions);
}

ReceivedParcelUpdate(value: {
  grnNo: string;
  receiverName:string;
  receiverMobile:string;
  
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/receivedBooking',
    {
      grnNo: value.grnNo,
      receiverName:value.receiverName,
      receiverMobile:value.receiverMobile,
      
  },
    httpOptions
  );
}

//reports Apis

ParcelBookingReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  bookingStatus: string;
  bookingType: string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-booking-reports',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      bookingStatus: value.bookingStatus,
      bookingType: value.bookingType,
  },
    httpOptions
  );
}




// parcel cancel
ParcelCancelReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  bookingType: string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-cancel-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      bookingType: value.bookingType,
  },
    httpOptions
  );
}





BookingCancel(value: {
  refundCharge: string;
  refundAmount: string;
  cancelDate: string;
  cancelByUser: string;
  cancelBranch: string;
  cancelCity: string;
}, grnNo: string) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };

  // Injecting grnNo into the URL dynamically
  return this.http.post(
    `${AUTH_API}booking/cancelBooking/${grnNo}`,  // Use template literal to insert grnNo
    {
      refundCharge: value.refundCharge,
      refundAmount: value.refundAmount,
      cancelDate: value.cancelDate,
      cancelByUser: value.cancelByUser,
      cancelBranch: value.cancelBranch,
      cancelCity: value.cancelCity
    },
    httpOptions
  );
}









AllParcelBookingReport(value: {
  startDate:string;
  endDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
  bookingStatus: string;
  vehicalNumber: string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/all-parcel-booking-report',
    {
      startDate:value.startDate,
      endDate: value.endDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
      bookingStatus: value.bookingStatus,
      vehicalNumber: value.vehicalNumber,
  },
    httpOptions
  );
}

ParcelReportSno(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-report-serialNo',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
  },
    httpOptions
  );
}

ParcelBookingSummeryReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-booking-summary-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
  },
    httpOptions
  );
}

ParcelBookingMobileNumber(value: {
  fromDate: string;
  toDate: string;
  mobile: string;
  reportType: string;
  bookingType:string;
  bookingStatus:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-booking-mobileNumber',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      mobile: value.mobile,
      reportType: value.reportType,
      bookingType: value.bookingType,
      bookingStatus: value.bookingStatus,
  },
    httpOptions
  );
}

ParcelBookingRegularCustomer(value: {
  fromDate: string;
  toDate: string;
  name:string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/regular-customer-booking',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      name:value.name,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
  },
    httpOptions
  );
}

ParcelBranchWiseReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  pickUpBranch: string;
  bookedBy:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/branch-Wise-collection-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      pickUpBranch: value.pickUpBranch,
      bookedBy: value.bookedBy,
  },
    httpOptions
  );
}


ConsolidatedReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  pickUpBranch: string;
  bookedBy:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-branch-consolidated-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      pickUpBranch: value.pickUpBranch,
      bookedBy: value.bookedBy,
  },
    httpOptions
  );
}




SenderRecevierGstReport(value: {
  fromDate: string;
  toDate: string;
  branchCity: string;
  branchName: string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/sender-receiver-gst-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      branchCity: value.branchCity,
      branchName: value.branchName,
  },
    httpOptions
  );
}

PendingDeliveryStockReport(value: {
  fromDate:string;
  toDate:string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/pending-delivery-stock-report',
    {
      fromDate:value.fromDate,
      toDate:value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
  },
    httpOptions
  );
}

PendingDeliveryLuggageReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
  bookingType:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/pending-delivery-luggage-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
      bookingType:value.bookingType,
  },
    httpOptions
  );
}

ParcelReceivedStockReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
  receiverName:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-received-stock-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
      receiverName:value.receiverName,
  },
    httpOptions
  );
}

DeliveryStockReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
  receiverName:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/delivered-stock-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
      receiverName:value.receiverName,
  },
    httpOptions
  );
}

DispatchedMemoReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
  vehicalNumber:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/dispatched-memo-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
      vehicalNumber:value.vehicalNumber,
  },
    httpOptions
  );
}

ParcelIncomingReport(value: {
  fromDate: string;
  toDate: string;
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
  dropBranch:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-incoming-luggages-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
      dropBranch: value.dropBranch,
  },
    httpOptions
  );
}

PendingDispatchedStockReport(value: {
     fromDate: string,
      toDate: string,
  fromCity: string;
  toCity: string;
  pickUpBranch:string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/pending-dispatch-stock-report',
    {
      fromDate: value.fromDate,
      toDate: value.toDate,
      fromCity: value.fromCity,
      toCity: value.toCity,
      pickUpBranch: value.pickUpBranch,
  },
    httpOptions
  );
}

//parcel dispatched report 
DispatchedReport(value:{
  fromDate: string;
  toDate:string;
  fromCity: string;
  toCity: string;
  fromBranch:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'parcel-loading/dispatched-stock-report',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
    "fromCity": value.fromCity,
    "toCity": value.toCity,
    "fromBranch": value.fromBranch,
    },
     httpOptions 
  );
}

//CF Master Apis
AddCfmaster(value:{
  gst: string;
  country: string;
  state:string;
  city: string;
  code: string;
  name:string;
  email:string;
  phone:number;
  address:string;
  senderName:string;
  senderMobile:string;
  creditDaysLimit:string;
  exDate:string;

}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'cfmaster',  { 
      "gst": value.gst,
      "country": value.country,
      "state": value.state,
      "city": value.city,
      "code": value.code,
      "name": value.name,
      "email": value.email,
      "phone": value.phone,
      "address": value.address,
      "senderName": value.senderName,
      "senderMobile": value.senderMobile,
      "creditDaysLimit": value.creditDaysLimit,
      "exDate": value.exDate,
    },
     httpOptions 
  );
}

GetcfmasterData(){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
  return this.http.get(
    AUTH_API + 'cfmaster',
    httpOptions
  );   
}

searchCfUser(qry:string) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.get(
    AUTH_API + `cfmaster?query=${qry}`,
    httpOptions
  );
}

UpdateCfmaster(id: any, value:{
  gst: string;
  state:string;
  city: string;
  code: string;
  name:string;
  email:string;
  phone:number;
  address:string;
  senderName:string;
  senderMobile:string;
  creditDaysLimit:string;
  exDate:string;
  isActive:string;
  isPostPaid:string;

}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.patch(
    AUTH_API + 'cfmaster/'+id,  { 
      "gst": value.gst,
      "state": value.state,
      "city": value.city,
      "code": value.code,
      "name": value.name,
      "email": value.email,
      "phone": value.phone,
      "address": value.address,
      "senderName": value.senderName,
      "senderMobile": value.senderMobile,
      "creditDaysLimit": value.creditDaysLimit,
      "exDate": value.exDate,
      "isActive": value.isActive,
      "isPostPaid": value.isPostPaid,
    },
     httpOptions 
  );
}


DeleteCfmaster(id:any){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
  return this.http.delete(
    AUTH_API + 'cfmaster/'+id,
    httpOptions
  );
}

AddCfmasterCharges(value:{
  agentName: string;
  chargeName: string;
  fromCity:string;
  toCity: string;
  charge: string;
  modeOnPrice:string;
  itemName:string;
  dispatchType:number;
  isActive:string;

}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'cfextra-charge',  { 
      "agentName": value.agentName,
      "chargeName": value.chargeName,
      "fromCity": value.fromCity,
      "toCity": value.toCity,
      "charge": value.charge,
      "modeOnPrice": value.modeOnPrice,
      "itemName": value.itemName,
      "dispatchType": value.dispatchType,
      "isActive": value.isActive,
    },
     httpOptions 
  );
}

GetCFMasterChargesID(id:any){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  }
  return this.http.get(
    AUTH_API + 'cfextra-charge/'+id,
    httpOptions
  );
}

//cf master voucher generate apis
LoadVouchers(value:{
  fromDate: string;
  toDate: string;
  senderName:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'voucher-generate/credit-voucher-generate',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
      "senderName": value.senderName,
    },
     httpOptions 
  );
}

VoucherGenerate(value:{
  fromDate: string;
  toDate: string;
  grnNo:string;
  creditForAgent:string;
  fromBranch:string;
  toBranch:string;
  consignor:string;
  bookingStatus:string;
  charge:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'voucher-generate',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
      "grnNo": value.grnNo,
      "creditForAgent": value.creditForAgent,
      "fromBranch": value.fromBranch,
      "toBranch": value.toBranch,
      "consignor": value.consignor,
      "bookingStatus": value.bookingStatus,
      "charge": value.charge,
    },
     httpOptions 
  );
}

VoucherDetailsLoad(value:{
  fromDate: string;
  toDate: string;
  senderName:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'voucher-generate/voucher-details',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
      "senderName": value.senderName,
    },
     httpOptions 
  );
}

GetVoucherDetails(value:{
  fromDate: string;
  toDate: string;
  senderName:string;
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'voucher-generate/voucher-details-print',  { 
      "fromDate": value.fromDate,
      "toDate": value.toDate,
      "senderName": value.senderName,
    },
     httpOptions 
  );
}


GetSearch(value: {
  mobile: string;
  searchCustomer: string;
  grnNo: string;
  lrNumber: string;
}) {
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/search-data',
    value,
    httpOptions
  );

}



ParcelStatusdateReport(value:{
  startDate:string,
  endDate:string, 
  fromCity:string, 
  toCity:string,
   bookingStatus:string
}){
  const token1 = this.token.getToken();
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token1
    })
  };
  return this.http.post(
    AUTH_API + 'booking/parcel-status-date-difference-report',  { 
      "endDate": value.endDate,
      "startDate": value.startDate,
      "fromCity": value.fromCity,
      "toCity":value.toCity,
      "bookingStatus":value.bookingStatus
    },
     httpOptions 
  );
}

}
  





 




// updateBooking(id: any, value:{
//   bookedBy: string;
//     fromCity: string;
//     toCity: string;
//     pickUpBranch:string;
//     dropBranch:string;
//     totalPrice:number;
//     location:string;
//     dispatchType:string;
//     bookingType:string;
//     senderName:string;
//     senderMobile:number;
//     senderAddress:string;
//     senderGst:string;
//     receiverName:string;
//     receiverMobile:number;
//     receiverAddress:string;
//     receiverGst:string;
//     adminUniqueId:string;
//     packages: [];
//     serviceCharges:number;
//     hamaliCharges:number;
//     doorDeliveryCharges:number;
//     doorPickupCharges:number;
//     valueOfGoods:number;
//     grandTotal:number;

// }){
//   const token1 = this.token.getToken();
//   const httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + token1
//     })
//   };
//   return this.http.patch(
//     AUTH_API + 'booking/' + id,
//     {
//       bookedby: value.bookedBy,
//       fromCity: value.fromCity,
//       toCity: value.toCity,
//       pickUpBranch: value.pickUpBranch,
//       dropBranch: value.dropBranch,
//       totalPrice: value.totalPrice,
//       location: value.location,
//       dispatchType: value.dispatchType,
//       bookingType: value.bookingType,
//       senderName: value.senderName,
//       senderMobile: value.senderMobile,
//       senderAddress: value.senderAddress,
//       senderGst: value.senderGst,
//       receiverName: value.receiverName,
//       receiverMobile: value.receiverMobile,
//       receiverAddress: value.receiverAddress,
//       receiverGst: value.receiverGst,  // ✅ fixed typo
//       adminUniqueId: value.adminUniqueId,
//       packages: value.packages,
//       serviceCharges: value.serviceCharges,
//       hamaliCharges: value.hamaliCharges,
//       doorDeliveryCharges: value.doorDeliveryCharges,
//       doorPickupCharges: value.doorPickupCharges,
//       valueOfGoods: value.valueOfGoods,
//       grandTotal: value.grandTotal
//     },
//     httpOptions
//   );
  
// } 




