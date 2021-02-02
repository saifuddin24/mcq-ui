import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Config} from './Config';
import {ApiInput, AppService} from './app.service';
import {ConfirmDialogComponent, DialogOptions} from '../components/confirm-dialog/confirm-dialog.component';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DataService, DataTrashable} from './data.service';
import {QuestionDeleteInput } from './questions.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // Observable AppResponse sources

  dataAction = new Subject<CategoryUpdate>();
  private confirmDialog: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar,
    private appService: AppService,
    private http: HttpClient,
    private dataService: DataService<Category>,
  ) { }

  // tslint:disable-next-line:typedef
  public static names_string( categories: string[] ): string{
    return categories.join(', ');
  }

  // tslint:disable-next-line:typedef
  public names( categories: string[] ): string{
    return CategoryService.names_string( categories );
  }

  onAction( actions: string[] | string = null, catType: string = '' ): Observable<CategoryUpdate>{


    function filterStatus( catUpdate: CategoryUpdate ): boolean{
      let acts: string[] = [];

      if ( typeof actions === 'string' ) { catType = actions; }else if ( actions === null ) {
        acts = [];
      }else {
        acts = actions;
      }
      if ( acts.length === 0 && catType.trim() === '' ) { return true; }


      // tslint:disable-next-line:typedef
      function checkDataType( cat: Category ): boolean {
        return cat?.type ? ( catType === '' ? true : ( cat.type === catType ) ) : true;
      }

      return  Config.actionExists( acts, catUpdate.action ) && checkDataType( catUpdate.data );
    }

    return  this.dataService.onAction<CategoryUpdate>( (data: CategoryUpdate) => filterStatus( data ));


    // let act: string[] = [];
    // if ( typeof actions === 'string' ) {
    //   catType = actions;
    // }else if ( actions === null ) {
    //   act = [];
    // }else {
    //   act = actions;
    // }
    //
    // if ( act.length === 0 && catType === '' ) { return this.dataAction; }
    //
    // function actionExists( a: string ): boolean{
    //   if ( act.length === 0 ) return true;
    //   let r = false; act.map( d => r = r || ( a === d ) ); return  r;
    // }
    //
    // // tslint:disable-next-line:typedef
    // function checkDataType( cat: Category ): boolean {
    //   return cat?.type ? ( catType === '' ? true : ( cat.type === catType ) ) : true;
    // }
    //
    // function  predicate(value: CategoryUpdate): boolean{
    //   return actionExists( value.action ) && checkDataType( value.data );
    // }
    //
    // return this.dataAction.asObservable().pipe( filter( predicate ) );
  }

  // tslint:disable-next-line:typedef
  setDataAction( data: CategoryUpdate ){
    console.log( '1111111111111-Next: ', data );
    this.dataService.setDataAction( data );
    // this.dataAction.next( data );
  }

  // tslint:disable-next-line:variable-name
  getList( cat_type: string, input?: object ): Observable<any>{
    return this.http.get(  Config.get_api('admin/category/' + cat_type + '/list'),
      { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef
  editCategory( catId: number | string, body: CategoryUdpateInput, input?: object ){
    return this.http.put<CategoryUpdate>(  Config.get_api('admin/category/' + String( catId ) ),
      body, { params: Config.bindParams( input ), headers: Config.headers() }
    );
  }

  // tslint:disable-next-line:typedef
  deleteCategory(input: CategoryDeleteInput, catId: number | string): Observable<CategoryUpdate>{
    return this.http.delete<CategoryUpdate>(
      Config.get_api('admin/category' + (String( catId ).length === 0 ? '' :  '/' + catId ) ),
    {  headers: Config.headers(), params: Config.bindParams( input ) }
    );
  }

  // tslint:disable-next-line:variable-name
  addCategory( body: CategoryUdpateInput, input?: object ): Observable<CategoryUpdate>{
    return this.http.post<CategoryUpdate>(  Config.get_api('admin/category' ),
      body, { params: Config.bindParams( input ), headers: Config.headers() }
    );

  }

  getTreeList( data: Category[] ): Category[ ] {
    const catList: Category[] = [];
    // data = data.map( item => Category.getInstance(item));

    function _setCatList( parent, level: number = 0): void {
      const cList = data.filter( item => { if ( item.parent === parent) { return item; } } );
      cList.map( cat => {
        cat.level = level;
        catList.push( cat );
        if ( cat.id > 0 &&  Category.has_children(data, cat) ){
          _setCatList( cat.id, level + 1 );
        }
      });
    }
    _setCatList(0);
    return catList;
  }

  // tslint:disable-next-line:variable-name
  actionOptionList( row ): DialogOptions[] {
    // tslint:disable-next-line:variable-name
    const bundle_ids: string = this.dataService.bundleValues( 'id' );
    const input: QuestionDeleteInput = {
      _bundle: bundle_ids.trim().length > 0 ? 'true' : 'false',
      _bundle_ids: bundle_ids
    };

    return [
      {
        action_name: 'delete',
        title: 'Deleting item(s)',
        body: 'Item(s) will be deleted',
        onPositiveAction: ( dialogRef, dialogOption) => {
          dialogOption.body = 'Deleting...';
          dialogOption.onPositiveAction = ( ) => {};
          this.onAction([ 'deleted' ]).subscribe( () => dialogRef.close());
          this.deleteCategory( input, row?.id || '' )
            .subscribe(
              data => this.setDataAction(data),
              data => { dialogOption.body = data.error?.message ? data.error?.message : dialogOption.body; }
            );
        }

      }
    ];

  }

  // tslint:disable-next-line:typedef
  performAction( action, row?  ) {
    console.log( action, this.dataService.bundleValues('id' ) );

    // const dialogOptions: DialogOptions = { };
    const opts = this.actionOptionList( row ).filter( item => item.action_name === action );
    const dialogOptions = opts[0] || null;

    if ( dialogOptions ) {
      this.appService.openConfirmDialog( dialogOptions );
    }
  }

}



export  class CategoryInputs implements ApiInput{
  // tslint:disable-next-line:variable-name
  search_text: string;
  sort: string | object | undefined;
  // tslint:disable-next-line:variable-name
  sort_type: 'asc' | 'desc' | '';
  // tslint:disable-next-line:variable-name
  disable_parent_sorting: 'true' | 'false';

  changeParentSorting( ): void{
    this.disable_parent_sorting = this.sort === 'id' ? 'true' :  'false';
  }
  // tslint:disable-next-line:typedef
  get_optimized( ){
    Object.keys( this ).map( key => { if ( this[key] === null ) {
      delete this[ key ];
    }});
    return this;
  }
}

export class CategoryUdpateInput {
  name: string | null;
  description?: string | null;
  parent?: number | string | null;
  type?: string;
  // tslint:disable-next-line:variable-name
}

export class CategoryUpdate {
  data: Category;
  action: string = '';
  success: boolean;
  message: string;
}

export class Category {

  level ? = 0;
  // tslint:disable-next-line:variable-name
  child_string?: string;
  id: number | string = 0;
  name: string | null;
  description: string | null;
  parent: number | string | null;
  type?: string;
  // tslint:disable-next-line:variable-name

  static getInstance?(cat: Category ): Category{
    const newInstance = new Category();
    Object.keys(cat).map( key => newInstance[key] = cat[key] );
    return newInstance;
  }

  static getItem( list: Category[], id ): Category | null {
    const items = list.filter( item => item.id === id );
    if ( items[0] ) {
      return Category.getInstance( items[0] );
    }
    return null;
  }

  hasChildren?( list: Category[] ): boolean {
    return list.filter( ( ( item: Category ) => { if ( this.id === item.parent ) { return item; } } )).length > 0;
  }

  static has_children?( list: Category[], category: Category ): boolean {
    return list.filter( ( ( item: Category ) => { if ( category.id === item.parent ) { return item; } } )).length > 0;
  }

}

export class CategoryDeleteInput implements DataTrashable{
  // tslint:disable-next-line:variable-name
  _bundle: 'true' | 'false' | '' = 'false';
  // tslint:disable-next-line:variable-name
  _bundle_ids: (number | string) | ( number | string)[] = 0;
  // tslint:disable-next-line:variable-name
  _permanent?: 'true' | 'false' | '';
}


export class CatType {
  tabTitle: string;
  catType: string;
  isTree?: boolean;
}

