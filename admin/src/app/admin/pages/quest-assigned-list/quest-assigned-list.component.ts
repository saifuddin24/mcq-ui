import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataListService} from '../../../services/data-list.service';
import {
  ANSWER_OPTIONS_TYPES,
  OptionSetsResult,
  QuestionOption,
  QuestionOptionSet,
  QuestionOptionType
} from '../questions/question-opts-manager.component';
import {Category, CategoryService} from '../../../services/category.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Config} from '../../../services/Config';
import {OptionType} from '@angular/cli/models/interface';
import {Question, QuestionMeta} from '../../../services/questions.service';
import {MatSelectChange} from '@angular/material/select';
import {AssignedAnswerInput} from './add-assigned-question.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'question-assigned-list',
  templateUrl: './quest-assigned-list.component.html',
  styleUrls: ['./quest-assigned-list.component.css']
})
export class QuestAssignedListComponent implements OnInit, AfterViewInit, AfterContentInit {

  constructor(
    public list: DataListService,
    public cat: CategoryService
  ) {  }

  @Input( 'assigned-list' ) assignedData: AssignedQuestionItem[ ] = [ ];

  @Output() output: EventEmitter<AssignedAnswerInput> = new EventEmitter<AssignedAnswerInput>();

  // tslint:disable-next-line:variable-name
  answer_option_types: QuestionOptionType[] = ANSWER_OPTIONS_TYPES;
  // tslint:disable-next-line:variable-name
  section_hidden: boolean[] = [];

  @Input() quizId = null;

  @Input( 'opt-type' )
  // tslint:disable-next-line:variable-name
  opt_type_label: string = 'i';

  @Output('opt-change') optChange: EventEmitter<QuestionOptionType> = new EventEmitter<QuestionOptionType>();

  backupItems: AssignedQuestionItem[ ] = [ ];

  // tslint:disable-next-line:variable-name
  get editor_hidden(): boolean[] {
    return this.assignedData.map( item => item.opt_data.is_hidden );
  }

  setOutput( ): void{
    console.log( 'this.assignedData' , this.assignedData);

    const savingData: AssignedAnswerInput = {
      quiz_id: this.quizId,
      questions: [], answer_options_sets: {}, question_answers: {}
    };

    this.assignedData.map( (item: AssignedQuestionItem) => {
      savingData.questions.push( item.question_id );
      savingData.answer_options_sets[ 'qid_' + item.question_id ]
        = QuestionOption.getArrayForSave(item.opt_data.question_options);
      savingData.question_answers[ 'qid_' + item.question_id ] = item.opt_data.right_answer;
    });

    this.output.emit( savingData );
  }

  // tslint:disable-next-line:variable-name
  private answer_is_readonly: boolean[] = [];

  // tslint:disable-next-line:typedef
  optChanged( change: MatSelectChange ){
    // tslint:disable-next-line:variable-name
    const opt_type = this.answer_option_types.filter( item => item.type === this.opt_type_label )[0];
    this.optChange.emit( opt_type );
  }

  // tslint:disable-next-line:variable-name
  answerIsReadonly( i ): boolean {
    return typeof this.answer_is_readonly[ i ] === 'boolean' ? this.answer_is_readonly[ i ]  : true;
  }

  // tslint:disable-next-line:variable-name
  toggleAnswerStatus( i ): void {
    if ( typeof this.answer_is_readonly[ i ] === 'boolean' ) {
      this.answer_is_readonly[ i ] = !this.answer_is_readonly[ i ];
    } else this.answer_is_readonly[ i ] = false;
  }

  cancelEditing( i ): void{
    console.log( this.backupItems[ i ] );
    this.assignedData[ i ] = this.backupItems[ i ];
  }

  // tslint:disable-next-line:variable-name
  backup_item( i ): AssignedQuestionItem {
    return this.assignedData[ i ];
  }


  ngOnInit(): void {
    // QuestionOptionSet.setAllIfNull( this.assignedData );

    this.assignedData.map( item => {
      QuestionOptionSet.setIfNull( item.opt_data );
    });

    this.section_hidden = this.assignedData.map( item => {
      return true;
    });

    this.setOutput();
  }


  ngAfterViewInit(): void {
    console.log( 'Backup ITEMS: ', this.backupItems );
    this.setOutput();
  }

  insertNewOption( index ): void{

  }

