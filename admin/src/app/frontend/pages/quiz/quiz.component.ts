import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from "@angular/router";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styles: [
  ]
})
export class QuizComponent implements OnInit {

  constructor(private route: ActivatedRoute ) { }

  subject_id:any = '66';
  id:any = '55';

  ngOnInit(): void {
    console.log( this.route );
    this.route.queryParams.subscribe( params => {
      this.subject_id = params['subject_id'];
      this.id = params['id'];
    });
  }

}
