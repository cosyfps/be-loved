import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesasterrazaPage } from './mesasterraza.page';

const routes: Routes = [
  {
    path: '',
    component: MesasterrazaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesasterrazaPageRoutingModule {}
