
import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/app/service/branch.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private api: BranchService) {}

  ngOnInit() {
    this.getProfileData();
  }



  getProfileData() {
    try {
      this.api.GetProfileData().subscribe({
        next: (response: any) => {
          console.log('Profile Data:', response);
          this.profileData = response; 
          this.loading = false;
        },
      });
    } catch (error) {
      
    }
  }
}














