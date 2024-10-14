import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesaslocalPage } from './mesaslocal.page';

const routes: Routes = [
  {
    path: '',
    component: MesaslocalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesaslocalPageRoutingModule {}
