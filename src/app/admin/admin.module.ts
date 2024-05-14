import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { AdminboardComponent } from './adminboard/adminboard.component';
import { TableComponent } from './table/table.component';
import { AdminRoutingModule } from './admin-routing.module';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    AdminboardComponent,
    TableComponent,
  ],
  imports: [
    AdminRoutingModule,
    ToastModule,
    DialogModule,
    TableModule,
    FileUploadModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    OverlayPanelModule,
    FormsModule,
    CommonModule,
    TagModule,
    ConfirmDialogModule,
    ImageModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
})
export class AdminModule { }
