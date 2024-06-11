import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { ScanQrcodeComponent } from './pages/scan-qrcode/scan-qrcode.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    ScanQrcodeComponent,
    NavBarComponent,
    FooterComponent,
    HomeComponent,
   
  ],
  imports: [
    BrowserModule,
    ZXingScannerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  FormsModule,

  // Material
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatListModule,
  MatTooltipModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatMenuModule,
  MatIconModule,
  MatCheckboxModule,
  MatSidenavModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
