import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetraitlistPage } from './retraitlist.page';

const routes: Routes = [
  {
    path: '',
    component: RetraitlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetraitlistPageRoutingModule {}
