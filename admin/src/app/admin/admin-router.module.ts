import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { AdminModuleComponent } from "./admin-module.component";
import {DashboardComponent} from "./pages/dashboard.component";
import {AdminNotFoundComponent} from "./pages/admin-not-found/admin-not-found.component";
import {LoginComponent} from "./pages/login/login.component";
import {QuizListComponent} from "./pages/quiz/quiz-list.component";
import {QuestionsListComponent} from "./pages/questions/questions-list.component";
import {SaveQuizComponent} from "./pages/quiz/save-quiz.component";
import {QuestionsSaveComponent} from "./pages/questions/questions-save.component";
import {PerformQuizComponent} from "./pages/quiz/perform-quiz.component";
import {CategoryComponent} from "./pages/category/category.component";



const routes: Routes = [
  {
    path: 'admin/login', component: LoginComponent,
  },
  {
    path: 'admin', component: AdminModuleComponent,
    children:[
      {
        path: '', component: DashboardComponent, data: { pageTitle: "Dashboard" }
      },
      { path: 'quizzes', redirectTo: 'quizzes/list', pathMatch: 'full'},
      {
        path: 'quizzes/list', component: QuizListComponent,  data: { pageTitle: "Quiz List" }
      },
      {
        path: 'quizzes/add', component: SaveQuizComponent,  data: { pageTitle: "Add Quiz" }
      },
      {
        path: 'quizzes/questions', component: QuestionsListComponent,  data: { pageTitle: "Question List" }
      },
      // {
      //   path: 'categories', component: AdminCategoryComponent,  data: { pageTitle: "Categories" }
      // },
      // {
      //   path: 'categories/ttt', component: AdminCategoryComponent,  data: { pageTitle: "Tbl" }
      // },
      // { path: 'category', redirectTo: 'category/list', pathMatch: 'full'},
      {
        path: 'quizzes', component: QuizListComponent, data: { pageTitle: "Quiz List" },
      },
      {
        path: 'quizzes/add', component: SaveQuizComponent, data: { pageTitle: "Add Quiz"},
      },
      {
        path: 'quizzes/edit/:quiz_id', component: SaveQuizComponent,
      },
      {
        path: 'subject/:type', component: CategoryComponent, data:  {pageTitle: "Category"},
      },
      {
        path: 'questions', component: QuestionsListComponent, data: {pageTitle: "Question List"},
      },
      {
        path: 'questions/add', component: QuestionsSaveComponent, data: { pageTitle: "Add Question" },
      },
      {
        path: 'questions/edit/:question_id', component: QuestionsSaveComponent,
      },
      {
        path: 'perform-quiz-test/:quiz_id', component: PerformQuizComponent,
      },

      {
        path: '**', component: AdminNotFoundComponent, data: { pageTitle: "Page not found!" }
      },
    ]
  }
];

@NgModule({
  imports:  [ RouterModule.forRoot( routes ) ],
  exports : [ RouterModule ]
})
export class AdminRouterModule { }
