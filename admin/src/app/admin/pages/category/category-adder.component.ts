import {Component, Input, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DataService} from '../../../services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Category, CategoryService, CategoryUpdate, CatType} from '../../../services/category.service';
import {merge, Observable, Subject} from 'rxjs';
import {AppService} from '../../../services/app.service';
import {filter, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-adder',
  templateUrl: 'category-adder.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryAdderComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService<Category>,
    private category: CategoryService,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private app: AppService
  ) { }

  @Input()
  title = 'Add Category';

  @Input('btn-title')
  btnTitle = 'Submit';

  @Input()
  appearance: 'fill' | 'legacy' | 'outline' | 'standerd' = 'legacy';

  // tslint:disable-next-line:variable-name
  category_type = '';

  @Input()
  adderModel: CategoryAdder = new CategoryAdder( );

  @Output()
  adderModelChange = new EventEmitter<CategoryAdder>( );

  private insertSubject: Subject<Category> = new Subject<Category>();

  private parentItemsSubject: Subject<AdderData> = new Subject<AdderData>();

  optionParents: Category[] = [];

  initialLoadingParentOpts = true;

  formIsBusy = false;

  initialized = false;

  // tslint:disable-next-line:variable-name
  public form_value = {
    name: '',
    parent_id: 0,
  };

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.adderModel.new_item = this.insertSubject.asObservable( );
    this.adderModel.data_loaded = this.parentItemsSubject.asObservable( );
    this.adderModel.cat_type.subscribe(type => this.category_type = type );
    // this.adderModel.cat_type.subscribe(type => console.log( '%%%', type ) );

    this.setParentsOptions( );
  }


  private setParentsOptions( ): void{

    merge( this.category.onAction( this.category_type ), this.adderModel.cat_type ).pipe(
      filter( () => {
        if ( !this.initialLoadingParentOpts ) {
          this.initialLoadingParentOpts = true;
          return false;
        }
        return true;
      }),
      switchMap( ( r ) => {
        console.log( '---%%%---', this.category_type, ' - ', r );
        this.formIsBusy = true;
        return this.category.getList( this.adderModel.category_type, { ref: 'parent_options' } );
      }),
    // this.category.getList( this.category_type, { ref: 'parent_options' } ).pipe(
      map(( data: Category[ ] ) => {
        this.formIsBusy = false;
        data.unshift( {
          description: '',
          id: 0,
          name: '(root)',
          parent: 0
        });
        //data = this.category.getTreeList( data );
        const adderData: AdderData = new AdderData();
        adderData.categories = data;
        this.parentItemsSubject.next( adderData );

        return data;
      })
    ).subscribe(
      data => this.optionParents = data,
      error => {
        // List reinitializing
        // this.initialLoadingParentOpts = false;
       // this.setParentsOptions();
      }
    );
  }

  // tslint:disable-next-line:typedef
  performCategoryForm(){
    this.formIsBusy = true;

    this.category.addCategory({
      description: '',
      name: this.form_value.name,
      parent: this.form_value.parent_id,
      type: this.category_type
    }).subscribe( ( catUpdate: CategoryUpdate) => {

      this.formIsBusy = !catUpdate.success;
      this.form_value.name = '';
      this.form_value.parent_id = 0;
      this.category.setDataAction( catUpdate );

    }, (error) => { });

  }

}


export class CategoryAdder {
  // tslint:disable-next-line:variable-name
  cattype_subject = new Subject<string>();
  // tslint:disable-next-line:variable-name
  category_type: string;
  // tslint:disable-next-line:variable-name
  new_item: Observable< Category > = new Observable<Category>( );
  // tslint:disable-next-line:variable-name
  data_loaded: Observable< AdderData > = new Observable<AdderData>( );
  // tslint:disable-next-line:variable-name
  cat_type: Observable<string> = this.cattype_subject.asObservable();

  catType: CatType = new CatType();

  initialize( type: string ): void{
    this.category_type = type;
    this.cattype_subject.next(type);
  }
}

export class AdderData {
  categories: Category[] = [];
}
