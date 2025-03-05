import { Component } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
constructor( private token :BranchService){}
logout(){
  this.token.signout();
}
}