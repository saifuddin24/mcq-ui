import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { QuizDataSource, QuizItem } from './quiz-datasource';
import {BackendService} from "../../../common/backend.service";
import {merge, Observable, of as observableOf} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  // template: `<div>FDDDDF</div>`,
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<QuizItem>;
  dataSource: QuizDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    console.log( '....................OK');
    //this.dataSource = new QuizDataSource();

  }

  constructor(private backend:BackendService ){}

  ngAfterViewInit() {

    this.sort.sortChange.subscribe((data) => {
      this.paginator.pageIndex = 0
    });

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({r:778}),

        switchMap(() => {
          console.log( this.sort.active, this.sort.direction, this.paginator.pageIndex);
          var quiz:Observable<any> = this.backend.getAdminQuizzes( );
          return quiz;
        }),

        //
        // map(data => {
        //   return [{abcd:488}];
        // }),
        //
        //
        // catchError(() => {
        //   // this.isLoadingResults = false;
        //   // // Catch if the GitHub API has reached its rate limit. Return empty data.
        //   // this.isRateLimitReached = true;
        //   return observableOf([{abcd:404}]);
        // })

      ).subscribe(result => {

        this.dataSource.data = result;
        this.dataSource.connect( ).subscribe( );
        console.log( "TESTING: ",result );

      });




    // // this.dataSource.data = [{id:5, title:"HJHUHu"}]
    //
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.table.dataSource = this.dataSource;
    //
    // var quiz:Observable<any> = this.backend.getAdminQuizzes();
    //
    //
    //
    // quiz.subscribe((data) => {
    //   this.dataSource.data = data;
    //
    //   console.log( "Quiz Data: ", data );
    //
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    //   this.table.dataSource = this.dataSource               ;
    //   this.dataSource.connect( ).subscribe( );
    //
    // }, error => {
    //   console.log( "Quiz Data error: ", error );
    // }, ( ) => console.log( "!---COMPLETED---!" )  )
    //
    // console.log( "QQQ", quiz );

  }
}
