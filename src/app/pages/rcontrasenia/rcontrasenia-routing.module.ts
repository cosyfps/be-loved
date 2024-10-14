import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RcontraseniaPage } from './rcontrasenia.page';

const routes: Routes = [
  {
    path: '',
    component: RcontraseniaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RcontraseniaPageRoutingModule {}
