import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-set-charges',
  templateUrl: './set-charges.component.html',
  styleUrls: ['./set-charges.component.scss']
})
export class SetChargesComponent {
  id:any;
  form:FormGroup;
  constructor(private activeroute:ActivatedRoute, private api:BranchService, private fb:FormBuilder, private router:Router){
        this.form = this.fb.group({
               agentName: [this.id],
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
    this.id = this.activeroute.snapshot.params['agentName'];
    this.api.GetCFMasterChargesID(this.id).subscribe((res:any)=>{
      console.log(res);
    })
  }

  Add() {
    const payload = {
      agentName: this.form.value.agentName,
      chargeName: this.form.value.chargeName,
      fromCity : this.form.value.fromCity,
      toCity: this.form.value.toCity,
      charge : this.form.value.charge,
      modeOnPrice: this.form.value.modeOnPrice,
      itemName : this.form.value.itemName,
      dispatchType: this.form.value.dispatchType,
      isActive: this.form.value.isActive,
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


}
