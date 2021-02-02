import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpHandler, HttpResponse} from '@angular/common/http';
import {QuizUpdateApi} from "../admin/components/table-example/table-example.component";
import {Config} from "./Config";
import {QuizInputs} from "./quiz.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private loginService = new Subject<string>( );
  private appData = new Subject<any>( );
  constructor( private http: HttpClient ) {}
  appData$ = this.appData.asObservable( );

  login( data: LoginData, param?: object): Observable<UserLoginResponse>{
    return this.http.post<UserLoginResponse>( Config.get_api('user/login' ), data, {
      headers: Config.headersWithoutToken(),
      params: Config.bindParams( param)
    })
  }

  // tslint:disable-next-line:variable-name
  logout( body?: QuizInputs, queryInput?: object ): Observable<LogoutResponse>{
    return this.http.post<LogoutResponse>(  Config.get_api('user/logout' ),
      body, { params: Config.bindParams( queryInput ), headers: Config.headers() }
    );
  }
}

export interface LogoutResponse {
  message: string,
  success: boolean
}

interface LoginData{
  username: string;
  password: string
}

export interface LoginResponse {
  data: UserData;
}

export class UserData {
  set gender( g ) {
    this._gender = g;
  }

  get gender( ): string {
    // tslint:disable-next-line:triple-equals
    return  this._gender == 1 ? 'male' : 'female';
  }

  id: string | number;
  // tslint:disable-next-line:variable-name
  first_name: string;
  // tslint:disable-next-line:variable-name
  last_name: string;
  // tslint:disable-next-line:variable-name
  display_name: string | null;
  email: string;
  // tslint:disable-next-line:variable-name
  phone_number: string;
  // tslint:disable-next-line:variable-name
  profile_pic: string;
  // tslint:disable-next-line:variable-name
  user_from: string;
  // tslint:disable-next-line:variable-name
  social_user_id: null;
  lang: string;
  // tslint:disable-next-line:variable-name
  ip_address: string;
  metadata: object;

  // tslint:disable-next-line:variable-name
  private _gender?: string | number;

  // tslint:disable-next-line:typedef
  setAndGetdata?( data: UserData ){
      this.id = data.id;
      this.display_name = data.display_name;
      this.gender = data.gender;
      this.email = data.email;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.ip_address = data.ip_address;
      this.user_from = data.user_from;
      this.metadata = data.metadata;
      this.profile_pic = data.profile_pic;
      this.lang = data.lang;
      return this;
  }

  getDisplayName?(): string {
      return this.display_name;
  }

}


export interface UserItem {
  id: string | number;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone_number: string;
  profile_pic: string;
  user_from: string;
  gender: string;
  social_user_id: string | number;
  lang: string;
  ip_address: string;
  metadata: object;
  usertype: string | number;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  isAdmin: boolean
}

// @ts-ignore
export interface UserLoginResponse{
  user: UserItem;
  access_token: string;
  message: string,
  is_admin: boolean
}
