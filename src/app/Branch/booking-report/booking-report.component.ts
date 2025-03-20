import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnFilter } from 'primeng/table';
import { BranchService } from 'src/app/service/branch.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent {
  data1:any;
  totalBookings: number = 0;
  loading: boolean = true;

  visible: boolean = false;
  repd:any;
  showDialog(row: string) {
  this.visible = true;
  this.repd = row;
  console.log(this.repd);
  }

  constructor(private api:BranchService, private router:Router){}

  ngOnInit(){
    this.getbookingData();
    this.loadUsers({ first: 0, rows: 10 });
  }

  getbookingData(){
    this.api.GetBookings().subscribe((res)=>{
      console.log(res);
      this.data1=res;
      this.loading=false;
    })
  }

  orderinvoice(id:any){
    this.router.navigate(['/printgrn/'+id]);
  }

  loadUsers(event: any) {
    const first = event.first;  
    const rows = event.rows;    
    const page = Math.floor(first / rows) + 1; 
    const perPage = rows;  
    this.api.BookingsPage(page, perPage).subscribe((res: any) => {
      console.log(res);
      this.data1 = res; 
      this.totalBookings = res.count; 
    });
  }

}
