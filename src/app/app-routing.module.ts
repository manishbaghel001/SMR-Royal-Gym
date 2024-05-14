import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './mainboard/login/login.component';
import { ForgotpasswordComponent } from './mainboard/forgotpassword/forgotpassword.component';
import { VerifyemailComponent } from './mainboard/verifyemail/verifyemail.component';
import { MainscreenComponent } from './mainboard/mainscreen/mainscreen.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainscreenComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotpasswordComponent },
  { path: 'verify', component: VerifyemailComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})

export class AppRoutingModule { }

