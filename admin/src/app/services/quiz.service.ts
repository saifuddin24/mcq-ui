import {Injectable} from '@angular/core';
import {Observable, Observer, of as observableOf, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {HttpClient, HttpHandler, HttpParams} from '@angular/common/http';
import {Config} from './Config';
import {AppService } from './app.service';
import {ConfirmDialogComponent, DialogOptions} from '../components/confirm-dialog/confirm-dialog.component';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiQuery, DataService, DataTrashable } from './data.service';
import {QuizApi, QuizItem, QuizUpdateApi} from '../admin/components/table-example/table-example.component';
import {AssignQuestionResponse, Question} from './questions.service';
import {AssignedAnswerInput} from '../admin/pages/quest-assigned-list/add-assigned-question.component';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // Observable AppResponse sources

  dataAction = new Subject<any>();
  assignAction = new Subject<AssignQuestionResponse>();

  constructor(
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private appService: AppService,
    private http: HttpClient,
    private dataService: DataService<QuizItem>,
  ) { }

  // tslint:disable-next-line:variable-name
  onAction<T>( filter_callback ?: (data: T) => boolean ): Observable<T>{
    if ( filter_callback === undefined ){ return this.dataAction.asObservable(); }
    return this.dataAction.asObservable().pipe( filter( (data: T) => filter_callback(data) ) );
  }

  onQuestionAssigned(): Observable<AssignQuestionResponse> {
    return this.assignAction.asObservable();
  }


  /**
   * observer for question CUD = create, update, delete
   */
  onDataChanged(): Observable<QuizUpdateApi>{
    return this.dataAction.asObservable();
  }

  onAdded( ): Observable<QuizUpdateApi> {
    return this.onAction<QuizUpdateApi>( data => data.action === 'added' );
  }

  onEdited( ): Observable<QuizUpdateApi> {
    return this.onAction<QuizUpdateApi>( data => data.action === 'updated' );
  }

  onDeleted( ): Observable<QuizUpdateApi> {
    return this.onAction<QuizUpdateApi>( data => data.action === 'deleted' );
  }

  onRestored( ): Observable<QuizUpdateApi> {
    return this.onAction<QuizUpdateApi>( data => data.action === 'restored' );
  }

  onPermanentDelete( ): Observable<QuizUpdateApi> {
    return this.onAction<QuizUpdateApi>( data => data.action === 'permanently-deleted' );
  }

  // tslint:disable-next-line:typedef
  setDataAction( data: QuizUpdateApi ){
    this.dataAction.next( data );
  }

  assignQuestions( input: AssignedAnswerInput, params?: object,
                   triggerAction: boolean = true ): Observable< AssignQuestionResponse >{
    const obs: Observable<AssignQuestionResponse> = this.assignQuests( input, params );
    return !triggerAction ? obs : obs.pipe( map( item => {
      this.assignAction.next( item );
      return item;
    }));
  }

  private assignQuests(input: AssignedAnswerInput, params?: object ): Observable< AssignQuestionResponse >{
    return this.http.put<AssignQuestionResponse>(Config.get_api('admin/quiz/questions'), input, {
      params: Config.bindParams( params ), headers: Config.headers()
    });
  }


  // tslint:disable-next-line:variable-name
  list( input?: QuizQueryInput ): Observable<QuizApi>{
    return this.http.get<QuizApi>(  Config.get_api('admin/question/list'),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:variable-name
  single(id: number | string, input?: object): Observable<QuizSingle>{
    return this.http.get<QuizSingle>(  Config.get_api('admin/quiz/' + id ),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef variable-name
  edit( quiz_id: number | string, body: object, queryInput?: object ): Observable<QuizUpdateApi>{
    return this.http.put<QuizUpdateApi>(  Config.get_api('admin/quiz/' + String( quiz_id ) ),
      body, { params: Config.bindParams( queryInput ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef
  delete( id: number | string, queryInput: QuizDeleteInput): Observable<QuizUpdateApi>{
    return this.http.delete<QuizUpdateApi>(  Config.get_api('admin/quiz' + ( String( id ).trim().length > 0 ? '/' + id : '' ) ),
      {  headers: Config.headers(), params: Config.bindParams( queryInput )}
    );
  }

  // tslint:disable-next-line:typedef
  restore( id: number | string, queryInput: QuizDeleteInput ): Observable<QuizUpdateApi>{
    return this.http.patch<QuizUpdateApi>(  Config.get_api('admin/quiz/restore' + ( String( id ).trim().length > 0 ? '/' + id : '' ) ),
      Config.bindParams( queryInput ), {  headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:variable-name
  add( body: QuizInputs, queryInput?: object ): Observable<QuizUpdateApi>{

    return this.http.post<QuizUpdateApi>(  Config.get_api('admin/quiz' ),
      body, { params: Config.bindParams( queryInput ), headers: Config.headers() }
    );
  }

  deleteOrRestoreObserver( dialogRef: MatDialogRef<ConfirmDialogComponent>, dialogOption: DialogOptions ): Observer<QuizUpdateApi>{
    this.onDataChanged( ).subscribe( () => dialogRef.close( ) );
    dialogOption.onPositiveAction = () => { };
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

    const input: QuizDeleteInput = new QuizDeleteInput();
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
  doAction( action, row?  ) {
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


export class QuizQueryInput implements ApiQuery{
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
}

export  class QuizInputs {
  title: string;
  // tslint:disable-next-line:variable-name
  answer_options_type: string;
  // tslint:disable-next-line:variable-name
  full_marks: string | number;
  description: string;
  // tslint:disable-next-line:variable-name
  negative_marks_each: number | string;
  // tslint:disable-next-line:variable-name
  negative_mark_type: 'percent' | 'marks' | '';

  categories?: (string | number) [];

  publish: number;

  questions: (string | number)[];

  // tslint:disable-next-line:variable-name
  answer_options_sets: object;

  // tslint:disable-next-line:variable-name
  questions_answer: object;

}

export class QuizSingle {
  data: QuizItem;
}

export class QuizDeleteInput implements DataTrashable{
  // tslint:disable-next-line:variable-name
  _bundle: 'true' | 'false' | '' = 'false';
  // tslint:disable-next-line:variable-name
  _bundle_ids: (number | string) | ( number | string)[] = 0;
  // tslint:disable-next-line:variable-name
  _permanent?: 'true' | 'false' | '';
}


