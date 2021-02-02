import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Config} from "codelyzer";
import {MatSnackBar} from "@angular/material/snack-bar";
import Cookie from "../../../services/Cookie";
import {AppService} from "../../../services/app.service";
import {Router} from "@angular/router";
import {UserLoginResponse, UserService} from "../../../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {

  constructor( private http:HttpClient, private _snakBar: MatSnackBar,
               private app: AppService,
               private router: Router,
               private user: UserService
  ) {

  }

  openSnackBar( msg, duration:number = 1000 ) {
    return this._snakBar.open( msg, 'Close', {
      duration: duration,
      data: { msg },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ["color-accent"],
    });
  }

  hasError = false;
  btnDisabled = false;
  error: string = null;

  controls = {
    username: new FormControl(),
    password: new FormControl(),
  }

  loginForm: FormGroup;

  submitLoginForm( $e ){
    $e.preventDefault();

    this.error = '';

    this.btnDisabled = true;
    const username = this.controls.username.value;
    const password = this.controls.password.value;

    this.user.login({ username, password }, {ref: 'admin'} ).subscribe(
      ( result: UserLoginResponse ) => {
        this.loginForm.markAsUntouched();
        console.log( result );
        Cookie.login( result.access_token );
        this.app.loadAppData();

        if( result.is_admin ){
          this.openSnackBar( result.message );
          setTimeout( () => {
            this.router.navigate(['/admin'] );
          },1000)
        } else {
          this.btnDisabled = false
          this.openSnackBar( "User is not authenticated for admin login", 20000 );
        }

    }, ( {status, error} ) => {
        this.openSnackBar( error.message, 10000 );
        console.log( status,' ', error  );
        if( status == 422 ) {
          Object.keys( error.errors ).map( key => {
            this.loginForm.get(key).setErrors( error.errors[key]);
            this.loginForm.markAllAsTouched()
          })
        }

        this.btnDisabled = false;
        if( status == 429 ) {
          this.loginForm.markAsUntouched();
          this.error = 'Too many attempts! Try few minutes later'
        }
    })

  }

  ngOnInit(): void {
    this.loginForm = new FormGroup( this.controls );
  }
}



