import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailCategoryPageRoutingModule } from './detail-category-routing.module';

import { DetailCategoryPage } from './detail-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailCategoryPageRoutingModule
  ],
  declarations: [DetailCategoryPage]
})
export class DetailCategoryPageModule {}
