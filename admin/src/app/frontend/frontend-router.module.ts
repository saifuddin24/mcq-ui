import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { FrontendModuleComponent } from "./frontend-module.component";

// import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {LandingComponent} from "./pages/landing/landing.component";
import {SubjectComponent} from "./pages/subject/subject.component";
import {QuizComponent} from "./pages/quiz/quiz.component";
import {SinglePageComponent} from "./pages/single-page/single-page.component";
import {QuizPageInitComponent} from "./pages/quiz/quiz-page-init.component";
// import {QuizComponent} from "./pages/quiz/quiz.component";



const routes: Routes = [{
  path: '', component: FrontendModuleComponent,
  children:[
    {
      path: '', component: LandingComponent,
    },
    {
      path : 'subjects', component: SubjectComponent
    },
    {
      path: 'quiz', component: QuizPageInitComponent,
      children: [
        {
          path: 'subjects', component: QuizComponent,
        },
        {
          path: 'list', component: QuizComponent,
        },
        {
          path: 'list/:subject_id', component: QuizComponent,
        },
        {
          path: 'single/:id', component: QuizComponent,
        }
      ]
    },
    {
      path: 'pages', component: SinglePageComponent,
      children: [
        {
          path: ':slug', component: SinglePageComponent,
        }
      ]
    },
    // {
    //   path: '**', component:NotFoundComponent
    // }
  ],
}];

@NgModule({
  imports:  [ RouterModule.forRoot( routes ) ],
  exports : [ RouterModule ]
})
export class FrontendRouterModule { }
