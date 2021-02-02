import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {CategorySelector, CategorySelectorComponent, SearchModel} from '../category/category-selector.component';
import {CategorySelector} from '../category/category-selector.component';
import {merge, Observable, Subject} from 'rxjs';
import {Category, CategoryUdpateInput} from '../../../services/category.service';
import {OptionSetsResult, QuestionOption, QuestionOptionGenerator, QuestionOptionSet} from './question-opts-manager.component';
import {Question, QuestionInputs, QuestionMeta, QuestionsService, QuestionUpdate} from '../../../services/questions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, switchMap} from 'rxjs/operators';
import {DataService} from '../../../services/data.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'question-save-page',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsSaveComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    private quest: QuestionsService,
    private router: Router,
    private dataService: DataService<Question>
  ) { }

  // tslint:disable-next-line:variable-name
  private _selectedCatIds: (number | string )[] = [];

  questSubject: CategorySelector = new CategorySelector( );

  questOptGenerator: QuestionOptionGenerator = new QuestionOptionGenerator();

  optSet: OptionSetsResult[] = [];

  initialized: boolean = false;
  isBusy: boolean = true;
  initializatin: Subject<object> = new Subject<object>();
  initializatin$: Observable<object> = this.initializatin.asObservable();
  isEditing: boolean = false;

  // tslint:disable-next-line:variable-name
  form_value: QuestionInputs = {
    title : '',
    answer: '',
    description: '',
    option_sets: this.optSet,
    categories: []
  };

  message: string = null;

  // tslint:disable-next-line:variable-name
  private question_id = null;

  onChangeAnswer( e ): void{
    console.log( e.target.value );
    this.questOptGenerator.answer( e.target.value );
  }

  runForm(): void{
    this.form_value.option_sets = this.questOptGenerator.options_sets;

    console.log( 'form_value.option_sets', this.form_value.option_sets );

    this.form_value.categories = this.questSubject.selectedIds;
    this.isBusy = true;

    merge( this.quest.onAdded( ), this.quest.onEdited() )
      .subscribe( d => this.isBusy = false, e => this.isBusy = false );

    console.log(this.form_value);

    let action = this.quest.add( this.form_value );
    if ( this.isEditing && this.question_id ) {
      action = this.quest.edit( this.question_id, this.form_value );
    }

    action.subscribe( (update: QuestionUpdate) => {
      this.quest.setDataAction( update );
      if ( !this.isEditing ) {
        this.router.navigate(['/learn/questions/edit/' + update.data.id] );
      }
    },( response ) => {
      this.message = response.error.message;
      // console.log( [response.error, response.status] );
      this.isBusy = false;
    });

  }

  get valid_form(): boolean{
     return this.form_value.title.length > 0 && this.form_value.categories.length > 0;
  }

  ngOnInit(): void {
    this.dataService.setSelection();
    let opts = { options: [ ], right_answer: '' };
    try {
      opts = JSON.parse('{"options":[{"opt":"ক","value":""},{"opt":"খ","value":""},{"opt":"গ","value":""},{"opt":"ঘ","value":""}],"right_answer":""}');
    }catch ( e ){ }

    // tslint:disable-next-line:variable-name
    const q_opts = opts.options.map( item => {
      return {
        // tslint:disable-next-line:label-position
        option_label: item.opt,
        // tslint:disable-next-line:variable-name label-position
        option_value: item.value,
        // tslint:disable-next-line:label-position
        isRightAnswer: item.value.trim().length > 0 && item.value === opts.right_answer
      };
    });

    this.questOptGenerator.answer_option_sets = [{
      meta_id: 0,
      right_answer: opts.right_answer,
      question_options: q_opts,
      option_tag: '',
      is_hidden: false,
      opt_type: opts.options[0]?.opt,
    }];
  }

  questionId(): Observable<string | number>{
    return this.route.params.pipe(
      filter( param => param.question_id ),
      map( param => this.question_id = param.question_id )
    );
  }

  setEditPage( question: Question): void{
      this.isBusy = false;
      this.form_value.title = question.title;
      this.form_value.answer = question.answer;
      this.form_value.description = question.description;
      const meta_list: QuestionMeta[] = question.meta_list;
      this.questOptGenerator.changeOptionSets( QuestionOptionSet.getList( meta_list ) );
      this.initializatin.next( question );
  }


  ngAfterViewInit(): void {
    this.initialized = false;
    this.isBusy = true;

    this.initializatin$.subscribe( (question: Question) => {
      if ( question ) {
        this._selectedCatIds = question.category_ids;
      }

      this.questSubject.categoryLoaded.subscribe( () => {
        this.initialized = true;
        this.isBusy = false;
      });

      if ( !this.initialized ) {
        this.questSubject.load( this._selectedCatIds );
      }else {
        this.questSubject.setCategoryIds(  this._selectedCatIds );
      }

    });

    this.quest.onEdited( )
      .subscribe( (update: QuestionUpdate) => this.setEditPage( update.data) );

    this.questionId( ).pipe(
      map( data => this.isEditing = true ),
      switchMap( ( data ) => {
        this.initialized = false;
        return this.quest.single(this.question_id);
      }),
      map( result => result.data)
    ).subscribe( data => this.setEditPage( data ) );

    if ( !this.question_id ) {
      this.initializatin.next();
    }
  }

}
