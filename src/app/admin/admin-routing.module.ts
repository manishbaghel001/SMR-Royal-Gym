import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
    { path: '', component: AdminboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }

