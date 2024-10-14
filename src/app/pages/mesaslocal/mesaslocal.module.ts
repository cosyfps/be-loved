import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaslocalPageRoutingModule } from './mesaslocal-routing.module';

import { MesaslocalPage } from './mesaslocal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaslocalPageRoutingModule
  ],
  declarations: [MesaslocalPage]
})
export class MesaslocalPageModule {}
