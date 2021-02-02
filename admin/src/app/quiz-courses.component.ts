import {Component, OnInit} from '@angular/core';
import {QuizCoursesServices} from "./quiz-courses.services";
import {QuizCourse} from "../models/QuizCourse";

@Component({
  selector:'quiz-courses',
  template: `
        <h2>{{title}}</h2>
        <ul>
            <li *ngFor="let course of courses">
                <a [routerLink]="[ '/quiz-list/', course.id ]" routerLinkActive="active" >{{course.title}}</a> 
            </li>
        </ul>

        
  `
})
export class QuizCoursesComponent implements OnInit{
  public title = "List of quiz courses";
  public courses:QuizCourse[ ];

  constructor( private services: QuizCoursesServices ){ }

  ngOnInit(): void {
    this.courses = this.services.getCources();
  }

}
