import {HttpClient, HttpHandler, HttpHeaders, HttpParams} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, Inject, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent, DialogOptions} from '../../../components/confirm-dialog/confirm-dialog.component';
import {DataListService} from '../../../services/data-list.service';
import {
  AssignQuestionResponse,
  Question,
  QuestionDataApi,
  QuestionMeta,
  QuestionQueryInput,
  QuestionsService,
  QuestionUpdate
} from '../../../services/questions.service';
import {AssignedAnswerOption, AssignedQuestionItem, QuizAssignedApi} from './quest-assigned-list.component';
import {merge, Observable, Subject} from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CategorySelector} from '../category/category-selector.component';
import {
  ANSWER_OPTIONS_TYPES, OptionSetsResult,
  QuestionOption,
  QuestionOptionGenerator,
  QuestionOptionSet,
  QuestionOptionType
} from '../questions/question-opts-manager.component';
import {QuizService} from '../../../services/quiz.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'save-content',
  templateUrl: './add-assigned-question.component.html',
  styles: [ ]
})
export class AddAssignedQuestionComponent implements  OnInit, AfterViewInit{

  constructor(
    private quiz: QuizService,
    private quest: QuestionsService,
    public listService: DataListService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public options: AssignedInput
  ) { }

  // tslint:disable-next-line:variable-name
  opt_type: string = 'A';
  // tslint:disable-next-line:variable-name
  opt_types: QuestionOptionType[] = ANSWER_OPTIONS_TYPES;

  question = this.listService.new<QuestionDataApi>('qlist' );
  assigned = this.listService.new<QuizAssignedApi>( 'qalist');
  // tslint:disable-next-line:variable-name
  add_form_open: boolean = false;

  // questionList: Question[] = [];
  questionList: AssignedQuestionItem[] = [];
  assignedList: AssignedQuestionItem[] = [];

