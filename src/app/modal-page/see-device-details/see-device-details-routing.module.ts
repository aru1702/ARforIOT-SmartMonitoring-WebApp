import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeeDeviceDetailsPage } from './see-device-details.page';

const routes: Routes = [
  {
    path: '',
    component: SeeDeviceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeeDeviceDetailsPageRoutingModule {}
