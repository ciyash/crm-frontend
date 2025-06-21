import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AdminService } from 'src/app/service/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  form!: FormGroup;
  ddata: any;
  last7Dates: Date[] = [];
  last7Days: string[] = [];
  selectedIndex: number = -1;
  selectedIndex1: number = -1;
  showAcParty: boolean = true; // Show A/C Party Account by default
  paymentdata: any = { branchwise: [], totalAmount: 0 };
  pieChart1: any;
  barChart: any;
  statusWiseSummaryData: any = { branchwiseStatus: [] };

  
  constructor(private api: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      date: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getLast7Days();
    this.GetStatusWiseSummary();


  }

  getLast7Days(): void {
    const today = new Date();
    this.last7Dates = [];
    this.last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      this.last7Dates.push(date);
      const day = date.getDate().toString().padStart(2, '0');
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
      this.last7Days.push(`${day} - ${weekday}`);
      const formattedToday = today.toDateString();
      const formattedDate = date.toDateString();
      if (formattedToday === formattedDate) {
        this.selectedIndex = this.last7Dates.length - 1;
        this.selectedIndex1 = this.last7Dates.length - 1;

      }
    }

    this.selectDate(this.selectedIndex);
    this.selectDate1(this.selectedIndex1)
  }

// Sales Summary By Branch Wise
  selectDate(index: number): void {
    this.selectedIndex = index;
    const selectedDate = this.last7Dates[index];
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const payload = { date: formattedDate };
    console.log('Sending payload:', payload);
    this.api.PostData(payload).subscribe({
      next: (res: any) => {
        this.ddata = res;
        console.log('Response data:', this.ddata);
        this.loadBarChart();
        this.loadPieChart1();
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      },
    });
  }
  // GetStatusWiseSumma
  GetStatusWiseSummary(): void {
    this.api.StatusWiseSummary().subscribe({
      next: (res) => {
        console.log('Status wise summary:', res);
        this.statusWiseSummaryData = res;
      },
      error: (err) => {
        console.error('Error fetching status summary:', err);
      },
    });
  }
// collection summary BY Payment 
  ngAfterViewInit(): void {
    this.loadBarChart();
    this.loadPieChart();
    this.loadPieChart1();
  }
// barchart Sales Summary By Branch Wise
  loadBarChart(): void {
    if (!this.ddata || !Array.isArray(this.ddata)) {
      return;
    }
    const labels = this.ddata.map(
      (item: any) => item.pickUpBranchName || 'Unknown'
    );
    const paidData = this.ddata.map((item: any) => item.paid || 0);
    const toPayData = this.ddata.map((item: any) => item.toPay || 0);
    const creditData = this.ddata.map((item: any) => item.credit || 0);
    const focData = this.ddata.map((item: any) => item.FOC || 0);

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Paid Booking', data: paidData, backgroundColor: '#003087' },
          {
            label: 'Topay Delivery',
            data: toPayData,
            backgroundColor: '#fd7e14',
          },
          {
            label: 'Paid Delivery',
            data: creditData,
            backgroundColor: '#dc3545',
          },
          { label: 'Free of Cost', data: focData, backgroundColor: '#6f42c1' },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Bookings',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Pick-Up Branch',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const branch = tooltipItems[0].label;
                return `${branch}`;
              },
              label: function () {
                const index = this.dataPoints[0].dataIndex;
                const datasets = this.chart.data.datasets;
                const lines = datasets.map((ds) => {
                  const value = ds.data[index] || 0;
                  return `${ds.label}: ${value.toLocaleString()}`;
                });
                return lines;
              },
            },
          },
        },
      },
    });
  }



  
  loadPieChart1(): void {
    if (!this.ddata || !Array.isArray(this.ddata)) {
      return;
    }
    // Sum values for each category
    const paidTotal = this.ddata.reduce(
      (sum, item) => sum + (item.paid || 0),
      0
    );
    const toPayTotal = this.ddata.reduce(
      (sum, item) => sum + (item.toPay || 0),
      0
    );
    const creditTotal = this.ddata.reduce(
      (sum, item) => sum + (item.credit || 0),
      0
    );
    const focTotal = this.ddata.reduce((sum, item) => sum + (item.FOC || 0), 0);

    // Destroy old chart if exists
    if (this.pieChart1) {
      this.pieChart1.destroy();
    }
    // Create new pie chart
    this.pieChart1 = new Chart('pieChart1', {
      type: 'pie',
      data: {
        labels: ['Paid Bookings', 'Topay Delivery', 'Paid Delivery', 'FOC'],
        datasets: [
          {
            data: [paidTotal, toPayTotal, creditTotal, focTotal],
            backgroundColor: ['#003087', '#fd7e14', '#dc3545', '#6f42c1'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
// end
loadPieChart(): void {
  new Chart('pieChart', {
    type: 'pie',
    data: {
      labels: ['Total Amount', 'Collected', 'Balance'],
      datasets: [
        {
          data: [50, 30, 20],
          backgroundColor: ['#003087', '#fd7e14', '#dc3545'],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// Collection Summary By Payment Type



  // accounts and branch
  brachdata(): void {
    this.showAcParty = false;
      if (this.selectedIndex1 !== null && this.selectedIndex1 !== undefined) {
      this.selectDate1(this.selectedIndex1);
    }
  }
  
  acpartydata(): void {
    this.showAcParty = true;
      if (this.selectedIndex1 !== null && this.selectedIndex1 !== undefined) {
      this.selectDate1(this.selectedIndex1);
    }
  }
  
  selectDate1(index: number): void {
    this.selectedIndex1 = index;
    const selectedDate = this.last7Dates[index];
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const payload1 = { date: formattedDate };
  
    console.log('Sending payload:', payload1);
  
    if (this.showAcParty) {
      this.api.ACpartyData(payload1).subscribe({
        next: (res: any) => {
          this.paymentdata = res;
          console.log("AC Party paymentData:", this.paymentdata);
        }
      });
    } else {
      this.api.BranchData(payload1).subscribe({
        next: (res: any) => {
          this.paymentdata = res;
          console.log("Branch paymentData:", this.paymentdata);
        }
      });
    }
  }
  
  }


  

 
  

  
