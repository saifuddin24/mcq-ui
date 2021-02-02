import {AfterContentInit, Component, ContentChild, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {observable, Observable} from 'rxjs';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {async} from '@angular/core/testing';
import {ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {Global} from "../../common/Global";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {AppResponse, AppService} from "../services/app.service";
import {UserData} from "../services/user.service";

@Component({
  templateUrl: './admin-module.component.html',
  styleUrls: ['admin-module.component.scss']
})

export class AdminModuleComponent implements OnInit, OnChanges, AfterContentInit {

  pageTitle =  Global.pageTitle;
  toolbarHeight: any = 45;
  authenticated: boolean = false;
  userData:UserData = null;

  isHandset$: Observable<boolean> = this.breakPointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches ),
      shareReplay()
    );

  constructor(
    private breakPointObserver: BreakpointObserver,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private app: AppService
  ) {

    app.loaded().subscribe((data: AppResponse) => {
      if( data.is_admin && data.authenticated ) {
        this.authenticated = true;
        this.userData = data.user;
      } else {
        this.router.navigate(['/admin/login'] );
      }
    }, error => {
      console.log( 'APP DATA ERROR: ', error );
    })

    setTimeout( ()=> {
      //this.authenticated = true;
    }, 1500)

    this.pageTitle = Global.pageTitle;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute ),
        map(route => route.firstChild ),
        switchMap(route => route.data ),
        map(data => {
          this.pageTitle = data.pageTitle || "Dashboard";
        })
      ).subscribe(data=> {
        console.log( data );
    });

  }

  ngOnInit(): void {
    // console.log( this.activatedRoute );
    //console.log( this );

  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log( "Change", changes);
  }



  ngAfterContentInit(): void {
    //console.log( "After Content" );
    this.app.loadAppData();
  }


}
