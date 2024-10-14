import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarmesaPage } from './agregarmesa.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarmesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarmesaPageRoutingModule {}
