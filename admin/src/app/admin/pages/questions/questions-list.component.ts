import { HttpClient } from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf, Subject, fromEvent } from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map, reduce, startWith, switchMap} from 'rxjs/operators';
import {ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Question, QuestionDataApi, QuestionQueryInput, QuestionsService, QuestionUpdate} from '../../../services/questions.service';
import {DataService} from '../../../services/data.service';
import {CategoryService} from '../../../services/category.service';
import {SearchModel} from '../../../components/search/search.component';
import {DataListService} from '../../../services/data-list.service';
import {AppService} from '../../../services/app.service';


@Component({
  selector: 'app-table-example',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements AfterViewInit, OnInit, OnDestroy {

  constructor(
    // tslint:disable-next-line:variable-name
    private _http: HttpClient,
    public dialog: MatDialog,
    public dataService: DataService<Question>,
    public cat: CategoryService,
    public app: AppService,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private quest: QuestionsService,
    public listService: DataListService
  ) { this.list.loading = true; }

  list = this.listService.new( 'QuizList' );

  get displayedColumns( ): string[ ] {
    return this.list.isTrashList ?
      [ 'select', 'id', 'title', 'deleted_at', 'action' ] : [ 'select', 'id', 'title', 'answer', 'created_at', 'action'];
  }

  get dataOptions(): QuestionQueryInput {
    const opts: QuestionQueryInput = new QuestionQueryInput();
    opts.page        =   this.paginator.pageIndex + 1;
    opts.page_size   =   this.paginator.pageSize;
    opts.sort        =   this.sort.active;
    opts.sort_type   =   this.sort.direction;
    opts.search_text =   this.qSearch.value || '';
    opts._trashed_only = this.isTrashList ? 1 : 0;
    return opts;
  }

  private reloadBtn = new Subject( );
  isTrashList: boolean | false;
  dataIsNotFound = false;
  selection = this.dataService.setSelection();
  errString: string = null;
  data: Question[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  reloadBtn$: Observable<any> = this.reloadBtn.asObservable();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loaded: boolean = false;
  dataChange$: Subject<QuestionUpdate> = new Subject<QuestionUpdate>( );
  dataChange: Observable<QuestionUpdate> = this.dataChange$.asObservable( );
  qSearch: SearchModel = new SearchModel();
  dataChangeDetected = false;

  i = 0;
  ngOnInit(): void {
    this.dataChange = this.quest.onDataChanged( );
  }

  ngAfterViewInit(): void {

    // this.quest.onDataChanged().subscribe( ( data: QuestionUpdate ) => this.quest.open_snak_bar( data.message ) );
    // const commonEvents = merge( this.quest.onDataChanged( ), this.reloadBtn$, this.sort.sortChange, this.qSearch.change );
    // commonEvents.subscribe( () => this.paginator.pageIndex = 0 );

    this.list.paginator = this.paginator;
    this.list.sort = this.sort;
    this.list.addEvent( this.reloadBtn$ );

    // this.quest.onDataChanged().pipe(
    //   filter( () => !this.list.loading )
    // ).subscribe( data => this.list.load({ action: data.action }) );


    this.list.addEvent( this.quest.onDataChanged().pipe( filter( () =>  !this.list.loading ) ) );

    this.list.addEvent( this.app.loaded( () => this.loaded ) );

    this.dataChange.subscribe( d => console.log( '====>>>>', d ) );


    this.list.beforeLoad.subscribe(data => console.log( 'LOADff', data ) );
    this.list.response.subscribe( (response: QuestionDataApi ) => {
      this.resultsLength = response.meta?.total;
      this.data = response.data;
      this.loaded = true;
    });


    this.list.error.subscribe( () => this.loaded = true );

    // this.list.addEvent( this.quest.onDataChanged() );
    this.list.get( 'admin/question/list' );

    // this.list.load();

    // merge( commonEvents, this.paginator.page ).pipe(
    //   startWith({}),
    //   switchMap( ( d ) => {
    //     this.dataIsNotFound = false;
    //     this.isLoadingResults = true;
    //     this.isRateLimitReached = false;
    //     console.log( 'this.dataOptions', this.dataOptions );
    //     return this.quest.list( this.dataOptions );
    //     // return this.quizDataApi( this.dataOptions );
    //   }),
    //   map( ( quizApi: QuestionDataApi ) => {
    //     this.isLoadingResults = false;
    //     this.isRateLimitReached = false;
    //     const meta: ApiMeta = quizApi.meta;
    //     this.resultsLength = meta?.total;
    //     return quizApi.data;
    //   })
    //   ,
    //   catchError(( err ) => {
    //     this.dataIsNotFound = false;
    //     this.isLoadingResults = false;
    //     this.isRateLimitReached = true;
    //     this.errString = err.message;
    //     return observableOf([]);
    //   })
    // ).subscribe( data => { this.data = data; this.dataIsNotFound = data?.length === 0; this.selection.clear( );  });
  }

  toggleTrashList(): void{
    this.list.toggleTrashList();
    // this.isTrashList = !this.isTrashList;
    // this.reloadBtn.next( );
  }

  checkboxLabel(row?: QuizItem): string {
    if (row) {
      return String(row.id);
    }
  }
  runAccentBtn( ): void{
    console.log('ddd');
    this.reloadBtn.next( );
    // this.list.load({ttttttttttt:  this.i++});
  }

  ngOnDestroy(): void {
    this.dataChange = null;
  }



}

export interface QuizUpdateApi {
  data: QuizItem[ ] | null;
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

export interface QuizItem {
  id: string | number;
  title: string;
  description: string;
  full_marks: number;
  negative_marks_each: number;
  negative_mark_type: string | 'percent' | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  publish: number;
}

