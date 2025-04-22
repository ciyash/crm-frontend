import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-collection-data',
  templateUrl: './collection-data.component.html',
  styleUrls: ['./collection-data.component.scss']
})
export class CollectionDataComponent {
  data: any[] = [];

constructor(private router: Router) {
  const navigation = this.router.getCurrentNavigation();
  const stateData = navigation?.extras?.state?.['data'];

  if (stateData && Array.isArray(stateData)) {
    this.data = stateData;
  } else {
    console.warn('No report data found in router state.');
  }
}



}