  get activeOptType(): QuestionOptionType {
    const  types = this.opt_types.filter( item => item.type === this.options.optType );
    return  types[0] || this.opt_types[0];
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  ngOnInit(): void {
    this.question.hasTrashList = true;
    this.assigned.hasTrashList = false;
    console.log( 'this.assigned', this.options );

    this.quest.onAdded().subscribe(response => {
      const itemList = AssignedQuestionItem.setListFromQuestionList([response.data]);
      this.changeOptData( itemList[ 0 ] );

      // AssignedQuestionItem.make_option_set( d, response.data.answer, this.opt_type )
      this.assignedList.unshift( itemList[0] );

      // this.question.load();
    });

    this.question.response.subscribe( (api: QuestionDataApi) => {

      console.log( 'PPPP: quest: ', api );
      this.questionList = AssignedQuestionItem.setListFromQuestionList( api.data );
      // this.questionList = api.data;
    });

    this.assigned.response.subscribe( (api: QuizAssignedApi) => {
      console.log( 'PPPP: assigned: ', api );
      if ( api.data ){
        this.assignedList = api.data;
        AssignedQuestionItem.make_option_sets( this.assignedList, this.opt_type );
      }else { this.assignedList = []; }
    });

  }

  removeAssignedQuestion( assignedIndex ): void{
    transferArrayItem<AssignedQuestionItem>( this.assignedList, this.questionList, assignedIndex, 0);
  }

  changeOptData( assignedItem: AssignedQuestionItem  ): void{
    // tslint:disable-next-line:variable-name
    const opt_data: QuestionOptionSet = assignedItem.opt_data = new QuestionOptionSet();
    opt_data.question_options = [];

    const mList: QuestionMeta[] = assignedItem.meta_list;
    let qMeta: QuestionMeta;
    let data = {options: [], right_answer: ''};

    if ( mList.length > 0 ) {
      qMeta = mList[0];
      try {
        data = JSON.parse(qMeta.meta_value);
      } catch (e) {
        data = {options: [], right_answer: ''};
      }finally {
        data = !( data.options && data.right_answer )
          ? {options: [], right_answer: ''} : data;
      }
    }

    if ( data.options.length === 0 ) {
      [0, 1, 2, 3].map(index => data.options.push({opt: '', value: ''}));
    }

    data.options.map((item, ind) => {
      opt_data.question_options.push({
        isRightAnswer: data.right_answer === item.value,
        option_label: this.activeOptType.option_labels[ind],
        option_value: item.value
      });
    });
  }


  questionDrop(event: CdkDragDrop<AssignedQuestionItem[]>): void{

    if (event.previousContainer !== event.container) {

      this.changeOptData( event.previousContainer.data[event.previousIndex] );

      transferArrayItem(
        event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex
      );

    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  saveOptions( ): void{
    const savingData: AssignedAnswerInput = { quiz_id: this.options.quizId,
      questions: [], answer_options_sets: {}, question_answers: {}
    };

    this.assignedList.map( (item: AssignedQuestionItem) => {
      savingData.questions.push( item.question_id );
      savingData.answer_options_sets[ 'qid_' + item.question_id ]
        = QuestionOption.getArrayForSave(item.opt_data.question_options);
      savingData.question_answers[ 'qid_' + item.question_id ] = item.opt_data.right_answer;
    });

    console.log( 'savingData', savingData );
    this.quiz.assignQuestions( savingData ).subscribe( ( result: AssignQuestionResponse ) => {
      console.log( result );
    });
  }

  ngAfterViewInit(): void {

    const initQuestQuery: QuestionQueryInput = new QuestionQueryInput();
    // initQuestQuery.exclution = '';

    if ( this.options.assignedIds.length > 0 ) {
      initQuestQuery.exclution = this.options.assignedIds.join( ',' );
    }

    initQuestQuery.page_size = 100;

    this.question.initialize( 'admin/question/list' ).loadMainList( initQuestQuery );

    if ( Number( this.options.quizId ) > 0 ) {
      this.assigned.get( 'admin/quiz/' + this.options.quizId + '/questions' );
    }

  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'assigned-quest-add-new',
  template: `

      <div style="display: flex">
          <div class="spacer"></div>
          <button mat-stroked-button (click)="runForm()" [disabled]="!valid_form || isBusy">Add New Question</button>
      </div>
      <mat-form-field appearance="outline" color="primary" >
          <mat-label>Question Title</mat-label>
          <input matInput
                 placeholder="Type a question title"
                 [(ngModel)]="form_value.title"
                 (keyup.enter)="runForm()"
          >
          <mat-error align="end">msg</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput
                    placeholder="Type answer"
                    [(ngModel)]="form_value.description"
          ></textarea>
          <mat-error align="end">msg</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
          <mat-label>Answer</mat-label>
          <input matInput
                 placeholder="Type answer"
                 [(ngModel)]="form_value.answer"
                 (keyup.enter)="runForm()"
                 (keyup)="onChangeAnswer( $event )"
          >
          <mat-error align="end">msg</mat-error>
      </mat-form-field>

      <answer-options-editor
          [option-type]="optType"
          [given-answer]="form_value.answer"
          [(options-data)]="option_data"
          [option-hidden]="false" >
      </answer-options-editor>
      <div style="display: flex; justify-content: center; margin-bottom: 10px; margin-top: 5px">
          <button [disabled]="optOptionsLimitReached" mat-stroked-button (click)="addNewOption()">Add New Option</button>
      </div>

<!--      <question-opts-generator-->
<!--              [(qogModel)]="questOptGenerator"-->
<!--              [given-answer]="this.form_value.answer"-->
<!--      >-->
<!--      </question-opts-generator>-->

      <category-selector
              [(catModel)]="questSubject"
              style="display: flex; width: auto; border-style: solid"
              category-type="question-subject"
              adder-title="Add Subject"
              selector-title="Select Subject(s)"
              input-appearance="legacy"
              addr-btn-title="Add"
      >
      </category-selector>
      <div style="display: flex">
          <div class="spacer"></div>
          <button mat-stroked-button (click)="runForm()" [disabled]="!valid_form || isBusy">Add New Question</button>
      </div>
  `
})
export class AssignedQuestionAddNewComponent implements OnInit, AfterViewInit{
  constructor(
    private quest: QuestionsService
  ){}

  optSet: OptionSetsResult[] = [];
  // tslint:disable-next-line:variable-name
  form_value = {
    title: '',
    description: '',
    answer: '',
    option_sets: this.optSet,
    categories: []
  };
  isBusy: boolean = false;
  get valid_form(): boolean{
    return this.form_value.title.length > 0 && this.form_value.categories.length > 0;
  }
  // tslint:disable-next-line:variable-name
  option_data: QuestionOptionSet = new QuestionOptionSet();
  @Input('opt-type') optType: string = 'A';
  questSubject: CategorySelector = new CategorySelector();

  get activeOptType(): QuestionOptionType {
    return QuestionOptionType.get( this.optType ) || ANSWER_OPTIONS_TYPES[0];
  }

  // tslint:disable-next-line:typedef
  onChangeAnswer( ev ){

  }

  ngAfterViewInit(): void {
    this.questSubject.ids.subscribe( ids => this.form_value.categories = ids );
    this.questSubject.load();
  }

  get optOptionsLimitReached(): boolean{
    return this.option_data.question_options.length === this.activeOptType.option_labels.length;
  }

  addNewOption(): void{
    if ( !this.optOptionsLimitReached ) {
      this.option_data.question_options.push({
        option_value: '',
        option_label: this.activeOptType[ this.option_data.question_options.length ],
        isRightAnswer: false
      });
    }
  }

  ngOnInit(): void {

    const optSet: QuestionOption[] = [];
    this.option_data.question_options = optSet;
    [0, 1, 2, 3].map(index => optSet.push({
      option_value: '',
      option_label: this.activeOptType.option_labels[index],
      isRightAnswer: false
    }));

    // console.log('optSetType', optSet, this.activeOptType );

    this.option_data.right_answer = '';
    this.option_data.is_hidden = false;
    this.option_data.meta_id = 0;
    this.option_data.selected_option_type = this.activeOptType;
    this.option_data.opt_type = this.optType;
    this.option_data.option_tag = '';
  }

  setOptionSets(): void{
    const optString = QuestionOption.getArrayForSave( this.option_data.question_options );
    console.log( 'optString', this.option_data.question_options, optString );
    this.form_value.option_sets = [{
      meta_id: 0,
      meta_name: '',
      option_string: OptionSetsResult.get_opt_string( optString, this.option_data.right_answer )
    }];
  }

  // tslint:disable-next-line:typedef
  runForm() {
    this.setOptionSets();
    console.log(this.form_value);


    this.quest.onAdded().subscribe(d => {
      this.isBusy = false;
      this.form_value.title = '';
      this.form_value.answer = '';
      this.form_value.description = '';
    }, e => this.isBusy = false);

    console.log(this.form_value);

    this.quest.add(this.form_value).subscribe((update: QuestionUpdate) => this.quest.setDataAction(update));
  }
}

@Component({
  styles: [`:host { display: flex; flex-direction: column; width: 100%; padding: 20px 0;}`],
  // tslint:disable-next-line:component-selector
  selector: 'assigned-question-item',
  template: `
      <div style="display: flex; width: 100% ">
          <div class="spacer" style="padding-top: 8px">
            {{question.title}} {{question.assigned_id}}
          </div>

          <div>
            <button mat-button (click)="toggleOpts( )">Opts</button>
            <button mat-stroked-button color="warn" (click)="onRemoveClick( $event )">&times;</button>
          </div>
      </div>
      <div style="display: flex; flex-direction: column" *ngIf="opts_visible">
        <div style="display: flex; margin-bottom: 10px; align-items: center">
            <span>Answer:</span>
            <input [readonly]="!answerEditing"
                   style="outline: none; border: 1px solid green; padding:5px 8px; margin: 0 8px"
                   [style.border-color]="answerEditing ? 'green':'transparent'"
                   [style.color]="answerEditing ? 'green':'#555'"
                   class="spacer" type="text" [(ngModel)]="question.assigned_answer">
            <button (click)="answerEditing = !answerEditing">{{answerEditing ? 'Canecl':'Edit'}}</button>
        </div>

        <answer-options-editor
            [option-type]="opt_type.type"
            [given-answer]="question.assigned_answer"
            [options-data]="question.opt_data"
            [option-hidden]="false" >
        </answer-options-editor>
        <button mat-button (click)="addOption()" [disabled]="optionLimitReached">Add Option</button>
      </div>
  `
})
export class AssignedQuestionItemComponent implements OnInit, AfterViewInit{
  @Input( 'data' ) question: AssignedQuestionItem = new AssignedQuestionItem();
  // tslint:disable-next-line:variable-name
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line:variable-name

  // tslint:disable-next-line:variable-name
  @Input( 'opt-type' ) opt_type: QuestionOptionType = ANSWER_OPTIONS_TYPES[0];

  // tslint:disable-next-line:variable-name
  opts_visible: boolean = false;
  answerEditing: boolean = false;

  toggleOpts(): void{
    this.opts_visible = !this.opts_visible;
  }

  onRemoveClick( ev ): void{
    this.remove.emit( ev );
  }

  get optionLimitReached(): boolean{
    return  this.opt_type.option_labels.length === this.question.opt_data.question_options.length;
  }

  addOption( ): void{

    if ( !this.optionLimitReached ) {
      this.question.opt_data.question_options.push(
        new QuestionOption('', this.opt_type.option_labels[this.question.opt_data.question_options.length], false)
      );
    }
    console.log( this.question.opt_data.question_options );

  }

  ngAfterViewInit(): void { }

  ngOnInit(): void {
    this.question.assigned_answer =
      !this.question.assigned_answer && Number(this.question.assigned_answer ) !== 0
        ?  this.question.answer : this.question.assigned_answer;

    if ( !this.question.opt_data ) {
      QuestionOptionSet.setIfNull( this.question.opt_data );
    }

    if ( this.question.opt_data.question_options.length === 0 ) {
      this.question.opt_data = QuestionOptionSet.emptyOptData( this.opt_type.type );
    }
  }

}

export interface AssignedInput {
  quizId: string;
  assignedIds: (string|number)[];
  optType: string;
}


export interface AssignedAnswerInput {
  quiz_id: number | string;
  question_id?: number | string;
  questions?: (number | string) [];
  answer_options_sets?: object;
  question_answers?: object;
}
