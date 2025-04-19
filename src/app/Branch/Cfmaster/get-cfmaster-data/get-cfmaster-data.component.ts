import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';

declare var bootstrap: any;
@Component({
  selector: 'app-get-cfmaster-data',
  templateUrl: './get-cfmaster-data.component.html',
  styleUrls: ['./get-cfmaster-data.component.scss']
})
export class GetCfmasterDataComponent {
  data:any;
  loading:boolean=true;
  visible: boolean = false;
  repd: any = {};
  showDialog(row:any) {
      this.visible = true;
      this.repd=row;
  }
  form:FormGroup;
  errorsMessage='';
  msg='';
  visible1: boolean = false;
  repd1: any = {};
  showDialog1(row:any) {
      this.visible1 = true;
      this.repd1=row;
  }
  form1:FormGroup;
  citydata:any;
  scdata: any[] = []; // store response
  selectedRow: any;
  constructor(private fb:FormBuilder, private api:BranchService, private messageService:MessageService, private router:Router, private bapi:BranchService, private activeroute:ActivatedRoute, private toastr:ToastrService){
        this.form = this.fb.group({
                gst: ['',],
                state:['', ],
                city:['', ],
                code:['', ],
                name:['', ],
                phone:['', ],
                email:['', ],
                address:['', ],
                senderName:['', ],
                senderMobile:['', ],
                creditDaysLimit:['', ],
                exDate:['', ],
                isActive:[false ],
                isPostPaid:[true],
                  });

                   this.form1 = this.fb.group({
                                 agentName: ['',],
                                 chargeName:['', Validators.required],
                                 fromCity:['', Validators.required],
                                 toCity:['', ],
                                 charge:['', Validators.required],
                                 modeOnPrice:['', Validators.required],
                                 itemName:['', Validators.required],
                                 dispatchType:['', Validators.required],
                                 isActive:[false],
                                    });
  }

  ngOnInit(){
    this.api.GetcfmasterData().subscribe((res:any)=>{
      console.log('cfdata',res);
      this.data=res.data;
      this.loading=false;
    });
    this.GetCities();
  }

  GetCities(){
    this.api.GetCities().subscribe((res:any)=>{
      console.log('citys',res);
      this.citydata=res;
    });
  }

 

  getsetcharges(id: any) {
    this.api.GetCFMasterChargesID(id).subscribe((res: any) => {
      console.log(res, 'charges');
      this.scdata = res;
      const modal: any = new bootstrap.Modal(document.getElementById('chargesModal'));
      modal.show();
    });
  }

  edit(id:any){

    console.log(this.form.value);
    if (this.form.valid) {
      const val = {
        gst: this.form.value.gst,
        state : this.form.value.state,
        city: this.form.value.city,
        code : this.form.value.code,
        name: this.form.value.name,
        email : this.form.value.email,
        phone: this.form.value.phone,
        address : this.form.value.address,
        senderName: this.form.value.senderName,
        senderMobile : this.form.value.senderMobile,
        creditDaysLimit: this.form.value.creditDaysLimit,
        exDate : this.form.value.exDate,
        isActive: this.form.value.isActive,
        isPostPaid : this.form.value.isPostPaid,
      };
      this.api.UpdateCfmaster(id, val).subscribe(
        (a: any) => {
          if (a?.data) {
            console.log(a);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Packages Type Update Successfully' });
           
          } else {
            console.log(a);
            
            this.msg = 'Packages Type Successfully Updated !!!';
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/getcfmasterdata']);
              });
              }, 1000);
          }
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Packages Type not added' });
          this.errorsMessage = err.error.message;
        },
      );
    }

    return false;
  }

  Delete(id:any) {
    this.api.DeleteCfmaster(id).subscribe(
      (a: any) => {
        if (a) {
          console.log('deletedid',a);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Delete CF Master Type Successfully' });
          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/getcfmasterdata']);
            });
            }, 1000);
        } else {
          console.log(a);
          // this.errorMessage = a.msg.message;
          this.msg = 'CF Master Successfully Delete !!!';
        }
      },
      (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Delete CF Master Type Somthing wrong' });
      },
    );
  return false;
}

setcharges() {
  const payload = {
    agentName: this.form1.value.agentName,
    chargeName: this.form1.value.chargeName,
    fromCity : this.form1.value.fromCity,
    toCity: this.form1.value.toCity,
    charge : this.form1.value.charge,
    modeOnPrice: this.form1.value.modeOnPrice,
    itemName : this.form1.value.itemName,
    dispatchType: this.form1.value.dispatchType,
    isActive: this.form1.value.isActive,
  };
  console.log('Final Payload:', payload);
  this.api.AddCfmasterCharges(payload).subscribe({
    next: (response: any) => {
      console.log('Master successfully:', response);
      
      setTimeout(() => {
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
         this.router.navigate(['/getcfmasterdata']);
       });
     }, 500);
    },
    error: (error: any) => {
      console.error('Create Master Type failed:', error);
      alert('Create Master Type Failed. Please try again.');
    },
  });
}


charges(id:any){
  this.router.navigate(['/setcharges/'+id]);
}

}
