import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; 
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

// Firebase
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from 'src/environments/environment';

import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [AppComponent],
  imports: [HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule,
    AngularFireAuthModule, AngularFireModule.initializeApp(firebaseConfig)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, EmailComposer, provideAnimationsAsync(), NativeStorage, SQLite, ScreenOrientation],
  bootstrap: [AppComponent],
})
export class AppModule {}
