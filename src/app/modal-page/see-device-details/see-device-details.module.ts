import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeeDeviceDetailsPageRoutingModule } from './see-device-details-routing.module';

import { SeeDeviceDetailsPage } from './see-device-details.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeeDeviceDetailsPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [SeeDeviceDetailsPage]
})
export class SeeDeviceDetailsPageModule {}
