import { Component } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
constructor( private token :TokenService){}
logout(){
  this.token.signOut();
}
}