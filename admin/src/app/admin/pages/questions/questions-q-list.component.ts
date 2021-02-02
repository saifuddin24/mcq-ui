import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {CategorySelector, CategorySelectorComponent, SearchModel} from '../category/category-selector.component';
import {CategorySelector} from '../category/category-selector.component';
import {Observable} from 'rxjs';
import {Category} from '../../../services/category.service';
import {OptionSetsResult, QuestionOption, QuestionOptionGenerator} from './question-opts-manager.component';
import {Question, QuestionInputs, QuestionsService, QuestionUpdate} from '../../../services/questions.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'question-list-page',
  template: `<div></div>`,
  styleUrls: ['./questions.component.css']
})
export class QuestionsQListComponent implements OnInit, AfterViewInit {

  constructor(
    private quest: QuestionsService
  ) { }

  // tslint:disable-next-line:variable-name
  private _selectedCatIds = [];
  get selectedCatIds( ): number[]{
    return this._selectedCatIds;
  }

  questSubject: CategorySelector = new CategorySelector( );

  questOptGenerator: QuestionOptionGenerator = new QuestionOptionGenerator();

  resultModel: object = {};

  optSet: OptionSetsResult[] = [];

  // tslint:disable-next-line:variable-name
  form_value: QuestionInputs = {
    title : 'বাংলাদেশের কোন জেলায় সবচেয়ে বেশি বৃষ্টিপাত হয়',
    answer: 'সিলেট',
    description: 'সিলেট',
    option_sets: this.optSet,
    categories: []
  };

  onChangeAnswer( e ): void{
    console.log( e.target.value );
    this.questOptGenerator.answer( e.target.value );
  }

  runForm(): void{
    this.form_value.option_sets = this.questOptGenerator.options_sets;
    this.form_value.categories = this.selectedCatIds;
    this.quest.onAdded().subscribe( d => console.log( d ) );

    console.log( this.selectedCatIds, this.form_value );

    this.quest.add( this.form_value ).subscribe( (data: QuestionUpdate) => {
      this.quest.setDataAction( data );
    });
  }

  ngOnInit(): void {
    let opts = { options: [ ], right_answer: '' };

    try {
      opts = JSON.parse('{"options":[{"opt":"A","value":"রাজশাহী"},{"opt":"B","value":"চট্টগ্রাম"},{"opt":"C","value":"সিলেট"},{"opt":"D","value":""}],"right_answer":"সিলেট"}');
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
      right_answer: opts.right_answer,
      question_options: q_opts,
      option_tag: '',
      is_hidden: false,
      opt_type: opts.options[0]?.opt,
    }];
  }

  ngAfterViewInit(): void {

    // this.questSubject.itemsSelected.subscribe(categories => {
    //   this._selectedCatIds = [];
    //
    //   categories.map( item => this._selectedCatIds.push( Number( item.id ) ) );
    //
    //   console.log( 'SelectedInQuestions--', categories );
    // });
  }

}
