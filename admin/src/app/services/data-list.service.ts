import { Injectable } from '@angular/core';
import {merge, Observable, of as observableOf, Subject} from 'rxjs';
import {catchError, filter, map, startWith, switchMap} from 'rxjs/operators';
import {SearchModel} from '../components/search/search.component';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Config} from './Config';
import {UidService} from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class DataListService {

  constructor( private http: HttpClient, public uid: UidService ) { }

  private allList: ListConfiguration<any>[] = [];

  listExists( listName: string ): boolean{
    return this.allList.filter( item => item.listName === listName ).length > 0;
  }

  getAllList(): ListConfiguration<any>[ ]{
    return this.allList;
  }

  // tslint:disable-next-line:typedef
  getList<R>( listName: string ): ListConfiguration<R> {
    return  this.allList.filter( item => item.listName === listName )[0];
  }

  new<R>( listName: string = this.uid.getString() ): ListConfiguration<R>{
    if ( this.listExists( listName) ) {
      return this.getList<R>( listName );
      // throw new Error( 'The "' + listName + '" => list already initialized' );
    }
    const list = new ListConfiguration<R>( listName );
    list.http = this.http;
    this.allList.push( list );
    return list;
  }
}

export class ListConfiguration<R> {

  constructor( listName: string  ){
    this.list_name = listName;
  }

  // tslint:disable-next-line:variable-name
  private list_name = '';
  public initialLoad = true;
  public hasTrashList = true;
  public notFound = false;
  public loading = true;
  public rateLimitReached = false;
  abcd = 50;
  http: HttpClient;

  // tslint:disable-next-line:variable-name
  private _isTrashList = false;
  private beforeLoad$: Subject<R> = new Subject<R>();
  public beforeLoad: Observable<R> = this.beforeLoad$.asObservable();

  private error$: Subject<any> = new Subject<any>();
  public error: Observable<any> = this.error$.asObservable( );

  private response$: Subject<R> = new Subject<R>();
  public response: Observable<R> = this.response$.asObservable( );

  private loader: Subject<any> = new Subject<any>();
  loader$ = this.loader.asObservable();

  customInputs: object = { };
  private params: HttpParams = new HttpParams();

  search: SearchModel = new SearchModel();
  sort: MatSort;
  paginator: MatPaginator;

  dataChanged: Observable<any> = new Observable<any>( );
  errorOccured: boolean = false;
  dataEvents: Observable<any>[ ] = [ ];
  customEvents: Observable<any>[ ] = [ ];
  loaded: boolean = false;
  loadTime = 0;

  get listName( ): string {
    return this.list_name;
  }

  setResponse( res: Subject<R>): Observable<R>{
    this.response$ = res;
    return this.response$.asObservable();
  }

  addEvent( event: Observable<any> ): void{
    this.customEvents.push( event );
  }

  get isTrashList(): boolean{
    return this._isTrashList;
  }

  get events(): Observable<any>{
    return merge.apply( this, this.dataEvents );
  }

  private defaultQueryParam = (key, value ) => {
    const customKey  = this.customInputs[ key ];
    this.params = customKey ? this.params.set( customKey, value) : this.params.set( key, value);
    return this.params;
  }

  public setQueryParam = (key, value ) => {
    if ( value === null ) {
      this.params = this.params.delete( key, value);
    } else  {
      this.params = this.params.set( key, value);
    }
  }

  public deleteQueryParam = ( key ) => {
    this.params = this.params.delete( key );
  }

