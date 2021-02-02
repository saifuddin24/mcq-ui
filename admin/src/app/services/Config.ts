import {HttpHeaders, HttpParams} from '@angular/common/http';
import {AppService} from './app.service';
import Cookie from './Cookie';

export class Config {
  static BASE_URL = window[ 'BASE_API_URL' ] || 'http://localhost/quiz-circle/app/api/';
  static API_VERSION = 'v1';
  static AUTH_TYPE = 'Bearer';

  static AUTH_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MjIwNGRlMC02NmEyLTQ0MjctYmViNS1kMmY2MmNmMzlhOWUiLCJqdGkiOiIwNDYyNmZmNTEzYjcyZWVlZTFkZDY3YTk5MTRmY2M3ZDAyZWVkMjMxM2IyMGRkZDM0ZTNmOGYzNTY5NzVkOGVkOWU0OTJkMWEzOGFmNDMwYiIsImlhdCI6MTYwNjY3NDY1OCwibmJmIjoxNjA2Njc0NjU4LCJleHAiOjE2MzgyMTA2NTgsInN1YiI6IjUiLCJzY29wZXMiOltdfQ.XH2LCG-9bEm_0wDX0SF9KEf3E6cfiFgguRvauzUEiLoNhtTBBA7sdtWPgBKcQ9s8zAttlS5SgZlrG0aHzuvno1Ob1mahXLuTDBhvcC6KqEX_TGQwIJZe9vt4QDy_hkWALAmxHNZssiQLjq-25KuexNwejcuhuI25kgXW3l__H99lQudDQX5SGBrd0aB-lT7qQXI4g_INb1U5ADIV018UEvnLnCm_nWxnp4JjA3-4TCF7eyOwDlXPBcF8o7ce_PCv89XHJuIB3Abj3rx8DUDz51zW4oDOD3hHadEX_195W3XL0ez_F82G7HcGSKzeXYXbHzUxyrxmk49ILVX3mBT4PbsnTnrLr4G_Lx1wDb-cY-7LUNBAxYd1eOq8KR0rvVzOHBe-8wht3mnquVZKs3KPKgAGWpq_NZcOF410YR6xeIdvyQsqbHRePJid-DsdpUGBWEqJgtCThg6WIJmEEZtJhUXNQlYG5G7uLLcIWWwa2rb4v8ENbgrqPMts2PJm6UGeUzA7160fApSf8pKmHbKh9yrCLHrwv-7yzx-jYcF3nTI2IWUhonyf49aPC7sun7iaCLkRUTYF8D5ip7XxgkKYU-Rne3WcQAofPx7iNyUFaWUO4qY7Q6DddrU3mbiG7FCLcOc2__jVZ-3pYMjYRZ9PgjRM2Y1mffi-FRVzAfDpBAU';
  static AUTHORIZATION = Config.AUTH_TYPE + ' ' + Config.AUTH_TOKEN;

  filterId: string = null;
  filter: AppService;

  static adminBase( uri ){
    return '/admin'+ uri;
  }

  static bindParams( input: object | any ): HttpParams | { } {
    let params = new HttpParams( );
    if ( typeof input === 'object' )
      Object.keys( input ).map( key => params = params.append( key, input[key] ) );
    return params;
  }

  // tslint:disable-next-line:typedef
  public static category_names( categories: string[] ): string{
    return categories.join( ', ' );
  }

  static headersWithoutToken( headers?: object | null ): HttpHeaders  {
    let heads = new HttpHeaders( );
    heads = heads.set( 'ContentType', 'application/json' );
    heads = heads.set( 'Accept', 'application/json' );
    if ( headers ) {
      Object.keys( headers ).map( key => heads = heads.set( key, headers[ key ]) );
    }
    return heads;
  }

  static headers( headers?: object | null ): HttpHeaders  {
    let heads = new HttpHeaders( );

    heads = heads.set( 'Authorization', Cookie.bearerToken() );

    heads = heads.set( 'ContentType', 'application/json' );
    heads = heads.set( 'Accept', 'application/json' );

    if ( headers ) {
      Object.keys( headers ).map( key => heads = heads.set( key, headers[ key ]) );
    }

    return heads;
  }

  static get_api( uri: string ): string {
    return  Config.BASE_URL + Config.API_VERSION + '/' + uri;
  }

  static actionExists( acts = [],  a: string ): boolean{
    return acts.length === 0 || acts.indexOf( a ) > -1;
  }
}
