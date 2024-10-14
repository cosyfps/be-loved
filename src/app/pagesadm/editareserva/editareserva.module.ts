import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditareservaPageRoutingModule } from './editareserva-routing.module';

import { EditareservaPage } from './editareserva.page';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditareservaPageRoutingModule,
    MatIconModule
  ],
  declarations: [EditareservaPage]
})
export class EditareservaPageModule {}
