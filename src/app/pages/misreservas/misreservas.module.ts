import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { IonicModule } from '@ionic/angular';

import { MisreservasPageRoutingModule } from './misreservas-routing.module';

import { MisreservasPage } from './misreservas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisreservasPageRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  declarations: [MisreservasPage]
})
export class MisreservasPageModule {}
