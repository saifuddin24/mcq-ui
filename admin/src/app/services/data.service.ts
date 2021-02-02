import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpHandler, HttpParams} from '@angular/common/http';
import {Config} from './Config';
import {SelectionModel} from '@angular/cdk/collections';
import {filter} from "rxjs/operators";

// import {QuestionDataApi, QuestionDeleteInput, QuestionInputs, QuestionQueryInput, QuestionSingle, QuestionUpdate} from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class DataService<ItemType> {

  // Observable AppResponse sources

  constructor( private http: HttpClient ) { }

  // tslint:disable-next-line:variable-name
  private _events: Observable<any>;

  // tslint:disable-next-line:variable-name
  _params = new Subject<DataOption>() ;
  params$ = this._params.asObservable();

  dataAction: Subject<any> = new Subject<any>();

  selection: SelectionModel<ItemType> = new SelectionModel<ItemType>(true, []);

  get hasSelection(): boolean{
    return this.selection?.selected.length > 0;
  }

  setSelection( ): SelectionModel<ItemType>{
    this.selection = new SelectionModel<ItemType>(true, []);
    this.selection.clear();
    return this.selection;
  }

  selectAll( data: ItemType[] ): SelectionModel<ItemType>{
    if( data === null ) return  this.selection;
    this.allSeleted( data ) ?
      // tslint:disable-next-line:no-unused-expression
      this.selection.clear( ) : ( data && data.map( item => this.selection.select(item) ) );
    return this.selection;
  }

  allSeleted( data: ItemType[] ): boolean{
    return data !== null ? this.selection.selected.length === data.length : false;
  }

  bundleValues(key: string ): string{
    const selected = this.selection.selected;
    let str = '';

    if ( selected ) {
      selected.map( (item: ItemType) => str += item[ key ] ? item[ key ] + ',' : '' );
    }
    return str.replace( /\,$/g, '');
  }


  // tslint:disable-next-line:variable-name
  onAction<T>( filter_callback ?: (data: T) => boolean ): Observable<T>{
    if ( filter_callback === undefined ){ return this.dataAction.asObservable(); }
    return this.dataAction.asObservable().pipe( filter( (data: T) => filter_callback(data) ) );
  }

  // tslint:disable-next-line:typedef
  setDataAction<Type>( data: Type ): void{
    this.dataAction.next( data );
  }


  // tslint:disable-next-line:variable-name
  list<Response, InputType>( list_url: string, input?: InputType ): Observable<Response>{
    return this.http.get<Response>(  Config.get_api( list_url ),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:variable-name
  single( api_url: string, input?: object): Observable<ItemType>{
    return this.http.get<ItemType>(  Config.get_api( api_url ),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef variable-name
  edit<InputType>( api_url: string | string, body: InputType, input?: object ): Observable<ItemType>{
    return this.http.put<ItemType>(  Config.get_api( api_url ),
      body, { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef variable-name
  delete<UpdateType, QueryInput>( api_url: string, input: QueryInput): Observable<UpdateType>{
    return this.http.delete<UpdateType>(  Config.get_api( api_url ),
      {  headers: Config.headers(), params: Config.bindParams( input )}
    );
  }

  // tslint:disable-next-line:typedef variable-name
  restore<UpdateType, QueryInput>(  api_url: string, input: QueryInput ): Observable<UpdateType>{
    return this.http.patch<UpdateType>(   Config.get_api( api_url ),
      Config.bindParams( input ), {  headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:variable-name
  add<BodyType, UpdateType, QueryInput>( body: BodyType, input?: QueryInput ): Observable<UpdateType>{
    return this.http.post<UpdateType>(  Config.get_api('admin/question' ),
      body, { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }


}

export interface Paginatable {
  links: ApiLinks;
  meta: ApiMeta;
}

export interface ApiLinks {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface ApiMeta {
  current_page: number | 0;
  from: number | 0;
  last_page: number | 0;
  per_page: number | 0;
  to: number | 0;
  total: number | 0;
  path?: string | '';
}


export interface DataOption{
  input?: () => HttpParams | {};
  url_vars?: () => object;
}

export interface DataTrashable {
  _permanent?: 'true' | 'false' | '';
  _bundle: 'true' | 'false' | '';
  _bundle_ids: (string | number) | (string | number) [];

}

export interface ApiQuery {
  search_text ?: string;
  page ?: number | 1;
  page_size ?: number | 1;
  sort ?: string | object | undefined;
  sort_type ?: 'asc' | 'desc' | '';
  _trashed_only ?: 1 | 0;
  _trashed ?: 1 | 0;
  _published_only ?: 1 | 0;
}
