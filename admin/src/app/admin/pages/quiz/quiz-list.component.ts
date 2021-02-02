import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataListService} from '../../../services/data-list.service';
import {QuizApi, QuizItem} from '../../components/table-example/table-example.component';
import {filter} from 'rxjs/operators';
import {QuestionUpdate} from '../../../services/questions.service';
import {DataService} from '../../../services/data.service';
import {CategoryService} from '../../../services/category.service';
import {AppService} from '../../../services/app.service';
import {Subject} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {QuizService} from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz.component.css']
})
// @ts-ignore
export class QuizListComponent implements OnInit, AfterViewInit {

  constructor(
    public data: DataService<QuizItem>,
    public quiz: QuizService,
    public cat: CategoryService,
    public app: AppService,
    // public list: DataListService< QuizApi >,
    public listService: DataListService
  ) {  this.list.loading = true; }


  get displayedColumns( ): string[ ] {
    return this.list.isTrashList ?
      [ 'select', 'id', 'title', 'deleted_at', 'action' ] : [ 'select', 'id', 'title', 'full_marks', 'created_at', 'action'];
  }

  list = this.listService.new<QuizApi>('QuizList' )

  errString: string = null;
  items: QuizItem[] = [];
  resultsLength = 0;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  loaded: boolean = false;
  dataChange$: Subject<QuestionUpdate> = new Subject<QuestionUpdate>( );

  checkboxLabel(  item?: QuizItem ): string{
    return  '';
  }

  ngOnInit(): void {
    this.list.addEvent( this.quiz.onDataChanged().pipe( filter( () =>  !this.list.loading ) ) );

    this.list.addEvent( this.app.loaded( () => this.loaded ) );
    this.list.beforeLoad.subscribe(data => console.log( 'LOADff', data ) );
    this.list.error.subscribe( () => this.loaded = true );

    this.list.response.subscribe( (response: QuizApi ) => {
      this.data.selection.clear();
      this.resultsLength = response.meta?.total;
      this.items = response.items;
      this.loaded = true;
    });
  }

  ngAfterViewInit(): void {
    this.list.paginator = this.paginator;
    this.list.sort = this.sort;
    this.list.get( 'admin/quiz/list' );
  }

}
