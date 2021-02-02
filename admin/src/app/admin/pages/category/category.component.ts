import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService, DataTrashable} from '../../../services/data.service';
import {merge, Observable, of as observableOf, of, Subject} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Category, CategoryInputs, CategoryService, CategoryUpdate, CatType} from '../../../services/category.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AppService} from '../../../services/app.service';
import {SearchModel} from '../../../components/search/search.component';
import {AdderData, CategoryAdder} from './category-adder.component';
import {Config} from "../../../services/Config";

@Component({
  providers: [CategoryService],
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CategoryComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    public dataService: DataService<Category>,
    private catService: CategoryService,
    private appService: AppService
  ) { }

  get bundleIdsString( ): string{
    return this.dataService.bundleValues('id' );
  }

  adminBase( uri ) {
    return Config.adminBase( uri );
  }

  set listIsTree( condition: boolean ) {
    this._listIsTree = condition;
  }

  get listIsTree(): boolean {
    const items = this.catTypes.filter( item => { if ( item.catType === this._activeType.catType) { return item; }});
    return this._listIsTree === null ?  items[0].isTree : this._listIsTree;
  }

  set activeType( catType: CatType ) {
    this._activeType = catType;
  }

  get activeType( ): CatType {
    return this._activeType;
  }

  // tslint:disable-next-line:typedef
  get dataInputs() {
    const opts: CategoryInputs = new CategoryInputs();
    opts.search_text =   this.categorySearch.value || null;
    opts.sort =   this.sort.active || null;
    opts.sort_type =   this.sort.direction || null;
    opts.changeParentSorting();

    return opts.get_optimized();
  }

  data: Category[] = [];
  optionParents: Category[ ] = [ ];
  displayedColumns =  [ 'select', 'id', 'name', 'action' ];

  expandedEdit: Category;
  // tslint:disable-next-line:variable-name
  cat_adder: CategoryAdder = new CategoryAdder( );

  // tslint:disable-next-line:variable-name
  private _listIsTree: boolean = null;

  catTypes: CatType[] = [
    { tabTitle: 'Quiz Subject', catType: 'quiz-subject', isTree: true },
    { tabTitle: 'Question Subject', catType: 'question-subject', isTree: true },
  ];

  // tslint:disable-next-line:variable-name
  private _activeType: CatType;
  public activeCatType = null;

  /*************************************************************/
  @ViewChild(MatPaginator) dataPaginate: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /*************************************************************/
  isLoadingResults = true;
  isRateLimitReached = false;
  errString = false;
  dataIsNotFound = false;
  isTrashList = false;
  // selection = new SelectionModel<Category>(true, []);

  selection = this.dataService.setSelection();
  categorySearch: SearchModel = new SearchModel( );
  catActions: string[] = [ 'added', 'updated', 'deleted' ];
  initialLoading = true;


  disableTree(): void{
    this._activeType.isTree = this._activeType?.isTree === true ? false : this.activeType.isTree;
  }

  resetTree(): void{
    const items = this.catTypes.filter( item => { if ( item.catType === this._activeType.catType) { return item; }});
    this._activeType.isTree = items[0].isTree;
  }

  /***********************************************/

  catTypeObserver(): Observable<string> {
    return  this.route.params.pipe(
      filter(params => params.type === this.activeCatType),
      map( params => params.type )
    );
  }

  ngAfterViewInit(): void {
    // tslint:disable-next-line:variable-name

    this.route.params.subscribe( param => {
      this.activeCatType = param.type;
      const types = this.catTypes.filter( item => { if ( item.catType ===  this.activeCatType ) { return  item; } } );
      this.activeType = types[0];
    });

    this.catTypeObserver().subscribe( cat_type => {
      this.cat_adder.initialize( cat_type );
    });

    this.cat_adder.data_loaded.subscribe( (addrData: AdderData) => {
      this.optionParents = addrData.categories;
    });

    this.categorySearch.change.subscribe( ( data: string ) => this.listIsTree = data ? false : true );
    this.sort.sortChange.subscribe( (data) => this.listIsTree = [ 'id' ].indexOf(data.active) === -1 );

    this.manageCategoryList();
  }

  ngOnInit(): void {

    this.selection.clear();

    this.catService.onAction( [ 'added' ] ).subscribe( (d  ) => {
      console.log( 'RD', d )
      this.sort.active = 'id';
      this.sort.direction = 'desc';
      this.listIsTree = false;
    });

    this.catService.onAction(['deleted'], this.activeCatType )
      .subscribe( (update: CategoryUpdate ) => {
      console.log( 'Deleted Successfully', update );
    });

  }

  // tslint:disable-next-line:typedef
  private manageCategoryList( ){

    this.data = [
      {id: 12, type: 'ss', parent: 4, description: 'dds', name: 'ssr', child_string: '--' }
    ];

    this.dataIsNotFound = false;
    this.isLoadingResults = false;
    this.isRateLimitReached = false;

    merge( this.catService.onAction( this.catActions ), this.route.params, this.sort.sortChange, this.categorySearch.change ).pipe(
      filter( () => {
        if ( !this.initialLoading ) {
          this.initialLoading = true;
          return false;
        }
        return true;
      }),
      switchMap( ( d ) => {
        this.initialLoading = true;
        this.selection.clear();
        this.dataIsNotFound = false;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        return this.catService.getList( this.activeCatType, this.dataInputs );
      })
      ,
      map( ( data: Category[] ) => {
        this.dataIsNotFound = data.length === 0;
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        return data;
      })

    ).subscribe(
      ( data: Category[] ) => this.data = data,
      ( err ) => {
        this.dataIsNotFound = false;
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.errString = err.message;
        // List reinitializing
        this.initialLoading = false;
        this.manageCategoryList();
      }
    );


  }
}




interface QuizListInput {
  type?: string;
}



