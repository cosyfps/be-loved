import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisreservasPage } from './misreservas.page';

const routes: Routes = [
  {
    path: '',
    component: MisreservasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisreservasPageRoutingModule {}
