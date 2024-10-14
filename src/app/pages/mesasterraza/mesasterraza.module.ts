import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesasterrazaPageRoutingModule } from './mesasterraza-routing.module';

import { MesasterrazaPage } from './mesasterraza.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesasterrazaPageRoutingModule
  ],
  declarations: [MesasterrazaPage]
})
export class MesasterrazaPageModule {}
