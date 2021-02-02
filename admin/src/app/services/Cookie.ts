
export default class Cookie {
  static LOGIN_TOKEN_KEY = '@@_TOKEN_@@'

  static login( access_token ){
    localStorage.setItem(this.LOGIN_TOKEN_KEY, access_token );
  }

  static isLoggedIn(){
    const token = localStorage.getItem( this.LOGIN_TOKEN_KEY );
    if( typeof token == 'string' ){
      const token_parts = token.split('.');
      return token_parts.length == 3;
    }
    return false;
  }

  static bearerToken(){
    return 'Bearer ' + this.getToken();
  }

  static getToken(){
    return localStorage.getItem( this.LOGIN_TOKEN_KEY );
  }

  static logout(){
    return localStorage.removeItem( this.LOGIN_TOKEN_KEY );
  }

}
