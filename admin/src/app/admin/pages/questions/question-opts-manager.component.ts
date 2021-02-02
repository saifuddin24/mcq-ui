import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategorySelector} from '../category/category-selector.component';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppService} from '../../../services/app.service';
import {ConfirmDialogComponent, DialogOptions} from '../../../components/confirm-dialog/confirm-dialog.component';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {MatDialogRef} from '@angular/material/dialog';
import {CategoryUpdate} from '../../../services/category.service';
import {QuestionMeta} from '../../../services/questions.service';
import {AssignedQuestionItem} from '../quest-assigned-list/quest-assigned-list.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'question-opts-generator',
  templateUrl: './question-opts-manager.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionOptsManagerComponent implements OnInit, AfterViewInit {

  constructor( private app: AppService) { }


  // tslint:disable-next-line:variable-name
  public form_value = {
    options: {},
    answer: '',
    title: '',
  };

  rightAnswer: string = '';

  @Input('given-answer') givenAanswer: string = '';

  @Input() outputFormat = [ ];

  // tslint:disable-next-line:no-input-rename
  @Input('qogModel')
  qog = new QuestionOptionGenerator();

  // tslint:disable-next-line:no-output-rename
  @Output( 'qogModelChange')
  qogChang: EventEmitter<QuestionOptionGenerator> = new EventEmitter<QuestionOptionGenerator>();

  // tslint:disable-next-line:variable-name
  // @ts-ignore
  // tslint:disable-next-line:variable-name
  question_option_types: QuestionOptionType[] = ANSWER_OPTIONS_TYPES;

  // tslint:disable-next-line:variable-name
  question_option_set: QuestionOptionSet[] = [ this.defaultOptionsSet() ];

  // tslint:disable-next-line:typedef variable-name
  selectedOptType( opt_set_index: number = 0 ): QuestionOptionType{
    return this.question_option_set[ opt_set_index ]?.selected_option_type;
  }

  // tslint:disable-next-line:typedef
  notifyChanged(): void {

    this.qog.answer_option_sets = this.question_option_set;
    // tslint:disable-next-line:variable-name
    this.qog.options_sets = this.question_option_set.map( ( opt_set: QuestionOptionSet ) => {
      return {
        meta_id: opt_set.meta_id,
        // tslint:disable-next-line:label-position no-unused-expression
        meta_name : opt_set.option_tag,
        // tslint:disable-next-line:label-position
        option_string: JSON.stringify({
          // @ts-ignore
          options: opt_set.question_options.map( ( item: QuestionOption, i ) =>  {
            return  {
              opt: opt_set.selected_option_type?.option_labels[i],
              value: item.option_value
            };
          }),
          right_answer:  opt_set.right_answer
        })
      };
    });


    // this.option_sets = result;
    //
    console.log( this.question_option_set  );

  }

  // tslint:disable-next-line:variable-name
  updateSelectedOptType( opt_index ): void{

    const type = this.question_option_set[ opt_index ].opt_type;
    console.log( type  );
    // tslint:disable-next-line:variable-name
    const opt_type = this.question_option_types.filter( item => { if ( item.type === type) { return type; } });

    // tslint:disable-next-line:no-unused-expression
    this.question_option_set[ opt_index ].selected_option_type = opt_type[0];
    this.notifyChanged();
  }

  // tslint:disable-next-line:variable-name
  optionLimitReached( opt_index: number): boolean{
    const optType = this.question_option_set[opt_index]?.selected_option_type;
    return optType && this.question_option_set[opt_index].question_options.length >= optType.option_labels.length;
  }

  optionsHasDuplicate( opts: QuestionOption[] ): boolean{
    for ( let i = 0; i < opts.length; i++ ) {
      if ( opts[i].option_value.trim().length > 0 ){
        const r = opts.filter( ( opt, j ) => i !== j && opt.option_value === opts[i].option_value );
        if ( r.length > 0 ) {
          return true;
        }
      }
    }
    return false;
  }



  // tslint:disable-next-line:variable-name
  onOptInputChange( opt_index: number, quest_opt_in: number ): void{
    this.checkRightAnswer( opt_index, quest_opt_in );
    const opts = this.question_option_set[opt_index].question_options;
    const status: boolean = false;
    this.question_option_set[opt_index].has_duplicate = this.optionsHasDuplicate( opts );
    this.notifyChanged();
  }

  // tslint:disable-next-line:variable-name
  checkRightAnswer( opt_index: number, quest_opt_in: number ): void{
    const opts = this.question_option_set[opt_index].question_options;
    opts.map( item => {
      item.isRightAnswer = this.rightAnswer.trim().length > 0 && item.option_value === this.rightAnswer;
      if ( item.isRightAnswer ) {
        this.question_option_set[ opt_index ].right_answer = item.option_value;
      }
    });
  }

  // tslint:disable-next-line:variable-name
  makeRightAnswer( opt_index: number, quest_opt_in: number ): void{
    const opts = this.question_option_set[opt_index].question_options;
    opts.map( (item, i) => item.isRightAnswer = quest_opt_in === i );
    this.notifyChanged();
  }

  // tslint:disable-next-line:variable-name
  addMoreOption( opt_index: number ): void{
    const optType = this.question_option_set[opt_index].selected_option_type;

    this.optionLimitReached( opt_index ); {
      this.question_option_set[opt_index].question_options.push({
        isRightAnswer: false,
        option_label: optType.type,
        option_value: ''
      });
    }
    this.notifyChanged();
  }

  // tslint:disable-next-line:typedef
  defaultQuestOptions(){
    return [ {}, {}, {}, {} ].map( (opt: QuestionOption) => opt = {
      isRightAnswer: false,
      option_label: ANSWER_OPTIONS_TYPES[0].type,
      option_value: ''
    });
  }

  addMoreOptionSet( ): void{
    this.question_option_set.push({
      right_answer: '',
      has_duplicate: false,
      opt_type: ANSWER_OPTIONS_TYPES[0].type,
      option_tag: '',
      option_types: ANSWER_OPTIONS_TYPES,
      question_options: this.defaultQuestOptions(),
      selected_option_type: ANSWER_OPTIONS_TYPES[0]
    });

    this.notifyChanged();
  }

  onAnswerChange( ans ): void{
    console.log( 'onAnswerChange', ans );
    // tslint:disable-next-line:variable-name
    this.question_option_set.map( ( opt_set, opt_in ) => {
      // tslint:disable-next-line:variable-name
      opt_set.question_options.map( (quest_opt, q_opt_in) => this.checkRightAnswer( opt_in, q_opt_in ) );
    });
    this.notifyChanged();
  }

  ond(): Observable<string>{
    const a: Subject<string> = new Subject<string>();
    a.next( 'd' );
    return  a.asObservable();
  }

  // tslint:disable-next-line:variable-name
  removeQuestionOption( opt_index, q_opt_in ): void{

    const opts: QuestionOption[] = this.question_option_set[ opt_index ].question_options;
    const rm = (): void => {
      opts.splice( q_opt_in, 1 );
      this.notifyChanged();
    }

    // tslint:disable-next-line:variable-name
    const opt_value = opts[q_opt_in].option_value.trim();

    if ( opt_value.length > 0){
      this.app.openConfirmDialog( {
        body: 'Are sure want to remove option?',
        onPositiveAction : ( dialogRef, option ) => { rm(); dialogRef.close( ); }
      });
    } else { rm(); }

  }


  // tslint:disable-next-line:variable-name
  removeOptionSet( opt_index ): void{
    const sets: QuestionOptionSet[] = this.question_option_set;

    if ( sets.length > 1 || opt_index > 1 ) {

      const rm = (): void   => {
        sets.splice( opt_index, 1 );
        this.notifyChanged();
      }

      this.app.openConfirmDialog( {
        body: 'Are sure want to remove this option set, answer options will be removed also?',
        onPositiveAction : ( dialogRef, option ) => { rm(); dialogRef.close( ); }
      });

    }
  }

  defaultOptionsSet(): QuestionOptionSet{
    return {
      right_answer: '',
      is_hidden: true,
      has_duplicate: false,
      opt_type: ANSWER_OPTIONS_TYPES[0].type,
      option_tag: '',
      question_options: this.defaultQuestOptions(),
      selected_option_type: ANSWER_OPTIONS_TYPES[0],
      option_types: this.question_option_types,
    };
  }

  ngOnInit(): void {

    // this.qog.asnwerObserver.pipe(
    //   map( ans => this.rightAnswer = ans)
    // ).subscribe( answer => this.onAnswerChange( answer ) );

    if ( this.qog.answer_option_sets?.length > 0) {
      this.question_option_set = this.qog.answer_option_sets;
      this.question_option_set.map( set => {
          set.selected_option_type = this.question_option_types[0];
          set.has_duplicate = false;
          set.option_types = this.question_option_types;
      });

    }

    this.qog.optSetSubject.asObservable().subscribe( (questionOptionSet: QuestionOptionSet[]) => {
      this.question_option_set = questionOptionSet;
      this.notifyChanged();
    });

    this.notifyChanged();
  }

  ngAfterViewInit(): void {

  }
}

