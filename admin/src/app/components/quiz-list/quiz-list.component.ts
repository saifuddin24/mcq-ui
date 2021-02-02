import {Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {switchMap} from "rxjs/operators";


@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit, OnChanges {

  public quiz_subject:any = "";

  constructor(private route:ActivatedRoute) {

    this.quiz_subject = this.route.snapshot.paramMap.get('subject');
  }

  ngOnInit(): void {

    //this.route.paramMap.pipe( switchMap(( params: ParamMap ) =>  this.quiz_subject = params.get( 'subject' ) ) );
    //console.log(params);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.quiz_subject = this.route.snapshot.paramMap.get('subject');
  }

}
