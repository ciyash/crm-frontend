import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/service/admin.service';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-add-extra-charges',
  templateUrl: './add-extra-charges.component.html',
  styleUrls: ['./add-extra-charges.component.scss']
})
export class AddExtraChargesComponent {

   data:any;
            form:FormGroup;
            form1:FormGroup;
            loading:boolean=true;
            msg='';
            errorsMessage='';
            visible: boolean = false;
            repd:any;
            showDialog(row:any) {
                this.visible = true;
                this.repd=row;
            }
            citydata:any;
            constructor(private fb:FormBuilder, private api:AdminService, private router:Router ,private toastr:ToastrService, private bapi:BranchService ){
                this.form = this.fb.group({
                  fromCity: ['', Validators.required],
                  toCity: ['', Validators.required],
                  serviceCharge: ['', Validators.required],
                  loadingCharge: ['', Validators.required],
                  cartageCharge: ['', Validators.required],
                    });

                    this.form1 = this.fb.group({
                      fromCity: ['', ],
                      toCity: ['', ],
                      serviceCharge: ['', ],
                      loadingCharge: ['', ],
                      cartageCharge: ['', ],
                        });
            }
          
            ngOnInit(){
              this.api.GetextrachargesData().subscribe((res:any)=>{
                  console.log(res);
                  this.data=res;
                  this.loading=false;
              });
              this.bapi.GetCities().subscribe((res:any)=>{
                console.log('citys',res);
                this.citydata=res;
              });
            }
          
            Add() {
              const payload = {
                fromCity: this.form.value.fromCity,
                toCity: this.form.value.toCity,
                serviceCharge: this.form.value.serviceCharge,
                loadingCharge: this.form.value.loadingCharge,
                cartageCharge: this.form.value.cartageCharge,
              };
            
              console.log('Final Payload:', payload);
              
              this.api.creatextracharges(payload).subscribe({
                next: (response: any) => {
                  console.log('Extra Charges successfully:', response);
                  this.toastr.success('Create Extra Charges successfully', 'Success');
    
                  setTimeout(() => {
                   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                     this.router.navigate(['/addextracharges']);
                   });
                 }, 500);
                },
                error: (error: any) => {
                  console.error('Extra Charges failed:', error);
                  // alert('Create City Failed. Please try again.');
                  this.toastr.error('Create Extra Charges Failed!', 'Error');
    
                },
              });
            }
    
            edit(id:any) {
              console.log(this.form1.value);
              if (this.form1.valid) {
                const val = {
                  fromCity: this.form1.value.fromCity,
                  toCity: this.form1.value.toCity,
                  serviceCharge: this.form1.value.serviceCharge,
                  loadingCharge: this.form1.value.loadingCharge,
                  cartageCharge: this.form1.value.cartageCharge,
                };
                this.api.Updateextracharges(id, val).subscribe(
                  (a: any) => {
                    if (a?.data) {
                      console.log(a);
                    } else {
                      console.log(a);
                      // this.errorMessage = a.msg.message;
                      this.msg = 'addextracharges Successfully Updated !!!';
                      setTimeout(() => {
                        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                          this.router.navigate(['/addextracharges']);
                        });
                        }, 1000);
                    }
                  },
                  (err: any) => {
                    this.errorsMessage = err.error.message;
                  },
                );
              }
          
              return false;
            }
    
            Delete(id:any) {
              this.api.Deletecharges(id).subscribe(
                (a: any) => {
                  if (a) {
                    console.log('deletedid',a);
                    setTimeout(() => {
                      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/addextracharges']);
                      });
                      }, 1000);
                  } else {
                    console.log(a);
                    // this.errorMessage = a.msg.message;
                    this.msg = 'addextracharges Successfully Updated !!!';
                  }
                },
                (err: any) => {
                   
                },
              );
            return false;
          }
    
          

}