  ngAfterContentInit(): void {
    // this.backupItems = this.assignedData;
  }

  drop(event: CdkDragDrop<AssignedQuestionItem[]>): void {
    moveItemInArray(this.assignedData, event.previousIndex, event.currentIndex);
    this.setOutput();
  }

  setBackUp( i ): void{
    this.backupItems.push( this.assignedData[i] );
  }

  addNewQuestion( ): void{

  }

  addMoreOption( index ): void{
    if ( this.assignedData[index].opt_data.question_options.length < 10) {
    // tslint:disable-next-line:variable-name
      const opt_set = new QuestionOption( );
      opt_set.option_value = '';
      opt_set.isRightAnswer = false;
      opt_set.option_label = '';
      this.assignedData[index].opt_data.question_options.push( opt_set );
    }
    this.setOutput();
  }

}

export class QuizAssignedApi{
  data: AssignedQuestionItem[ ];
}

export class AssignedAnswerOption {
  opt: string;
  value: string;
}

export class AssignedQuestionItem {
  // tslint:disable-next-line:variable-name
  assigned_id: number | string;
  // tslint:disable-next-line:variable-name
  quiz_id: number | string;
  // tslint:disable-next-line:variable-name
  question_id: number | string;
  position: number | string;
  // tslint:disable-next-line:variable-name
  answer_options: AssignedAnswerOption[];
  // tslint:disable-next-line:variable-name
  category_names: string [];
  // tslint:disable-next-line:variable-name
  category_ids: (string | number) [];
  title: string;
  answer: string;
  // tslint:disable-next-line:variable-name
  assigned_answer: string;
  description: string;
  hidden: number | string;
  // tslint:disable-next-line:variable-name
  deleted_at: string;
  categories: Category[];
  // tslint:disable-next-line:variable-name
  opt_data: QuestionOptionSet;

  // tslint:disable-next-line:variable-name
  meta_list: QuestionMeta[] | null;



  public static setListFromQuestionList( list: Question[ ]): AssignedQuestionItem[]{
    const items: AssignedQuestionItem[] = [];
    list.map( item => {
      items.push({
        assigned_id: null, quiz_id: null,
        question_id: item.id, position: null,
        answer: item.answer, answer_options: [],
        assigned_answer: '', categories: item.categories,
        category_ids: item.category_ids, category_names: item.category_names,
        deleted_at: item.deleted_at, title: item.title,
        description: item.description, hidden: item.hidden, opt_data: null,
        meta_list: item.meta_list
      });
    })
    return items;
  }

  // tslint:disable-next-line:variable-name
  private static getOptTypeObject( opt_type: string ): QuestionOptionType{
    // tslint:disable-next-line:variable-name
    const option_type = ANSWER_OPTIONS_TYPES.filter( item => item.type_label === opt_type)[0] || ANSWER_OPTIONS_TYPES[0];
    return option_type;
  }

  // tslint:disable-next-line:typedef variable-name
  static make_option_sets( assignedQuestions: AssignedQuestionItem[], opt_type: string ){
    assignedQuestions.map( item => {
      item.opt_data = this.make_option_set( item.answer_options, item.assigned_answer, opt_type );
    });
    console.log( '9dsafadssssssssssssss==', assignedQuestions );
  }

  // tslint:disable-next-line:variable-name typedef
  static make_option_set( answer_option: AssignedAnswerOption[], right_answer: string, opt_type: string ): QuestionOptionSet {
    const optSet = new QuestionOptionSet();
    optSet.question_options = [];
    optSet.is_hidden = false;
    optSet.has_duplicate = false;
    optSet.right_answer = right_answer;
    // tslint:disable-next-line:variable-name
    const selected_option_type = this.getOptTypeObject( opt_type );
    // QuestionOptionType.get( opt_type );

    if ( !answer_option || answer_option.length === 0 ) {
      answer_option = [];
      [ 0, 1, 2, 3 ].map( i => {
        answer_option.push({ value: '', opt: selected_option_type[ i ] });
      });
    }

    answer_option.map( (item, ai) => {
      if ( item.opt && item.value ){
        optSet.question_options.push({
          option_value: item.value || '',
          option_label: item.opt || selected_option_type?.option_labels[ai],
          isRightAnswer: item.value.trim().length > 0 && item.value === right_answer
        });
      }
    });

    return  optSet;
  }

}
