import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/service/admin.service';

enum SubscriptionPlan {
  MONTHLY = 'monthly',
  HALF_YEARLY = 'half-yearly',
  YEARLY = 'yearly'
}

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  Form: FormGroup;
  plans = Object.values(SubscriptionPlan); // ['monthly', 'half-yearly', 'yearly']

  constructor(
    private fb: FormBuilder,
    private api: AdminService,
    private toastr: ToastrService
  ) {
    this.Form = this.fb.group({
      plan: ['', Validators.required],
      bookingLimit: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  createSubscription() {
    if (this.Form.invalid) {
      this.toastr.error('Please select a plan and enter a valid booking limit!', 'Form Invalid');
      return;
    }

    this.api.addSubscription(this.Form.value).subscribe({
      next: (res) => {
        this.toastr.success('Subscription plan added successfully!', 'Success');
        this.Form.reset();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to add subscription plan!', 'Error');
      }
    });
  }
}