  get list_inputs(): HttpParams {
    // console.log( 'UorFalse', 'dddddddddddd' + this.params.get('search_text' ) );
    const searchText = this.params.get( 'search_text' );

    if ( this.search ){
      this.params = ( !this.search.value ) ? this.params.delete( 'search_text' )
        : this.defaultQueryParam( 'search_text', this.search?.value );
    }

    console.log( 'UorFalse:---', this.params.get('search_text') );

    if ( this.paginator ){
      this.params = ( this.paginator?.pageIndex === undefined ) ?
        this.params.delete('page') : this.defaultQueryParam( 'page', this.paginator.pageIndex + 1 );

      this.params = ( this.paginator?.pageSize === undefined ) ?
        this.params.delete('page_size') : this.defaultQueryParam( 'page_size', this.paginator.pageSize );
    }

    if ( this.sort && this.sort.active){
      this.defaultQueryParam( 'sort', this.sort.active );
      this.defaultQueryParam( 'sort_type', this.sort.direction );
    } else if ( !this.params.has('sort') ) {
      this.params = this.params.delete('sort');
      this.params = this.params.delete('sort_type');
    }

    this.params = ( this.hasTrashList && this.isTrashList )
      ? this.defaultQueryParam( '_trashed_only', 1 ) : this.params.delete('_trashed_only');

    return this.params;
  }

  // tslint:disable-next-line:variable-name typedef
  private setListEvents( api_link ) {
    if ( this.http ) {
      this.events.pipe(
        switchMap( ( d ) => {
          this.notFound = false;
          this.loading = true;
          this.rateLimitReached = false;
          this.beforeLoad$.next();
          return  this.http.get<R>( Config.get_api( api_link ),
            { params: this.list_inputs, headers: Config.headers() });
        }),
        map( ( response: R ) => {
          this.notFound = false;
          this.loading = false;
          this.rateLimitReached = false;
          return  response;
        })
        ,
        catchError(( err ) => {
          this.errorOccured = true;
          this.notFound = false;
          this.loading = false;
          this.rateLimitReached = true;
          this.error$.next( err );
          this.setListEvents( api_link );
          return observableOf({});
        })
      ).subscribe( (response: R) => this.response$.next( response));

      // this.dataEvents = [];
      this.customEvents = [];
      console.log( 'this.customEvents:END', this.customEvents );
    }
  }

  // tslint:disable-next-line:variable-name
  get( api_link: string ): ListConfiguration<R>{
    console.log( 'this.customEvents', this.customEvents );
    this.dataEvents = [];
    this.loading = true;
    this.loader =  new Subject<any>();
    this.loader$ = this.loader.asObservable();
    //
    //
    this.customEvents.map( ( event, i ) =>  this.dataEvents.push( event ));

    if ( this.loader   ) {
      this.dataEvents.push( this.loader.asObservable() );
    }

    if ( this.sort ) {
      this.dataEvents.push( this.sort.sortChange );
    }

    if ( this.paginator ) {
      this.dataEvents.push( this.paginator.page );
    }

    if ( this.search ) {
      this.dataEvents.push( this.search.change );
    }

    this.loader$.subscribe(data => {
      console.log( 'ddddddttttttttr', data );
      if ( data && typeof data === 'object' ) {
        Object.keys( data ).map( key => this.setQueryParam( key, data[key]) );
      }
    });

    if ( this.paginator ) {
      this.events.pipe(
        filter( data =>  data?.pageIndex === undefined && data?.pageSize === undefined)
      ).subscribe( (data) => { console.log( 'DDTTRR--', data ); this.paginator.pageIndex = 0; });
    }

    this.loader$.subscribe( data => console.log( 'THE EVENTS VALUES', ++this.loadTime, data ) );

    this.setListEvents( api_link );

    if ( this.initialLoad ) {
      this.loader.next();
    }

    // this.loader$ = null;
    return this;
  }

  // tslint:disable-next-line:variable-name
  initialize( api_link: string ): ListConfiguration<R>{
    this.initialLoad = false;
    this.get( api_link );
    return this;
  }

  load( params?: object ): ListConfiguration<R>{
    this.loader.next( params );
    return this;
  }

  loadMainList(moreParams?: object ): void{
    this._isTrashList = false;
    this.loader.next( moreParams );
  }

  loadTrashList( moreParams?: object ): void{
    this._isTrashList = true;
    this.loader.next( moreParams );
  }

  toggleTrashList( ): void{
    this._isTrashList = !this._isTrashList;
    this.loader.next();
  }
}

