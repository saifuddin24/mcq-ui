const TOKEN_KEY = '__LOGIN_TOKEN__';

export default {
    login: function( token ) {
        localStorage.setItem( TOKEN_KEY, token );
    },
    logout: function() {
        localStorage.removeItem( TOKEN_KEY );
    },
    getToken: function() {
        localStorage.getItem( TOKEN_KEY );
    },
    isLoggedIn(){
        var token = localStorage.getItem( TOKEN_KEY ) || '';
        return token.length > 0;
    }
}
