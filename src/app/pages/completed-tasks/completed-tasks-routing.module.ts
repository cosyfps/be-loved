import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedTasksPage } from './completed-tasks.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedTasksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedTasksPageRoutingModule {}
