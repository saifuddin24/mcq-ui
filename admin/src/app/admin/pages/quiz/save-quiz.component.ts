import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Question, QuestionInputs, QuestionMeta, QuestionsService, QuestionUpdate} from '../../../services/questions.service';
import {DataService} from '../../../services/data.service';
import {CategorySelector} from '../category/category-selector.component';
import {OptionSetsResult, QuestionOptionGenerator, QuestionOptionSet} from '../questions/question-opts-manager.component';
import {merge, Observable, Subject} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {QuizItem, QuizUpdateApi} from '../../components/table-example/table-example.component';
import {QuizInputs, QuizService} from '../../../services/quiz.service';
import {AssignedQuestionItem} from '../quest-assigned-list/quest-assigned-list.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SaveContentComponent} from '../../components/table-example/save-content.component';
import {AddAssignedQuestionComponent, AssignedAnswerInput} from '../quest-assigned-list/add-assigned-question.component';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './save-quiz.component.html',
  styleUrls: ['./save-quiz.component.css']
})
export class SaveQuizComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    private quiz: QuizService,
    private router: Router,
    private dataService: DataService<Question>,
    public dialog: MatDialog,
  ) { }

  // tslint:disable-next-line:variable-name
  private _selectedCatIds: (number | string )[] = [];

  quizSubject: CategorySelector = new CategorySelector( );

  questOptGenerator: QuestionOptionGenerator = new QuestionOptionGenerator();

  optSet: OptionSetsResult[] = [];

  message: string = null;

  initialized: boolean = false;
  isBusy: boolean = true;
  initializatin: Subject<object> = new Subject<object>();
  initializatin$: Observable<object> = this.initializatin.asObservable();
  isEditing: boolean = false;
  assignedQuestions: AssignedQuestionItem[] = [];

  // tslint:disable-next-line:variable-name
  form_value: QuizInputs = {
    title : '',
    answer_options_type: 'A',
    description: '',
    full_marks: 0,
    publish: 0,
    negative_marks_each: 0,
    negative_mark_type: 'percent',
    categories: [],
    questions:  [],
    answer_options_sets: {},
    questions_answer: {},
  };

  setAnswerOptions( output: AssignedAnswerInput ): void{
    this.form_value.questions = output.questions;

    if ( this.form_value.questions ) {
       this.form_value.answer_options_sets = output.answer_options_sets;
       this.form_value.questions_answer = output.question_answers;
    }
  }

  // tslint:disable-next-line:variable-name
  public quiz_id = null;

  // tslint:disable-next-line:typedef
  onOptChange( e ){
    // alert( JSON.stringify(e.type) );
    this.form_value.answer_options_type = e.type;
  }

  onChangeAnswer( e ): void{
    console.log( e.target.value );
    this.questOptGenerator.answer( e.target.value );
  }

  runForm(): void{

    this.form_value.categories = this.quizSubject.selectedIds;
    this.isBusy = true;
    this.message = null;
    // this.isBusy = false;

    console.log( this.form_value );

    // this.form_value.questions = [];

    merge( this.quiz.onAdded( ), this.quiz.onEdited() )
      .subscribe( d => this.isBusy = false, e => this.isBusy = false );

    console.log(  this.form_value );

    let action = this.quiz.add( this.form_value, {_return_with_assigned_questions: 'true'} );
    if ( this.isEditing && this.quiz_id ) {
      action = this.quiz.edit( this.quiz_id, this.form_value, {_return_with_assigned_questions: 'true' } );
    }

    action.subscribe( (update: QuizUpdateApi) => {
      this.quiz.setDataAction( update );
      if ( !this.isEditing ) {
        this.router.navigate([ '/learn/questions/edit/' + update.data.id ] );
      }
    },  ( response ) => {
      this.message = response.error.message;
      // console.log( [response.error, response.status] );
      this.isBusy = false;
    });
  }

  ngOnInit(): void {
    this.quizId().subscribe( id => this.quiz_id = id );

    this.quiz.onEdited( )
      .subscribe( (update: QuizUpdateApi) => this.setEditPage( update.data) );

    this.initializatin$.subscribe( (quiz: QuizItem) => {
      if ( quiz ) {
        this._selectedCatIds = quiz.category_ids;
      }

      this.quizSubject.categoryLoaded.subscribe( () => {
        this.initialized = true;
        this.isBusy = false;
      });

      if ( !this.initialized ) {
        this.quizSubject.load( this._selectedCatIds );
      }else {
        this.quizSubject.setCategoryIds(  this._selectedCatIds );
      }

    });
  }

  quizId(): Observable<string | number>{
    return this.route.params.pipe(
      filter( param => param.quiz_id ),
      map( param => param.quiz_id )
    );
  }

  setEditPage( quiz: QuizItem ): void{


    this.isBusy = false;
    console.log( 'quiz', quiz );

    this.form_value.title = quiz.title;
    this.form_value.answer_options_type = quiz.answer_options_type;
    this.form_value.description = quiz.description;
    this.form_value.full_marks = quiz.full_marks;
    this.form_value.publish = quiz.publish;
    this.form_value.negative_marks_each = quiz.negative_marks_each;
    this.form_value.negative_mark_type = quiz.negative_mark_type;

    this.assignedQuestions = quiz.questions;

    console.log( '9dsafadssssssssssssss', this.assignedQuestions );

    AssignedQuestionItem.make_option_sets( this.assignedQuestions, quiz.answer_options_type );


    this.initializatin.next( quiz );

  }

  addMoreQuestion(): MatDialogRef<AddAssignedQuestionComponent>{

    // alert( this.form_value.answer_options_type );
    return  this.dialog.open( AddAssignedQuestionComponent,  {
      width: '1200px',
      minHeight: '90vh',
      disableClose: false,
      data: {
        optType      :   this.form_value.answer_options_type,
        quizId       :   this.quiz_id,
        assignedIds  :   this.assignedQuestions.map( item => item.question_id )
      },
    });
  }

  ngAfterViewInit(): void {
    this.initialized = false;
    this.isBusy = true;

    merge( this.quiz.onQuestionAssigned(), this.quizId( ) ).pipe(
      map( data => this.isEditing = true ),
      switchMap( ( data ) => {
        this.initialized = false;
        return this.quiz.single( this.quiz_id, { _assigned_questions: 'true' } );
      }),
      map( result => {
        console.log( 'assignedQuestions', result.data.questions );
        return result.data;
      })
    ).subscribe( data => this.setEditPage( data ) );

    if ( !this.quiz_id ) {
      this.initializatin.next();
    }
  }
}