export class OptionSetsResult {
  // tslint:disable-next-line:variable-name
  meta_id?: string | number;
  // tslint:disable-next-line:variable-name
  meta_name: string;
  // tslint:disable-next-line:label-position variable-name
  option_string: string;
  // tslint:disable-next-line:variable-name
  static get_opt_string?( optResult: AnswerOptionSavingItem[], answer: string ): string{
    return JSON.stringify({options: optResult, right_answer: answer});
  }
}

export class QuestionOptionGenerator {
  answerSubject: Subject<string> = new Subject<string>();
  asnwerObserver: Observable<string> = this.answerSubject.asObservable();
  // tslint:disable-next-line:variable-name
  optSetSubject: Subject<QuestionOptionSet[]> = new Subject<QuestionOptionSet[]>();
  // tslint:disable-next-line:variable-name
  options_sets: OptionSetsResult[];
  // tslint:disable-next-line:variable-name
  answer_option_sets: QuestionOptionSet[];
  answer( ans: string): void {
    this.answerSubject.next( ans );
    console.log( 'OptionGEN', ans );
  }
  // tslint:disable-next-line:variable-name
  changeOptionSets( opt_sets: QuestionOptionSet[] ): void{
    this.optSetSubject.next( opt_sets );
  }
}

export class QuestionOptionType {
  type: string;
  // tslint:disable-next-line:variable-name
  type_label: string;
  // tslint:disable-next-line:variable-name
  option_labels: string[];
  static get( type: string): QuestionOptionType{
    return ANSWER_OPTIONS_TYPES.filter(opt => opt.type === type )[0];
  }
}

