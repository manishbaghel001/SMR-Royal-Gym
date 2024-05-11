import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NavigatorComponent } from './mainboard/navigator/navigator.component';
import { FooterComponent } from './mainboard/footer/footer.component';
import { ContactformComponent } from './mainboard/contactform/contactform.component';
import { LoginComponent } from './admin/login/login.component';
import { ForgotpasswordComponent } from './admin/forgotpassword/forgotpassword.component';
import { VerifyemailComponent } from './admin/verifyemail/verifyemail.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: NavigatorComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'contact', component: ContactformComponent },
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

