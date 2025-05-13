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

  constructor(private api: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLast7Days();
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
      }
    }

    this.selectDate(this.selectedIndex);
  }

  selectDate(index: number): void {
    this.selectedIndex = index;

    const selectedDate = this.last7Dates[index];
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`; // ✅ formatted as "08-05-2025"
    const payload = { date: formattedDate };

    console.log('Sending payload:', payload);

    this.api.PostData(payload).subscribe({
      next: (res: any) => {
        this.ddata = res;
        console.log('Response data:', this.ddata);
        this.loadBarChart();
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadBarChart();
    this.loadPieChart();
    this.loadPieChart1();
  }

  loadBarChart(): void {

    if (!this.ddata || !Array.isArray(this.ddata)) {
      return;
    }

    const labels = this.ddata.map((item: any) => item.pickUpBranchName);

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Pending Dispatch', data: [10, 20, 30, 25, 15, 35], backgroundColor: '#dc3545' },
          { label: 'Dispatch stock report', data: [15, 25, 20, 30, 10, 40], backgroundColor: '#17a2b8' },
          { label: 'Received Stock', data: [20, 15, 25, 20, 30, 10], backgroundColor: '#fd7e14' },
          { label: 'Pending Delivery', data: [25, 10, 15, 35, 20, 30], backgroundColor: '#6f42c1' },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

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

  loadPieChart1(): void {
    new Chart('pieChart1', {
      type: 'pie',
      data: {
        labels: ['Paid bookings', 'Paid delivery', 'To - pay Delivery', 'Others'],
        datasets: [
          {
            data: [50, 30, 20, 10],
            backgroundColor: ['#003087', '#fd7e14', '#dc3545', '#40CEE2'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  branches = [
    { name: 'Vellore', pending: 1, dispatch: 1, received: 1, delivery: 1 },
    { name: 'Villupuram', pending: 2, dispatch: 2, received: 2, delivery: 2 },
    { name: 'Salem', pending: 3, dispatch: 3, received: 3, delivery: 3 },
    { name: 'Krishnagiri', pending: 4, dispatch: 4, received: 4, delivery: 4 },
    { name: 'Erode', pending: 5, dispatch: 5, received: 5, delivery: 5 },
    { name: 'Guntur', pending: 6, dispatch: 6, received: 6, delivery: 6 },
  ];
}
