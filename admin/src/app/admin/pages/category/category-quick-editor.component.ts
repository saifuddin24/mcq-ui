import {AfterViewInit, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DataService} from '../../../services/data.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Category, CategoryInputs, CategoryService, CategoryUpdate, CatType} from '../../../services/category.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'category-quick-editor',
  templateUrl: './category-quick-editor.component.html',
  styleUrls: ['./category.component.css'],
})
// @ts-ignore
export class CategoryQuickEditorComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService<Category>,
    private catService: CategoryService,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar
  ) { }

  // tslint:disable-next-line:no-input-rename
  // @ts-ignore
  @Input( 'category-data' ) catData: Category;
  // @ts-ignore
  @Input( 'cat-type' ) catType: CatType;
  // @ts-ignore
  @Input( 'category-parents' ) catParents: Category[];
  // @ts-ignore
  @Output('cancel') cancelClicked = new EventEmitter<any>();
  // @ts-ignore
  @Output('success') successed = new EventEmitter<CategoryUpdate>();
  // @ts-ignore
  @Output('error') errorOccured = new EventEmitter<any>();

  // tslint:disable-next-line:variable-name
  cat_name: string;
  // tslint:disable-next-line:variable-name
  cat_parent: number | string;
  // tslint:disable-next-line:variable-name
  cat_description: string;

  message: string;
  busy: boolean;
  success: boolean;
  error: boolean;

  ngOnInit(): void {
    this.cat_name = this.catData.name;
    this.cat_parent = this.catData.parent;
    this.cat_description = this.catData.description;
  }


  // tslint:disable-next-line:typedef
  arrFill( length: number, fill: number = 1) {
    return length === 0 ? [] :  Array( length ).fill(1);
  }

  // tslint:disable-next-line:typedef
  performEdit(){

    this.busy = true;
    this.message = 'Updating...';
    this.catService.editCategory( this.catData.id, {
      description: this.cat_description,
      name: this.cat_name,
      parent: Number(this.cat_parent)
    }).subscribe(
      (update: CategoryUpdate) => {
        this.catService.setDataAction( update );
        this.success = update.success;
        this.error = false;
        this.message = update.message;
        this.busy = false;
        this.successed.emit( update );
      },
      error => {
        this.error = true;
        this.busy = false;
        this.message = 'Failed to update!';
        this.errorOccured.emit( error );
      }
    );
  }

}
