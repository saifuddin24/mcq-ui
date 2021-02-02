import { Injectable } from '@angular/core';
import {observable, Observable, Subject} from 'rxjs';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {UserData} from './user.service';
import {Config} from './Config';
import set = Reflect.set;
import {ConfirmDialogComponent, DialogOptions} from '../components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // Observable AppResponse sources
  private appData = new Subject<AppResponse>( );
  // AppResponse Observable
  appData$ = this.appData.asObservable( );
  constructor( private http: HttpClient, private dialog: MatDialog, ) { }
  private conSubject: Subject<boolean> = new  Subject();
  connection: Observable<boolean> =  this.conSubject.asObservable();
  connected: boolean = false;


  // tslint:disable-next-line:variable-name
  loaded( filter_callback?: (data?: AppResponse) => boolean ): Observable<AppResponse>{
    if ( filter_callback ) {
      return this.appData$.pipe( filter( data => filter_callback( data ) ) );
    }
    return this.appData$;
  }

  // tslint:disable-next-line:typedef
  loadAppData(){
    this.getData().subscribe(

      ( appData: AppResponse ) => this.internet_connected( appData ),

      error => setTimeout( () => {
        this.connected = false;
        this.conSubject.next( this.connected );
        this.loadAppData();
      }, 3000 )
    );
  }

  private internet_connected( appData: AppResponse ): void{
    this.appData.next( appData );
    this.connected = true;
    this.conSubject.next( this.connected );
  }

  getData( ): Observable<AppResponse> {
    return this.http.get<AppResponse>( Config.get_api('app-data' ), { headers: Config.headers( ) } );
  }


  openConfirmDialog( dialogOptions: DialogOptions): MatDialogRef<ConfirmDialogComponent> {
    return  this.dialog.open( ConfirmDialogComponent,  {
      width: '400px',
      disableClose: true,
      data: dialogOptions,
    });
  }

  masterToggle( selection: SelectionModel<any>, data: any[] ): SelectionModel<any>{
    this.isAllSelected( selection, data ) ?
      selection.clear( ) :
      data.map( item => selection.select(item) );
    return selection;
  }

  isAllSelected( selection: SelectionModel<any>, data: any[] ): boolean{
    return  selection.selected.length === data.length;
  }


  arrFill( length: number, fill: number = 1): number[] {
    return length === 0 ? [] :  Array( length ).fill(1);
  }


}

export interface FilterConfig {
  subject: Subject<string>;
  observable: Observable<string>;
  maping: ( text: string ) => string;
}

export interface AppResponse {
  authenticated: boolean | false;
  user: UserData;
  is_admin: boolean | false;
  metadata: object;
}

export interface DataUpdate<T> {
  data: T | [] | null;
  action: string;
  success: boolean;
  message: string;
}

export interface ApiInput {
  search_text?: string;
  page?: number | 1;
  page_size ?: number | 1;
  sort ?: string | object | undefined;
  sort_type ?: 'asc' | 'desc' | '';
  _trashed_only ?: 1 | 0;
  _trashed ?: 1 | 0;
  _published_only ?: 1 | 0;
}
