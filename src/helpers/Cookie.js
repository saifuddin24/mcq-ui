const TOKEN_KEY = '__LOGIN_TOKEN__';

export default {
    login: function( token ) {
        if( token ) {
            localStorage.setItem( TOKEN_KEY, token );
            return true;
        }
        return false;
    },
    logout: function() {
        localStorage.removeItem( TOKEN_KEY );
    },
    getToken: function() {
        return localStorage.getItem( TOKEN_KEY );
    },
    isLoggedIn(){
        var token = localStorage.getItem( TOKEN_KEY ) || '';
        return token.length > 0;
    }
}
