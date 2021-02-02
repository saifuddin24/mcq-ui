import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminModuleComponent } from "./admin-module.component";
import { RouterModule } from "@angular/router";
import { ToolbarContentComponent } from "./components/toolbar-content/toolbar-content.component";
import { SidebarContentsComponent } from "./components/sidebar-contents/sidebar-contents.component";
import {MaterialModule} from "../material/material.module";
import {MatMenuModule} from "@angular/material/menu";
import { LoginComponent } from './pages/login/login.component';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TableExampleComponent} from "./components/table-example/table-example.component";
import {ConfirmDialogComponent} from "../components/confirm-dialog/confirm-dialog.component";
import {SaveContentComponent} from "./components/table-example/save-content.component";
import {MatFormFieldModule} from "@angular/material/form-field";


const modules = [
  CommonModule,
  MaterialModule,
  RouterModule,
  MatMenuModule,
  RouterModule,
  MatInputModule,
  ReactiveFormsModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule
]


@NgModule({
  declarations: [
    AdminModuleComponent,
    ToolbarContentComponent,
    SidebarContentsComponent,
    LoginComponent, TableExampleComponent, ConfirmDialogComponent, SaveContentComponent
  ],
  imports: [ ...modules ],
  exports: [ ...modules ]
})

export class AdminModule { }

