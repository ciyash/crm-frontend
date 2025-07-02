import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service.service';
import { BranchService } from 'src/app/service/branch.service';
import { TokenService } from 'src/app/service/token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  model: any[] = [];
  id: any;
  data: any;

  constructor(
    private token: TokenService,
    private api: BranchService,
    private activeroute: ActivatedRoute
  ) {}

  logout() {
    this.token.signOut();
  }

  ngOnInit() {
    this.model = [];

    if (this.token.isAdmin()) {
      this.model = [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/dashboard'],
        },

        {
          label: 'Bookings ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Parcel Booking', routerLink: ['/booking'] },
            { label: 'Offline Loading', routerLink: ['/parcelloading'] },
            { label: 'Parcel Unloading', routerLink: ['/parcelunloading'] },
            { label: 'Branch to Branch Loading', routerLink: ['/parcel-branch'] },
            { label: 'Parcel Delivery', routerLink: ['/parcel-delivery'] },
            { label: 'Cancel Booking', routerLink: ['/cancel-booking'] },
            { label: 'Parcel Status Details', routerLink: ['/gnrnumberstatus'] },
            { label: 'Branch to Branch Unloading', routerLink: ['/barnchtobranchunloading'] },
            { label: 'Vouchers List Offline', routerLink: ['/voucherslistoffline'] },
          ]
        },
        
        {
          label: 'Parcel Agent ▼',
          icon: 'pi pi-fw pi-file',
          items: [
            { label: 'CF Master', routerLink: ['/getcfmasterdata'] },
            { label: 'CF Voucher Generate', routerLink: ['/creditvouchergenerate'] },
            { label: 'CF Voucher Details', routerLink: ['/voucherdetailscf'] },
          ],
        },
        {
          label: 'Parcel Report ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Today Booking Report', routerLink: ['/bookingreport'] },
            { label: 'Booking Report ', routerLink: ['/reportsdashboard'] },
            { label: 'Collection Report', routerLink: ['/collectionreport'] },
            { label: 'Consolidated Report', routerLink: ['/Consolidate'] },
            // { label: 'GST Report', routerLink: ['/gdtreport'] },
            { label: 'Status Date Different Report', routerLink: ['/parcelstatusdate'] },
            { label: 'Pending Delivery Stock Report ', routerLink: ['/pending-delivery'] },
            { label: 'Pending Delivery Luggage Report', routerLink: ['/pendingluggage'] },
            { label: 'Dispatched Stock Report', routerLink: ['/dispatchedreport'] },
            { label: 'Received Stock Report', routerLink: ['/receivedstock-report'] },
            { label: 'Delivered Report', routerLink: ['/report-delivery'] },
            { label: 'Pending Dispatched Stock Report', routerLink: ['/pending-dispatchedStock-report'] },
            { label: 'Dispatched Memo Report', routerLink: ['/dispacthed-memo-report'] },
            { label: 'Parcel Incoming Report', routerLink: ['/incoming-report'] },
          ],
        },
        // { 
        //   label: 'Others ▼',
        //   icon: 'pi pi-fw pi-database',
        //   items: [
        //     { label: 'Add Package Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addpackagetype'] },
        //   ]
        //  },
    





        {
          label: 'Create Data ▼',
          icon: 'pi pi-user',
          items: [
            {
              label: 'Add Branch',
              icon: 'pi pi-user-edit',
              routerLink: ['/createbranch'],
            },
            {
              label: 'Add Employee',
              icon: 'pi pi-fw pi-user-edit',
              routerLink: ['/createemployee'],
            },
            {
              label: 'Add Vehicle',
              icon: 'pi pi-fw pi-user-edit',
              routerLink: ['/createvehicle'],
            },
          ],
        },
        
        {
          // label: 'Setting',
          label: 'Others ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Profile', routerLink: ['/adminprofile'] },
            { label: 'Add City', icon: 'pi pi-fw pi-user-edit', routerLink: ['/createcity'] },
            { label: 'Add Dispatch Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/adddispatchtype']},
            { label: 'Add Charges', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addextracharges'] },
            { label: 'Add Package Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addpackagetype'] },
          ],
        },
              { 
          label: 'Setting ▼',
          icon: 'pi pi-fw pi-database',
          // items: [
          //   { label: 'Add Package Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addpackagetype'] },
          // ]
         },
      ];
    }

    if (this.token.isEmployee()) {
      this.model = [
        // {
        //   label: 'Dashboard',
        //   icon: 'pi pi-fw pi-home',
        //   routerLink: ['/employee-dashboard'],
        // },
        {
          label: 'Bookings ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Parcel Booking', routerLink: ['/employee-booking'] },
            { label: 'Offline Loading', routerLink: ['/employee-loading'] },
            { label: 'Parcel Unloading', routerLink: ['/employee-unloading'] },
            { label: 'Branch to Branch Loading', routerLink: ['/employee-branch-loading'] },
            { label: 'Parcel Delivery', routerLink: ['/employee-parcel-devlivery'] },
            { label: 'Cancel Booking', routerLink: ['/employee-parcel-cancel'] },
            { label: 'Parcel Status Details', routerLink: ['/employee-status'] },
            { label: 'Branch to Branch Unloading', routerLink: ['/employee-branch-unloading'] },
            { label: 'Vouchers List Offline', routerLink: ['/employee-voucherdetails'] },
          ]
        },
        {
          label: 'Parcel Agent ▼',
          icon: 'pi pi-fw pi-file',
          items: [
            { label: 'CF Master', routerLink: ['/getcfmasterdata'] },
            { label: 'CF Voucher Generate', routerLink: ['/creditvouchergenerate'] },
            { label: 'CF Voucher Details', routerLink: ['/voucherdetailscf'] },
          ],
        },
        {
          label: 'Parcel Report ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Today Booking Report', routerLink: ['/todaybooking'] },
            { label: 'Booking Report ', routerLink: ['/dashboard-report'] },
            { label: 'Collection Report', routerLink: ['/collection-report'] },
            { label: 'Consolidated Report', routerLink: ['/conslidated-report'] },
            // { label: 'GST Report', routerLink: ['/gdtreport'] },
            { label: 'Status Date Different Report', routerLink: ['/parcel-status'] },
            { label: 'Pending Delivery Stock Report ', routerLink: ['/pending-deliverystock'] },
            { label: 'Pending Delivery Luggage Report', routerLink: ['/pending-luggage'] },
            { label: 'Dispatched Stock Report', routerLink: ['/dispacthedstock-report'] },
            { label: 'Received Stock Report', routerLink: ['/received-stock'] },
            { label: 'Delivered Report', routerLink: ['/deliverystock-report'] },
            { label: 'Pending Dispatched Stock Report', routerLink: ['/pendingdispached-stock-report'] },
            { label: 'Dispatched Memo Report', routerLink: ['/memo-stock-report'] },
            { label: 'Parcel Incoming Report', routerLink: ['/incomingreport'] },
          ],
        },
        // 
        //  {
        //   label: 'Profile',
        //   icon: 'pi pi-fw pi-user-edit',
        //   routerLink: ['/aprofile'],
        // },

      ];
    }

    if (this.token.isSubAdmin()) {
      this.model = [
        // {
        //   label: 'Dashboard',
        //   icon: 'pi pi-database',
        //   routerLink: ['/sub-dashboard'],
        // },
        {
          label: 'Bookings ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Parcel Booking', routerLink: ['/sub-booking'] },
            { label: 'Offline Loading', routerLink: ['/sub-loading'] },
            { label: 'Parcel Unloading', routerLink: ['/sub-unloading'] },
            { label: 'Branch to Branch Loading', routerLink: ['/sub-branch-loading'] },
            { label: 'Parcel Delivery', routerLink: ['/parcel-delivery'] },
            { label: 'Cancel Booking', routerLink: ['/cancel-booking'] },
            { label: 'Parcel Status Details', routerLink: ['/gnrnumberstatus'] },
            { label: 'Branch to Branch Unloading', routerLink: ['/sub-branch-unloading'] },
            { label: 'Vouchers List Offline', routerLink: ['/sub-parcelvoucher-details'] },
          ]
        },
        
        {
          label: 'Parcel Agent ▼',
          icon: 'pi pi-fw pi-file',
          items: [
            { label: 'CF Master', routerLink: ['/getcfmasterdata'] },
            { label: 'CF Voucher Generate', routerLink: ['/creditvouchergenerate'] },
            { label: 'CF Voucher Details', routerLink: ['/voucherdetailscf'] },
          ],
        },
        {
          label: 'Parcel Report ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Today Booking Report', routerLink: ['/sub-todaybooking'] },
            { label: 'Booking Report ', routerLink: ['/sub-dashboard'] },
            { label: 'Collection Report', routerLink: ['/sub-collection'] },
            { label: 'Consolidated Report', routerLink: ['/sub-consolidate'] },
            // { label: 'GST Report', routerLink: ['/gdtreport'] },
            { label: 'Status Date Different Report', routerLink: ['/sub-datedifferent'] },
            { label: 'Pending Delivery Stock Report ', routerLink: ['/sub-pendingdelivery'] },
            { label: 'Pending Delivery Luggage Report', routerLink: ['/sub-pendingluaggage'] },
            { label: 'Dispatched Stock Report', routerLink: ['/sub-dispatched'] },
            { label: 'Received Stock Report', routerLink: ['/sub-received'] },
            { label: 'Delivered Report', routerLink: ['/sub-deliverystock'] },
            { label: 'Pending Dispatched Stock Report', routerLink: ['/sub-pendingdispatch'] },
            { label: 'Dispatched Memo Report', routerLink: ['/sub-memo-dispathed'] },
            { label: 'Parcel Incoming Report', routerLink: ['/sub-incoming-luggage'] },
          ],
        },
        { 
          label: 'Others ▼',
          icon: 'pi pi-fw pi-database',
          items: [
            { label: 'Add Package Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addpackagetype'] },
          ]
         },
      ];
      // ;;
      
      // this.model = [//
      //   {
      //     label: 'Dashboard',
      //     icon: 'pi pi-database',
      //     routerLink: ['/booking'],
      //   },
      //   {
      //     label: 'Bookings ▼',
      //     icon: 'pi pi-fw pi-database',
      //     items: [
      //       { label: 'Parcel Booking', routerLink: ['/booking'] },
      //       { label: 'Offline Loading', routerLink: ['/parcelloading'] },
      //       { label: 'Parcel Unloading', routerLink: ['/parcelunloading'] },
      //       { label: 'Branch to Branch Loading', routerLink: ['/parcel-branch'] },
      //       { label: 'Parcel Delivery', routerLink: ['/parcel-delivery'] },
      //       { label: 'Cancel Booking', routerLink: ['/cancel-booking'] },
      //       { label: 'Parcel Status', routerLink: ['/gnrnumberstatus'] },
      //       { label: 'Branch to Branch Unloading', routerLink: ['/barnchtobranchunloading'] },
      //       { label: 'Vouchers List Offline', routerLink: ['/voucherslistoffline'] },
      //     ]
      //   },
        
      //   {
      //     label: 'Parcel Agent ▼',
      //     icon: 'pi pi-fw pi-file',
      //     items: [
      //       { label: 'CF Master', routerLink: ['/getcfmasterdata'] },
      //       { label: 'CF Voucher Generate', routerLink: ['/creditvouchergenerate'] },
      //       { label: 'CF Voucher Details', routerLink: ['/voucherdetailscf'] },
      //     ],
      //   },
      //   {
      //     label: 'Parcel Report ▼',
      //     icon: 'pi pi-fw pi-database',
      //     items: [
      //       { label: 'Today Booking Report', routerLink: ['/bookingreport'] },
      //       { label: 'Booking Report ', routerLink: ['/reportsdashboard'] },
      //       { label: 'Collection Report', routerLink: ['/collectionreport'] },
      //       { label: 'Consolidated Report', routerLink: ['/Consolidate'] },
      //       { label: 'GST Report', routerLink: ['/gdtreport'] },
      //       { label: 'Status Date Different Report', routerLink: ['/parcelstatusdate'] },
      //       { label: 'Pending Delivery Stock Report ', routerLink: ['/pending-delivery'] },
      //       { label: 'Pending Delivery Luggage Report', routerLink: ['/pendingluggage'] },
      //       { label: 'Dispatched Stock Report', routerLink: ['/dispatchedreport'] },
      //       { label: 'Received Stock Report', routerLink: ['/receivedstock-report'] },
      //       { label: 'Delivered Report', routerLink: ['/report-delivery'] },
      //       { label: 'Pending Dispatched Stock Report', routerLink: ['/pending-dispatchedStock-report'] },
      //       { label: 'Dispatched Memo Report', routerLink: ['/dispacthed-memo-report'] },
      //       { label: 'Parcel Incoming Report', routerLink: ['/incoming-report'] },
      //     ],
      //   },
      //   { 
      //     label: 'Others ▼',
      //     icon: 'pi pi-fw pi-database',
      //     items: [
      //       { label: 'Add Package Type', icon: 'pi pi-fw pi-user-edit', routerLink: ['/addpackagetype'] },
      //     ]
      //    },
      // ];
    }


    if (this.token.isAccountant()) {
      this.model = [
        {
          label: 'Reports',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/reports'],
        },
      ];
    }

    if (this.token.isSuperviser()) {
      this.model = [
        {
          label: 'Tasks',
          icon: 'pi pi-fw pi-briefcase',
          routerLink: ['/tasks'],
        },
      ];
    }

    if (this.token.isDriver()) {
      this.model = [
        {
          label: 'Delivery',
          icon: 'pi pi-fw pi-truck',
          routerLink: ['/delivery'],
        },
      ];
    }
    // profile data
    this.id = this.activeroute.snapshot.params['id'];
    this.api.GetProfileData().subscribe((res: any) => {
      console.log(res);
      this.data = res;
      console.log(this.data, 'Profiledat');
    });
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = event.target as HTMLDivElement;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }
}
