import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';
import {SelectionModel} from '@angular/cdk/collections';
import {Component, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf, Subject, fromEvent } from 'rxjs';
import {catchError, debounceTime, distinct, distinctUntilChanged, map, reduce, startWith, switchMap} from 'rxjs/operators';
import {AppResponse, DataUpdate} from '../../../services/app.service';
import {Config} from '../../../services/Config';
import {ConfirmDialogComponent, DialogOptions} from '../../../components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SaveContentComponent} from './save-content.component';
import {Category} from '../../../services/category.service';
import {AssignedQuestionItem} from '../../pages/quest-assigned-list/quest-assigned-list.component';

@Component({
  selector: 'app-table-example',
  templateUrl: './table-example.component.html',
  styleUrls: ['./table-example.component.css']
})
export class TableExampleComponent implements AfterViewInit {

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) {}
  isTrashList: boolean | false;
  dataIsNotFound = false;

  // tslint:disable-next-line:typedef
  toggleTrashList(){
    this.isTrashList = !this.isTrashList;
    this.reloadBtn.next( );
  }

  get parseBundleIdsString(): string{
    const selected = this.selection.selected;
    let str = '';
    if (selected) {
      selected.map( item => str += item.id + ',' );
    }
    return str.replace( /\,$/g, '');
  }

  get requiredHeaders( ): HttpHeaders | {} {
    return { Authorization: Config.AUTHORIZATION , Accept: 'application/json', ContentType: 'application/json' };
  }

  selection = new SelectionModel<any>(true, []);
  errString: string = null;
  filterString: string = null;

  get displayedColumns( ): string[ ] {
    return this.isTrashList ? [ 'select', 'id', 'title', 'deleted_at', 'action' ]
      :
    [ 'select', 'id', 'title', 'full_marks', 'created_at', 'action'];
  }
  data: QuizItem[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private reloadBtn = new Subject( );
  private filter = new Subject<string>( );
  reloadBtn$: Observable<any> = this.reloadBtn.asObservable();
  filter$: Observable<string> = this.filter.asObservable();

  dataAction = new Subject<object>();
  confirmDialog: MatDialogRef<ConfirmDialogComponent>;

  // tslint:disable-next-line:typedef
  performAction( action, row?: QuizItem | null ) {
    const dialogOptions: DialogOptions = {};
    switch ( action ) {
      case 'delete' :
      case 'permanent-delete' :
        dialogOptions.title = action === 'delete' ? 'Deleting item(s)' : 'Permanent Delete';
        dialogOptions.body = action === 'delete' ? 'Item will be deleted' :
          'Item(s) will deleted permanently delete. action cannot be undone';
        // tslint:disable-next-line:max-line-length
        dialogOptions.positiveAction = this.quizDeleteApi( {
          _permanent : action === 'permanent-delete' ? 'true' : 'false',
          _bundle : row ? 'false' : 'true',
          _bundle_ids : encodeURIComponent( this.parseBundleIdsString )
        }, (row ? row.id : null) );
        break;
      case 'restore' :
        dialogOptions.title = 'Restring Item(s)';
        dialogOptions.body = 'Item(s) will restored';
        // tslint:disable-next-line:max-line-length
        dialogOptions.positiveAction = this.quizRestoreApi( {
          _bundle : row ? 'false' : 'true',
          _bundle_ids : encodeURIComponent( this.parseBundleIdsString )
        }, (row ? row.id : null) );
        break;
      case 'publish':
        break;
    }

    dialogOptions.positiveActionError = ( value: any): void => {

    };

    dialogOptions.positiveActionNext = ( value ): void => {
      this.dataAction.next( value )
      this.confirmDialog.close( value );
    },

    this.confirmDialog =  this.openConfirmDialog( dialogOptions);

    this.dataAction.subscribe( ( data: QuizUpdateApi ) => {
      this._snackBar.open( data.message, 'close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  }


  toggleContentSaveDialog(): MatDialogRef<SaveContentComponent>{
    return  this.dialog.open( SaveContentComponent,  {
      width: '1200px',
      disableClose: false,
      data: {},
    });
  }


  openConfirmDialog( dialogOptions: DialogOptions): MatDialogRef<ConfirmDialogComponent> {
    return  this.dialog.open( ConfirmDialogComponent,  {
      width: '400px',
      disableClose: true,
      data: dialogOptions,
    });
  }

  // tslint:disable-next-line:typedef
  masterToggle(){
    this.isAllSelected( ) ?
      this.selection.clear( ) :
      this.data.map( item => this.selection.select(item) );
  }

  // tslint:disable-next-line:typedef
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: QuizItem): string {
    if (row) {
      return String(row.id);
    }
  }

  filterEvent( ): Observable< string >{
    const obs: Observable<string> = this.filter$.pipe(
      map(value => value.trim() ),
      debounceTime( 500 ), distinctUntilChanged( ),
      map(value => this.filterString = value ),
    );
    // obs.subscribe( value => this.filterString = value );
    return obs;
  }

  // tslint:disable-next-line:typedef
  runAccentBtn( ){
    this.reloadBtn.next( );
  }

  // tslint:disable-next-line:typedef
  filterData( $event ){
    this.filter.next( $event.target.value );
  }

  get dataOptions(): QuizApiInput {
    const opts: QuizApiInput = { };
    opts.page        =   this.paginator.pageIndex + 1;
    opts.page_size   =   this.paginator.pageSize;
    opts.sort        =   this.sort.active;
    opts.sort_type   =   this.sort.direction;
    opts.search_text =   this.filterString || '';
    opts._trashed_only = this.isTrashList ? 1 : 0;
    return opts;
  }


  ngAfterViewInit(): void {

    const commonEvents = merge( this.dataAction, this.reloadBtn$, this.sort.sortChange, this.filterEvent() );
    commonEvents.subscribe( () => this.paginator.pageIndex = 0 );

    merge( commonEvents, this.paginator.page ).pipe(
      startWith({}),
      switchMap( ( d ) => {
        this.dataIsNotFound = false;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        return this.quizDataApi( this.dataOptions );
      }),
      map( ( quizApi: QuizApi ) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        const meta: ApiMeta = quizApi.meta;
        this.resultsLength = meta?.total;
        return quizApi.items;
      })
      ,
      catchError(( err ) => {
        this.dataIsNotFound = false;
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.errString = err.message;
        return observableOf([]);
      })
    ).subscribe( data => { this.data = data; this.dataIsNotFound = data?.length === 0; this.selection.clear( );  });
  }

  bindParams( input: object ): HttpParams | { } {
    let params = new HttpParams( );
    Object.keys( input ).map( key => params = params.append( key, input[key] ) );
    return params;
  }

  quizDataApi( input: QuizApiInput ): Observable<QuizApi>{
    return this._http.get(  Config.get_api('admin/quiz/list' ),
      { params: this.bindParams( input ), headers: this.requiredHeaders }
    );
  }

  quizDeleteApi( input: QuizUpdateInput, id?: string | number | null ): Observable<QuizUpdateApi>{
    // @ts-ignore
    return this._http.delete(  Config.get_api('admin/quiz' + ( id ? '/' + String( id ) : '') ),
      { params: this.bindParams( input ), headers: this.requiredHeaders, }
    );
  }

  quizRestoreApi( input: QuizUpdateInput, id?: string | number | null ): Observable<QuizUpdateApi>{
    // @ts-ignore
    return this._http.patch(  Config.get_api('admin/quiz/restore' + ( id ? '/' + String( id ) : '') ),
      { }, { params: this.bindParams( input ), headers: this.requiredHeaders, }
    );
  }

}

export class QuizUpdateApi implements DataUpdate<QuizItem>{
  data: QuizItem;
  action: string;
  success: boolean | false;
  message: string;
  count?: number;
}

export interface QuizUpdateInput {
  _permanent?: 'true' | 'false';
  _bundle?: 'true' | 'false';
  _bundle_ids?: string;
}

export interface QuizApiInput {
  search_text ?: string;
  page ?: number | 1;
  page_size ?: number | 1;
  sort ?: string | object | undefined;
  sort_type ?: 'asc' | 'desc' | '';
  _trashed_only ?: 1 | 0;
  _trashed ?: 1 | 0;
  _published_only ?: 1 | 0;
}

export interface QuizApi {
  items?: QuizItem[] | null;
  links?: ApiLinks | null;
  meta?: ApiMeta | null;
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

export class QuizItem  implements  Categorized {
  id: string | number;
  title: string;
  description: string;
  // tslint:disable-next-line:variable-name
  full_marks: number;
  // tslint:disable-next-line:variable-name
  negative_marks_each: number;
  // tslint:disable-next-line:variable-name
  negative_mark_type: 'marks' | 'percent' | '';
  // tslint:disable-next-line:variable-name
  user_id: number;
  // tslint:disable-next-line:variable-name
  created_at: string;
  // tslint:disable-next-line:variable-name
  updated_at: string;
  // tslint:disable-next-line:variable-name
  deleted_at: string;
  publish: number;

  categories: Category[] | null;
  // tslint:disable-next-line:variable-name
  category_ids: string[] | number[];
  // tslint:disable-next-line:variable-name
  category_names: string[];
  questions: AssignedQuestionItem[ ];
  // tslint:disable-next-line:variable-name
  answer_options_type: string;
  get_categories( ): Category[]{
    return this.categories?.map( item => Category.getInstance( item ) );
  }
}

export interface Categorized {
  categories: Category[] | null;
  // tslint:disable-next-line:variable-name
  category_ids: string[] | number [];
  // tslint:disable-next-line:variable-name
  category_names: string[];
  // tslint:disable-next-line:typedef
  get_categories: (categories: Category[]) => Category[];
}

