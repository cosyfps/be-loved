import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditareservaPage } from './editareserva.page';

const routes: Routes = [
  {
    path: '',
    component: EditareservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditareservaPageRoutingModule {}
