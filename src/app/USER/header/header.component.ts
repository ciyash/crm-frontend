import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  model: any[] = [];

  constructor(private token: TokenService) {}

  logout() {
    this.token.signOut();
  }

  ngOnInit() {
    this.model = [];
  
    if (this.token.isAdmin()) {
      this.model = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/createbranch'] },
        { label: 'Create Branch', icon: 'pi pi-user-edit', routerLink: ['/createbranch'] },
        { label: 'Create Employee', icon: 'pi pi-fw pi-user-edit', routerLink: ['/createemployee'] },
      ];
    }
  
    if (this.token.isSubAdmin()) {
      this.model = [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/adashboard'] },
        { label: 'Profile', icon: 'pi pi-fw pi-user-edit', routerLink: ['/aprofile'] },
      ];
    }
  
    if (this.token.isEmployee()) {
      this.model = [
        { label: 'Dashboard', icon: 'pi pi-database', routerLink: ['/booking'] },
        {
          label: 'Bookings',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Parcel Booking', routerLink: ['/booking'] },
            { label: 'Offline Loading', routerLink: ['/parcelloading'] },
            { label: 'Branch to Branch Loading', routerLink: ['/booking'] },
            { label: 'Booking Report', routerLink: ['/bookingreport'] },
            { label: 'Parcel Unloading', routerLink: ['/parcelunloading'] },
            { label: 'Parcel to Branch', routerLink: ['/parcel-branch'] },

          ]
        },
        { label: 'Parcel Agent', icon: 'pi pi-fw pi-file', routerLink: ['/booking'] },
        { label: 'Parcel Report', icon: 'pi pi-fw pi-file', routerLink: ['/booking'] },
        { label: 'Others', icon: 'pi pi-fw pi-file', routerLink: ['/booking'] },
      ];
    }
  
    if (this.token.isAccountant()) {
      this.model = [
        { label: 'Reports', icon: 'pi pi-fw pi-file', routerLink: ['/reports'] },
      ];
    }
  
    if (this.token.isSuperviser()) {
      this.model = [
        { label: 'Tasks', icon: 'pi pi-fw pi-briefcase', routerLink: ['/tasks'] },
      ];
    }
  
    if (this.token.isDriver()) {
      this.model = [
        { label: 'Delivery', icon: 'pi pi-fw pi-truck', routerLink: ['/delivery'] },
      ];
    }
  }
  

  onKeydown(event: KeyboardEvent) {
    const nodeElement = event.target as HTMLDivElement;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }

}