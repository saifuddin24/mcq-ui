import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategorySelector} from '../category/category-selector.component';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppService} from '../../../services/app.service';
import {QuestionMeta} from '../../../services/questions.service';
import {
  ANSWER_OPTIONS_TYPES,
  QuestionOption,
  QuestionOptionGenerator,
  QuestionOptionSet,
  QuestionOptionType
} from './question-opts-manager.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AssignedQuestionItem} from '../quest-assigned-list/quest-assigned-list.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'answer-options-editor',
  templateUrl: './answer-options-editor.component.html',
  // template: './answer-options-editor.component.html',
  styleUrls: ['./questions.component.css']
})
export class AnswerOptionsEditorComponent implements OnInit, AfterViewInit {

  constructor( private app: AppService) { }

  // tslint:disable-next-line:no-input-rename

  // tslint:disable-next-line:variable-name
  @Input( 'option-types' ) opt_types: QuestionOptionType[] = ANSWER_OPTIONS_TYPES;

  // tslint:disable-next-line:variable-name
  @Input( 'option-type' ) opt_type: string = 'A';

  // tslint:disable-next-line:variable-name
  right_answer: string = '';
  // tslint:disable-next-line:variable-name
  @Output( 'answerChange' ) right_answerChange: EventEmitter<QuestionOption[]> = new EventEmitter<QuestionOption[]>();

  @Input('option-hidden') optionHidden: boolean = false

  // tslint:disable-next-line:no-input-rename
  @Input( 'options-data' )
  // tslint:disable-next-line:variable-name
  options_data: QuestionOptionSet = new QuestionOptionSet();

  @Output( 'options-dataChange' )
  optionChange: EventEmitter<QuestionOptionSet> = new EventEmitter<QuestionOptionSet>();

  // tslint:disable-next-line:variable-name
  question_options: QuestionOption[];

  @Output() change: EventEmitter<object> = new EventEmitter<object>();

  @Output() init: EventEmitter<object> = new EventEmitter<object>();

  get has_duplicate(): boolean {
    const watcher = [];
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.opt_values.length; i ++ ){
        if (  watcher.indexOf( this.opt_values[i] ) > -1 ) { this.options_data.has_duplicate = true; return true; }
        if ( this.opt_values[i].trim().length > 0 ) { watcher.push( this.opt_values[i] ); }
    }
    this.options_data.has_duplicate = false;
    return false;
  }

  private get opt_values(): string[ ]{
    return this.question_options.map( item => item.option_value );
  }

  get option_type_labels(): string[] {
    // tslint:disable-next-line:variable-name
    const option_type = this.opt_types.filter( item => this.opt_type === item.type )[0] || this.opt_types[0];
    // tslint:disable-next-line:variable-name
    const opt_labels =  option_type.option_labels;
    this.options_data.question_options.map( (item, i) => item.option_label = opt_labels[i] );
    return opt_labels;
  }

  @Input( 'given-answer' )
  // tslint:disable-next-line:variable-name
  given_answer: string;

  ngAfterViewInit(): void {
    this.init.emit( this.options_data );
  }

  ngOnInit(): void {
    this.question_options = this.options_data.question_options;
    // this.given_answer = this.options_data.right_answer;
  }

  notifyChanged( ): void{
    console.log( 'this.given_answer', this.given_answer );

    this.question_options.map( (item, i) => {
      item.isRightAnswer =  item.option_value.trim().length > 0 && item.option_value ===  this.options_data.right_answer;
    });

    console.log( 'RR', this.question_options );
    this.change.emit( );
  }

  onOptInputChange( index ): void{
    console.log( 'GIVEN ANSWER: ', this.given_answer );
    // if ( this.options_data.right_answer.trim().length === 0 ) {
    this.question_options.map( (item, i) => {
      item.isRightAnswer =  item.option_value.trim().length > 0 && item.option_value ===  this.given_answer;
    });
    this.options_data.right_answer = this.given_answer;
    // }
    this.notifyChanged();
  }

  removeQuestionOption( inedx ): void{
    const option = this.question_options[inedx];
    const rm = (): void => {
      this.question_options.splice( inedx, 1 );
      this.notifyChanged();
    }

    // tslint:disable-next-line:variable-name
    const opt_value = option.option_value.trim();

    if ( opt_value.length > 0){
      this.app.openConfirmDialog( {
        body: 'Are sure want to remove option?',
        onPositiveAction : ( dialogRef ) => { rm( ); dialogRef.close( ); }
      });
    } else { rm(); }

  }

  makeRightAnswer( event: HTMLInputElement, options: QuestionOption ): void{
    this.options_data.right_answer = ( event.checked ) ? options.option_value : '';
    this.notifyChanged( );
  }

  repositionOptionItem( event: CdkDragDrop<QuestionOptionSet[]> ): void {
    moveItemInArray(this.options_data.question_options, event.previousIndex, event.currentIndex);
  }
}

