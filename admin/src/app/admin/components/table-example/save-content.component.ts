import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent, DialogOptions} from '../../../components/confirm-dialog/confirm-dialog.component';
import {MatLabel, MatHint} from "@angular/material/form-field";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'save-content',
  templateUrl: './save-content.component.html',
  styles: [ ]
})
export class SaveContentComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public options: DialogOptions) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}

