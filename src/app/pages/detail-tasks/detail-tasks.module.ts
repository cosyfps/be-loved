import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailTasksPageRoutingModule } from './detail-tasks-routing.module';

import { DetailTasksPage } from './detail-tasks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailTasksPageRoutingModule
  ],
  declarations: [DetailTasksPage]
})
export class DetailTasksPageModule {}
