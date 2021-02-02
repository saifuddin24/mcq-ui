import {EventEmitter, Injectable} from '@angular/core';
import {merge, Observable, Observer, of as observableOf, Subject} from 'rxjs';
import {catchError, filter, map, startWith, switchMap} from 'rxjs/operators';
import {HttpClient, HttpHandler, HttpParams} from '@angular/common/http';
import {Config} from './Config';
import {ApiInput, AppService, DataUpdate} from './app.service';
import {ConfirmDialogComponent, DialogOptions} from '../components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {stringify} from '@angular/compiler/src/util';
import {ApiLinks, ApiMeta, ApiQuery, DataService, DataTrashable, Paginatable} from './data.service';
import {ANSWER_OPTIONS_TYPES, OptionSetsResult, QuestionOptionSet} from '../admin/pages/questions/question-opts-manager.component';
import {Category} from './category.service';
import {AssignedAnswerInput} from '../admin/pages/quest-assigned-list/add-assigned-question.component';
import {AssignedQuestionItem} from '../admin/pages/quest-assigned-list/quest-assigned-list.component';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  // Observable AppResponse sources

  dataAction = new Subject<any>();
  private confirmDialog: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private appService: AppService,
    private http: HttpClient,
    private dataService: DataService<Question>,
  ) { }

  // tslint:disable-next-line:variable-name
  onAction<T>( filter_callback ?: (data: T) => boolean ): Observable<T>{
    if ( filter_callback === undefined ){ return this.dataAction.asObservable(); }
    return this.dataAction.asObservable().pipe( filter( (data: T) => filter_callback(data) ) );
  }


  /**
   * observer for question CUD = create, update, delete
   */
  onDataChanged(): Observable<QuestionUpdate>{
    return this.dataAction.asObservable();
  }

  onAdded( ): Observable<QuestionUpdate> {
    return this.onAction<QuestionUpdate>( data => data.action === 'added' );
  }

  onEdited( ): Observable<QuestionUpdate> {
    return this.onAction<QuestionUpdate>( data => data.action === 'updated' );
  }

  onDeleted( ): Observable<QuestionUpdate> {
    return this.onAction<QuestionUpdate>( data => data.action === 'deleted' );
  }

  onRestored( ): Observable<QuestionUpdate> {
    return this.onAction<QuestionUpdate>( data => data.action === 'restored' );
  }

  onPermanentDelete( ): Observable<QuestionUpdate> {
    return this.onAction<QuestionUpdate>( data => data.action === 'permanently-deleted' );
  }

  // tslint:disable-next-line:typedef
  setDataAction( data: QuestionUpdate ){
    this.dataAction.next( data );
  }


  // tslint:disable-next-line:variable-name
  list( input?: QuestionQueryInput ): Observable<QuestionDataApi>{
    return this.http.get<QuestionDataApi>(  Config.get_api('admin/question/list'),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:variable-name
  single(id: number | string, input?: object): Observable<QuestionSingle>{
    return this.http.get<QuestionSingle>(  Config.get_api('admin/question/' + id ),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef
  edit( catId: number | string, body: QuestionInputs, input?: object ): Observable<QuestionUpdate>{
    return this.http.put<QuestionUpdate>(  Config.get_api('admin/question/' + String( catId ) ),
      body, { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef
  delete( id: number | string, input: QuestionDeleteInput): Observable<QuestionUpdate>{
    return this.http.delete<QuestionUpdate>(  Config.get_api('admin/question' + ( String( id ).trim().length > 0 ? '/' + id : '' ) ),
      {  headers: Config.headers(), params: Config.bindParams( input )}
    );
  }

  // tslint:disable-next-line:typedef
  restore( id: number | string, input: QuestionDeleteInput ): Observable<QuestionUpdate>{
    return this.http.patch<QuestionUpdate>(  Config.get_api('admin/question/restore' + ( String( id ).trim().length > 0 ? '/' + id : '' ) ),
      Config.bindParams( input ), {  headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:variable-name
  add( body: QuestionInputs, input?: object ): Observable<QuestionUpdate>{

    return this.http.post<QuestionUpdate>(  Config.get_api('admin/question' ),
      body, { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // getInputs( catInputs: QuestionInputs ): HttpParams{
  //   let params: HttpParams = new HttpParams();
  //   Object.keys( catInputs ).map( key => {
  //     if ( catInputs[key] !== null ) {
  //       params =  params.set( key, catInputs[key] );
  //     }
  //   });
  //   return  params;
  // }


  actionError(): void{

  }

  deleteOrRestoreObserver( dialogRef: MatDialogRef<ConfirmDialogComponent>, dialogOption: DialogOptions ): Observer<QuestionUpdate>{
    this.onDataChanged( ).subscribe( () => dialogRef.close( ) );
    dialogOption.onPositiveAction = () => { }
    dialogOption.body = 'Processing...';
    return {
      next: data => this.setDataAction(data),
      error: data => dialogOption.body = data.error?.message || '',
      complete: () => {}
    };
  }



  actionOptionList( row ): DialogOptions[] {

    // tslint:disable-next-line:variable-name
    const bundle_ids: string = this.dataService.bundleValues( 'id' );

    const input: QuestionDeleteInput = new QuestionDeleteInput();
    input._bundle = bundle_ids.length > 0 ? 'true' : 'false',
    input._bundle_ids = bundle_ids.length > 0 ? bundle_ids : '';

    console.log( input );



    return [
      {
        action_name: 'delete',
        title: 'Deleting item(s)',
        body: 'Item(s) will be deleted',
        onPositiveAction: ( dialogRef, dialogOption) => {
          input._permanent = 'false';
          this.delete( row?.id || '', input  ).subscribe( this.deleteOrRestoreObserver( dialogRef, dialogOption ) );
        }
      },
      {
        action_name: 'permanent-delete',
        title: 'Are you Sure delete permanently?',
        body: 'Item(s) will be deleted permanently, action cannot be undone!',
        onPositiveAction: ( dialogRef, dialogOption) => {
          input._permanent = 'true';
          this.delete( row?.id || '', input  ).subscribe(  this.deleteOrRestoreObserver( dialogRef, dialogOption ) );
        }
      },
      {
        action_name: 'restore',
        title: 'Restoring item(s)',
        body: 'Item(s) will be restored',
        onPositiveAction: ( dialogRef, dialogOption) => {
          this.restore( row?.id || '', input  ).subscribe(this.deleteOrRestoreObserver( dialogRef, dialogOption ));
        }

      },
    ];
  }

  // tslint:disable-next-line:typedef
  performAction( action, row?  ) {
    // const dialogOptions: DialogOptions = { };
    const opts = this.actionOptionList( row ).filter( item => item.action_name === action );
    const dialogOptions = opts[0] || null;

    if ( dialogOptions ) {
      this.appService.openConfirmDialog( dialogOptions );
    }
  }

  open_snak_bar( message: string ): void{
    this._snackBar.open( message, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}



export  class QuestionInputs {
  title: string;
  answer: string;
  description: string;
  categories?: (string | number) [];
  // tslint:disable-next-line:variable-name
  option_sets?: OptionSetsResult[ ];
}

export class QuestionSingle {
  data: Question;
}

export class QuestionMeta {
  id: string | number;
  // tslint:disable-next-line:variable-name
  meta_name: string;
  // tslint:disable-next-line:variable-name
  meta_value: string;


  // tslint:disable-next-line:typedef
  static defaultMetaValue(){
    // tslint:disable-next-line:max-line-length
    // {"options": [{ "opt":"ক", "value": "" }, {"opt":"খ", "value": ""}, { "opt":''গ","value":""} , {"opt":"ঘ", "value": ""}], "right_answer":"" ]
  }

  get_meta_object(): object {
    try{
      return JSON.parse(this.meta_value);
    }catch (e) {
      return {};
    }
  }

}

export class Question {
  id: string | number;
  // tslint:disable-next-line:variable-name
  user_id: string;
  // tslint:disable-next-line:variable-name
  created_at: string;
  // tslint:disable-next-line:variable-name
  updated_at: string;
  // tslint:disable-next-line:variable-name
  deleted_at: string;
  title: string;
  answer: string;
  description: string;
  hidden: number| string;
  // tslint:disable-next-line:variable-name
  meta_list: QuestionMeta[] | null;
  categories: Category[] | null;
  // tslint:disable-next-line:variable-name
  category_ids: string[] | number [];
  // tslint:disable-next-line:variable-name
  category_names: string[];
  // tslint:disable-next-line:typedef
  get_categories( ): Category[]{
    return this.categories?.map( item => Category.getInstance( item ) );
  }
}

export class QuestionUpdate implements DataUpdate<Question>{
  data: Question | null;
  action: string = '';
  success: boolean;
  message: string;
}

export class QuestionQueryInput implements ApiQuery{
  // tslint:disable-next-line:variable-name
  _published_only: 1 | 0;
  // tslint:disable-next-line:variable-name
  _trashed: 1 | 0;
  // tslint:disable-next-line:variable-name
  _trashed_only: 1 | 0;
  page: number | 1;
  // tslint:disable-next-line:variable-name
  page_size: number | 1;
  // tslint:disable-next-line:variable-name
  search_text: string;
  sort: string | object | undefined;
  // tslint:disable-next-line:variable-name
  sort_type: 'asc' | 'desc' | '';
  exclution: string | '';
  ss: string | '';
}

export class QuestionDataApi implements Paginatable{
  data: Question[];
  links: ApiLinks;
  meta: ApiMeta;
}

export class QuestionDeleteInput implements DataTrashable{
  // tslint:disable-next-line:variable-name
  _bundle: 'true' | 'false' | '' = 'false';
  // tslint:disable-next-line:variable-name
  _bundle_ids: (number | string) | ( number | string)[] = 0;
  // tslint:disable-next-line:variable-name
  _permanent?: 'true' | 'false' | '';
}

export class AssignedQuestionResultItem {
  id: string | number;
  // tslint:disable-next-line:variable-name
  quiz_id: string | number;
  // tslint:disable-next-line:variable-name
  question_id: string | number;
  answer: string;
  // tslint:disable-next-line:variable-name
  answer_options: string;
  position: string | number ;
}

export class AssignedQuestionResult {
  deleted: string | number;
  updated: string | number;
  inserted: string | number;
  total: string | number;
  // tslint:disable-next-line:variable-name
  inserted_data: AssignedQuestionItem[];
  // tslint:disable-next-line:variable-name
  updated_data: AssignedQuestionItem[];
  action: string;
  success: boolean | null;
  message: string;
  count: string | number;
}

export class AssignQuestionResponse {
  data: AssignedAnswerInput;
}
