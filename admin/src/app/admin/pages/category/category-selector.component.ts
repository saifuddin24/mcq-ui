import {AfterViewInit, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SelectionModel} from '@angular/cdk/collections';
import {merge, observable, Observable, of, Subject} from 'rxjs';

import { DataService} from '../../../services/data.service';
import {Category, CategoryService, CatType} from '../../../services/category.service';
import {AppService} from '../../../services/app.service';
import {AdderData, CategoryAdder} from './category-adder.component';
import {filter, map, switchMap} from 'rxjs/operators';
import {CastExpr} from '@angular/compiler';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-selector',
  templateUrl: 'category-selector.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategorySelectorComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService<Category>,
    private catService: CategoryService,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private app: AppService
  ) { }

  @Input('input-appearance')
  inputAppearance: 'fill' | 'legacy' | 'outline' | 'standerd' = 'legacy';

  @Input('adder-title')
  adderTitle: string = 'Add New';

  @Input('selector-title')
  selectorTitle: string = 'Select One';

  @Input('addr-btn-title')
  addrBtnTitle: string = 'Submit';

  @Input('category-type')
  categoryType: string = null;

  @Input()
  catModel: CategorySelector = new CategorySelector( );

  @Output()
  catModelChange = new EventEmitter<CategorySelector>( );

  private itemsSubject: Subject<Category[]> = new Subject<Category[]>();
  private idsSubject: Subject<(string|number)[]> = new Subject<(string|number)[]>();
  private loadedSubject: Subject<Category[]> = new Subject<Category[]>();

  // tslint:disable-next-line:variable-name
  adder = new CategoryAdder();
  addrOpen: boolean;

  // tslint:disable-next-line:variable-name
  public categoryItems: Category[] = [];

  selection: SelectionModel<Category> = new SelectionModel<Category>(true, []);

  get selected(): number[] {
    return this.selection.selected.map( item => Number( item.id ) );
  }

  selectedList: Category[] = [];
  currentlyAdded: Category = new Category();

  ngOnInit(): void {
    this.catModel.categories = this.itemsSubject.asObservable();
    this.catModel.ids = this.idsSubject.asObservable();
    // this.catModel.itemsSelected = this.itemsSubject.asObservable( );
    // this.catModel.loaded = this.loadedSubject.asObservable( );
    // this.catModelChange.emit( this.catModel );
  }


  // tslint:disable-next-line:typedef
  selection_select( itm: Category ){
    const item = Category.getItem( this.categoryItems, itm.id );
    // if ( !this.selection.isSelected( item)) {
    console.log( 'RFDFDFDFDFDF==', item );
    setTimeout( () => {
      this.selection.select( item );
    }, 3000 );
    // }
  }

  // tslint:disable-next-line:typedef
  notifyChanged( ){
    this.catModel.selectedIds = this.selected;
    this.itemsSubject.next( this.selection.selected );
    this.idsSubject.next( this.selection.selected.map( item => item.id ) );
  }

  // tslint:disable-next-line:typedef
  selectByIds( ids: (number| string)[] ){

    if ( ids.length ) {
      console.log('this.catModel.inputCatIds', ids);
      const currentSelectionList = this.selection.selected;
      const currentSelectionIds: (number| string)[] = currentSelectionList.map( item => item.id );
      console.log( 'question.categories -2-', ids );
      console.log( 'question.categories -3-', currentSelectionIds );

      ids = ids.concat( currentSelectionIds).filter((v, i, a) => a.indexOf(v) === i);

      console.log( 'question.categories -4-', ids );

      this.selection.clear( );
      this.categoryItems.map( item => {
        // if( item.id === 167)
        //   this.selection_select( item );

        if ( ids.indexOf( Number( item.id ) ) > -1 ){
          this.selection.select( item );
        }

      });
    }
    this.notifyChanged();
  }


  private setSelectedIds( categoryIds: (string | number)[]): void{
    if ( categoryIds ) {
      this.catModel.selectedIds = this.catModel.selectedIds.concat( categoryIds ).filter((v, i, a) => a.indexOf(v) === i);
    }
  }

  ngAfterViewInit(): void {

    this.catModel.catIds.asObservable().subscribe( ids => {
      this.setSelectedIds( ids );
    });

    this.catService.onAction(['added'] , this.categoryType )
      .subscribe( update => {
        this.adder.initialize( this.categoryType );
        this.setSelectedIds( [update.data.id] );
      });

    this.catModel.categoryLoaded.subscribe( item => {
        console.log( '.selectedIds', this.catModel.selectedIds );
        this.selectByIds( this.catModel.selectedIds );
    });

    this.catModel.categoryLoader.asObservable().subscribe( (categoryIds: (string | number)[]) => {

      this.adder.data_loaded.subscribe( data => {
        this.categoryItems = data.categories;
        this.setSelectedIds( categoryIds );
        console.log( '.selectedIds -', this.catModel.selectedIds );
        // console.log( 'UpcUio-loaded', ++this.step, categoryIds)

        this.catModel.categoryLoaded$.next( data.categories );
      });

      if ( this.categoryType ) {
        this.adder.initialize( this.categoryType );
      }
    });
  }

  toggleSelection( event, row: Category ): void{
    if ( event ) {
      this.selection.toggle( row );
    }
    this.notifyChanged();
  }


}

export class CategorySelector {
  categoryLoaded$: Subject<Category[]> = new Subject<Category[]>();
  categoryLoaded: Observable<Category[]> = this.categoryLoaded$.asObservable();
  categoryLoader: Subject<(number | string) []> = new Subject<(number|string)[]>();
  catIds: Subject<(number | string) []> = new Subject<(number|string)[]>();
  categories: Observable<Category[]>;
  ids: Observable<(string|number)[]>;
  selectedIds: (number| string) [] = [];
  load( catIds?: (number| string) []): void{
    this.categoryLoader.next( catIds );
  }

  setCategoryIds( catIds: (number| string) [] ): void{
    this.catIds.next( catIds );
  }

}
