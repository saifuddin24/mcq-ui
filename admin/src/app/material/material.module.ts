import { NgModule } from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatList, MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatTreeModule } from "@angular/material/tree";
import {
  MatTableModule
} from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatMenuModule } from "@angular/material/menu";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";

const modules = [
  CommonModule, MatSelectModule,
  MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule,
  MatCardModule, MatMenuModule, MatTreeModule, DragDropModule, MatFormFieldModule,
  MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatInputModule,
  MatCheckboxModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatTabsModule
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, ...modules ],
  exports: [ ...modules ]
})
export class MaterialModule { }
