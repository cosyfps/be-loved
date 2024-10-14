import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

import { IonicModule } from '@ionic/angular';

import { AgregarmesaPageRoutingModule } from './agregarmesa-routing.module';

import { AgregarmesaPage } from './agregarmesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarmesaPageRoutingModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  declarations: [AgregarmesaPage]
})
export class AgregarmesaPageModule {}
