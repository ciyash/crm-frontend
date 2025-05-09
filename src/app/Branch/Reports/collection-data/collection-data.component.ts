import { state } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/service/branch.service';


@Component({
  selector: 'app-collection-data',
  templateUrl: './collection-data.component.html',
  styleUrls: ['./collection-data.component.scss']
})
export class CollectionDataComponent {
  data: any[] = [];
  collectionReport: any;
  pfdata: any;
  today = new Date();


constructor(private router: Router,private api:BranchService) {
  const navigation = this.router.getCurrentNavigation();
  const stateData = navigation?.extras?.state?.['data'];
  this.collectionReport=stateData
  console.log("collectionReport:",this.collectionReport);
  
}
ngOnInit(){
  this.getProfileData()
}
  getProfileData() {
    this.api.GetProfileData().subscribe((res: any) => {
      this.pfdata = res;
      console.log( 'profiledata:',this.pfdata);
    });
  }



}
