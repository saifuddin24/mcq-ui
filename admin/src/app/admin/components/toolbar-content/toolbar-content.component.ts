import {Component, Input, OnInit} from '@angular/core';
import {AppResponse, AppService} from "../../../services/app.service";
import {LogoutResponse, UserData, UserService} from "../../../services/user.service";
import Cookie from "../../../services/Cookie";
import { Router} from "@angular/router";

@Component({
  selector: 'toolbar-content',
  templateUrl: './toolbar-content.component.html',
  // template: `<!--<div>Toolbar Content!</div>-->`,
  styleUrls: [
    './toolbar-content.component.css'
  ]
})
export class ToolbarContentComponent implements OnInit {

  constructor( private app: AppService, private userService: UserService, private router: Router) {

  }

  @Input() user: UserData;

  name:string = 'sss';
  email_or_phone = 'sdf ';


  ngOnInit(): void {

    if( this.user ) {
      this.email_or_phone = this.user.email || this.user.phone_number;
      this.name = this.user.first_name ? this.user.first_name + ' ' + this.user.last_name: (
        this.user.last_name ? this.user.last_name: this.user.display_name
      );
    }
  }

  logoutUser( $e ){
    $e.preventDefault();

    const logout_done = ( data: LogoutResponse ) =>{
        Cookie.logout();
        this.router.navigate(['/admin/login'] )
    }

    this.userService.logout().subscribe(
      logout_done, () => logout_done({message: "Logout Successful", success: true})
    )
  }

}
