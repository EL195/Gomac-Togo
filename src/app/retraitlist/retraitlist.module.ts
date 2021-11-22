import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetraitlistPageRoutingModule } from './retraitlist-routing.module';

import { RetraitlistPage } from './retraitlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetraitlistPageRoutingModule
  ],
  declarations: [RetraitlistPage]
})
export class RetraitlistPageModule {}
