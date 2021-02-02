import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'data-search-input',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() {

  }

  @Input() appearance: 'fill' | 'legacy'| 'outline' | 'standard' = 'standard';
  @Input() label: string = 'Search';
  @Input() placeholder: string = 'Type anything';
  @Input('debounce-time') timeDelay: number = 600;

  @Input()
  searchModel: SearchModel = new SearchModel();

  @Output()
  searchModelChange = new EventEmitter<SearchModel>();

  private search = new Subject<string>();
  public searchString: string;

  ngOnInit(): void {
    // this.searchModelChange.emit( this.searchModel );
    const obs: Observable<string> = this.search.asObservable();

    this.searchModel.change = obs.pipe(
      map((value: string) => value.trim() ),
      debounceTime( this.timeDelay ), distinctUntilChanged( ),
      map( (v: string) => {
        console.log( 'UorFalse:rr', v );
        this.searchModel.value = v;
        return v;
      }),
    );

  }

  // tslint:disable-next-line:typedef
  toggleSearch(){
    this.search.next( this.searchString );
  }

}

export class SearchModel{
  change: Observable<string> = new Observable();
  value: string;
}


