import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverProfilePage } from './pop-over-profile';

@NgModule({
  declarations: [
    PopOverProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(PopOverProfilePage),
  ],
})
export class PopOverProfilePageModule {}
