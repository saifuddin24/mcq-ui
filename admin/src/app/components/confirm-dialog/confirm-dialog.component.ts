import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public options: DialogOptions,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar
  ) {
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  // tslint:disable-next-line:typedef
  onPosBtnClick(){
    if ( this.options.onPositiveAction ) { this.options.onPositiveAction( this.dialogRef, this.options ); }
    if ( this.options.positiveAction && this.options.positiveActionNext ) {
      this.options.positiveAction.subscribe({
        next: this.options.positiveActionNext,
        error: this.options.positiveActionError,
        complete: this.options.positiveActionComplete
      });
    }
  }

  // tslint:disable-next-line:typedef
  onNegBtnClick(){
    if ( this.options.onNegativeAction ) { this.options.onNegativeAction( this.dialogRef, this.options ); }
    if ( this.options.negativeAction && this.options.negativeActionNext ) {
      this.options.negativeAction.subscribe({
        next: this.options.negativeActionNext,
        error: this.options.negativeActionError,
        complete: this.options.negativeActionComplete
      });
    }
  }

  ngOnInit(): void {
    this.options.snackBar = this._snackBar;
  }

}

export interface DialogOptions {
  action_name?: string;
  snackBar?: MatSnackBar;
  title?: string | 'Be alert!';
  body?: string | 'Are your sure?';
  positiveText?: string | 'Yes';
  negativeText?: string | 'No';
  closeOnNgText?: boolean | true;
  closeOnPgText?: boolean | false;
  positiveAction?: Observable<any>;
  negativeAction?: Observable<any>;
  onPositiveAction?: ( dialogRef?: MatDialogRef<ConfirmDialogComponent>, dialogOption?: DialogOptions ) => void;
  onNegativeAction?: ( dialogRef?: MatDialogRef<ConfirmDialogComponent>, dialogOption?: DialogOptions ) => void;
  positiveActionNext?( value: any ): void;
  positiveActionError?( value: any ): void;
  positiveActionComplete?( ): void;
  negativeActionNext?( value: any ): void;
  negativeActionError?( value: any ): void;
  negativeActionComplete?( ): void;
}
