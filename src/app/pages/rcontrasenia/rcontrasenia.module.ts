import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RcontraseniaPageRoutingModule } from './rcontrasenia-routing.module';

import { RcontraseniaPage } from './rcontrasenia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RcontraseniaPageRoutingModule
  ],
  declarations: [RcontraseniaPage]
})
export class RcontraseniaPageModule {}
