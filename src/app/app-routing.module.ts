import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanQrcodeComponent } from './pages/scan-qrcode/scan-qrcode.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path:'verify', component:ScanQrcodeComponent},
  {path:'home', component:HomeComponent},
  {path:'', pathMatch:'full', redirectTo:'home'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
