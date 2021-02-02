import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QuizCoursesServices } from './quiz-courses.services';
import { FrontendModule } from './frontend/frontend.module';
import { FrontendRouterModule } from './frontend/frontend-router.module';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AdminRouterModule} from "./admin/admin-router.module";
import {AdminModule} from "./admin/admin.module";
import {BackendService} from "./common/backend.service";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppService} from "./services/app.service";
import {UidService} from "./services/uid.service";
import {UserService} from "./services/user.service";
import {CategoryService} from "./services/category.service";
import {DataService} from "./services/data.service";
import {DataListService} from "./services/data-list.service";
import {QuestionsService} from "./services/questions.service";
import {QuizService} from "./services/quiz.service";
import {SearchComponent} from "./components/search/search.component";
import {QuizListComponent} from "./admin/pages/quiz/quiz-list.component";
import {CategoryAdderComponent} from "./admin/pages/category/category-adder.component";
import {QuizComponent} from "./admin/pages/quiz/quiz.component";
import {SaveQuizComponent} from "./admin/pages/quiz/save-quiz.component";
import {CategorySelectorComponent} from "./admin/pages/category/category-selector.component";
import {PerformQuizComponent} from "./admin/pages/quiz/perform-quiz.component";
import {QuestionsListComponent} from "./admin/pages/questions/questions-list.component";
import {QuestionsSaveComponent} from "./admin/pages/questions/questions-save.component";
import {QuestionsQListComponent} from "./admin/pages/questions/questions-q-list.component";
import {QuestAssignedListComponent} from "./admin/pages/quest-assigned-list/quest-assigned-list.component";
import {
  AddAssignedQuestionComponent,
  AssignedQuestionAddNewComponent, AssignedQuestionItemComponent
} from "./admin/pages/quest-assigned-list/add-assigned-question.component";
import {AnswerOptionsEditorComponent} from "./admin/pages/questions/answer-options-editor.component";
import {QuestionOptsManagerComponent} from "./admin/pages/questions/question-opts-manager.component";
import {CategoryComponent} from "./admin/pages/category/category.component";
import {CategoryQuickEditorComponent} from "./admin/pages/category/category-quick-editor.component";
import {APP_BASE_HREF} from "@angular/common";

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent, CategoryAdderComponent, SearchComponent, AssignedQuestionAddNewComponent,
    QuestAssignedListComponent, QuestionOptsManagerComponent, CategoryComponent, CategoryQuickEditorComponent,
    QuestionsListComponent, QuestionsSaveComponent, QuestionsQListComponent, AnswerOptionsEditorComponent,
    QuizComponent , QuizListComponent, SaveQuizComponent, CategorySelectorComponent, PerformQuizComponent,
    AddAssignedQuestionComponent, AssignedQuestionItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AdminRouterModule,
    MaterialModule,
    // AdminModule,
    FrontendModule,
    FrontendRouterModule,
    HttpClientModule,
  ],
  providers: [
    AppService, CategoryService,
    DataService, DataListService, QuestionsService, QuizService, UidService,
    QuizCoursesServices, BackendService, CategoryService,
    QuestAssignedListComponent, AssignedQuestionAddNewComponent, AddAssignedQuestionComponent,
    UserService,
    { provide: APP_BASE_HREF, useValue: window[ 'base_path' ] || '' }
  ],
  bootstrap: [ AppComponent]
})

export class AppModule { }