const outputFormat = [
  'option_tag', 'opt_type', '@question_options', [
    'option_label', 'option_value'
  ]
];

export class AnswerOptionSavingItem {
  opt: string;
  value: string;
}

export class QuestionOption {

  constructor( value = '', label = '', isRightAnswer = false ){
    this.option_label   = label;
    this.option_value   = value;
    this.isRightAnswer  = isRightAnswer;
  }
  // tslint:disable-next-line:variable-name
  option_value: string;
  // tslint:disable-next-line:variable-name
  option_label: string;
  isRightAnswer: boolean;
  static getArrayForSave(options: QuestionOption[]): AnswerOptionSavingItem[]{
    const resultItems: AnswerOptionSavingItem[] = [];
    options.map(option => resultItems.push({opt: option.option_label, value: option.option_value}));
    return resultItems;
  }

  static getStringForSave(options: QuestionOption[]): string{
    return JSON.stringify( this.getArrayForSave( options ) );
  }
}
/*
  right_answer:'',
  question_options: [],
  option_tag: '',
  is_hidden: false,
  opt_type: '',
*/



export class QuestionOptionSet {
  // tslint:disable-next-line:variable-name
  meta_id?: string | number;
  // tslint:disable-next-line:variable-name
  right_answer: string = '';
  // tslint:disable-next-line:variable-name
  is_hidden?: boolean = true;
  // tslint:disable-next-line:variable-name
  has_duplicate?: boolean = false;
  // tslint:disable-next-line:variable-name
  option_tag: string;
  // tslint:disable-next-line:variable-name
  selected_option_type?: QuestionOptionType;
  // tslint:disable-next-line:variable-name
  option_types?: QuestionOptionType[];
  // tslint:disable-next-line:variable-name
  question_options: QuestionOption[];
  // tslint:disable-next-line:variable-name
  opt_type: string;

