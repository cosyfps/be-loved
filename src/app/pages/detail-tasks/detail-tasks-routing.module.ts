import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailTasksPage } from './detail-tasks.page';

const routes: Routes = [
  {
    path: '',
    component: DetailTasksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailTasksPageRoutingModule {}
