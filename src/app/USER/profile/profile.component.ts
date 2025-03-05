import { Component } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileData:any
constructor( private service:BranchService){}

}
