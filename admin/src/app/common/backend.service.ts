import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Global } from "../../common/Global";
import {Observable} from "rxjs";
import {AdminQuiz} from "../admin/models/AdminQuiz";
import {QuizItem} from "../admin/pages/quiz/quiz-datasource";
import {Config} from "../services/Config";

interface headerItem {
  name:string
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private headers:HttpHeaders = new HttpHeaders();

  constructor( private http:HttpClient ) {
    this.setHeader('Accept', 'application/json' );
    this.setHeader('Content-type', 'application/json' );
  }

  private setHeader( name: string, value: string ){
    this.headers = this.headers.set( name, value );
  }

  setAuth(){
    this.setHeader('Authorization', 'Bearer ' + Global.authToken );
    return this;
  }

  getQuizzes( ){
    return this.http.get(Global.apiBase+'quiz/list', { headers: this.headers });
  }

  getAdminQuizzes( ):Observable<any>{
    this.setAuth();
    console.log( "HEDDD_____", this.headers  );
    return this.http.get(Global.apiBase+'admin/quiz/list', { headers: Config.headers() });
  }

}
