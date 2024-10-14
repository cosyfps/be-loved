import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarmesaPage } from './editarmesa.page';

const routes: Routes = [
  {
    path: '',
    component: EditarmesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarmesaPageRoutingModule {}
