import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FrontendModuleComponent} from "./frontend-module.component";
import {RouterModule} from "@angular/router";
import {QuizPageInitComponent} from "./pages/quiz/quiz-page-init.component";


@NgModule({
  declarations: [ FrontendModuleComponent, QuizPageInitComponent ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class FrontendModule { }
