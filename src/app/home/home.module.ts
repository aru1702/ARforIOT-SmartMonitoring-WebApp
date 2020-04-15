import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'home',
        component: HomePage,
        children: [
          {
            path: 'home1',
            loadChildren: () => import('../home-fragments/home1/home1.module').then( m => m.Home1PageModule)
          },
          {
             path: 'home2',
            loadChildren: () => import('../home-fragments/home2/home2.module').then( m => m.Home2PageModule)
          },
          {
            path: 'home3',
            loadChildren: () => import('../home-fragments/home3/home3.module').then( m => m.Home3PageModule)
          },
          {
            path: 'settings',
            loadChildren: () => import('../home-fragments/settings/settings.module').then( m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/home1',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