  // tslint:disable-next-line:variable-name
  public static emptyOptData( opt_type?: string ): QuestionOptionSet{
    const nData = new QuestionOptionSet( );

    const currentOptType = opt_type ? QuestionOptionType.get( opt_type ) : ANSWER_OPTIONS_TYPES[0];

    const optSet: QuestionOption[] = [];
    nData.question_options = optSet;
    [0, 1, 2, 3].map(index => optSet.push({
      option_value: '',
      option_label: currentOptType.option_labels[index],
      isRightAnswer: false
    }));

    nData.right_answer = '';
    nData.is_hidden = false;
    nData.meta_id = 0;
    nData.selected_option_type = currentOptType;
    nData.opt_type = currentOptType.type;
    nData.option_tag = '';
    return nData;
  }

  // tslint:disable-next-line:variable-name
  public static setAllIfNull( items: QuestionOptionSet[], opt_type?: string ): void{
    items.map( item => this.setIfNull( item, opt_type ) );
  }

  // tslint:disable-next-line:variable-name
  public static setIfNull( data: QuestionOptionSet, opt_type?: string ): void{
    if ( data === null || !data ) {
      data = this.emptyOptData( opt_type );
    }
  }

  // tslint:disable-next-line:typedef
  static getList?(data: QuestionMeta[]) {

    const result: QuestionOptionSet [] = [];

    data.map( (questionMeta: QuestionMeta) => {
      let opts = {options: [], right_answer: '' };

      try { opts = JSON.parse( questionMeta.meta_value ); } catch ( e ) { opts = {options: [], right_answer: '' }; }

      if ( opts?.options ) {
        // tslint:disable-next-line:variable-name
        let q_opts = opts.options.map(item => {
          return {
            // tslint:disable-next-line:label-position
            option_label: item.opt,
            // tslint:disable-next-line:variable-name label-position
            option_value: item.value,
            // tslint:disable-next-line:label-position
            isRightAnswer: item.value.trim().length > 0 && item.value === opts.right_answer
          };
        });

        result.push({
          meta_id: questionMeta.id,
          right_answer: opts?.right_answer,
          question_options: q_opts,
          option_tag: questionMeta.meta_name,
          is_hidden: false,
          opt_type: opts.options[0]?.opt,
          selected_option_type: QuestionOptionType.get( opts.options[0]?.opt ) || ANSWER_OPTIONS_TYPES[0],
          option_types: ANSWER_OPTIONS_TYPES
        });
      }
    });
    return result;
  }
}

export const ANSWER_OPTIONS_TYPES: QuestionOptionType[] = [
  {
    type: 'ক',
    type_label: 'ক, খ, গ, ঘ...',
    option_labels: [ 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ' ]
  },
  {
    type: '1',
    type_label: '1, 2, 3, 4...',
    option_labels: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
  },
  {
    type: 'A',
    type_label: 'A, B, C, D...',
    option_labels: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ]
  },
  {
    type: 'i',
    type_label: 'i, ii, iii, iv...',
    option_labels: [ 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x' ]
  },
];
