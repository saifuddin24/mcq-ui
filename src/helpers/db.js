import Cookie from "./Cookie";
const axios = require( 'axios');

const base_url = window.API_BASE_URL || 'http://192.168.1.176:8000/api/v1';

function axios_create( token ) {
    return axios.create({
        baseURL: base_url,
        timeout: 10000,
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + ( token || Cookie.getToken() )
        },
    });
}

const db = axios_create();

export default db;

class Quiz {

    static get( params ){
        return axios_create( ).get( '/quiz/list', { params } );
    }

    static find( id, params ){
        return axios_create( ).get( '/quiz/' + id, { params } );
    }

    static take( data ){
        return axios_create( ).post( '/quiz/take', data );
    }

    static give_answer( id, data ){
        return axios_create( ).post( 'quiz/' + id + '/answer', data );
    }

}

class User {
    static get( params, token ){
        const ax = axios_create( token );
        return ax.get( '/user', { params } );
    }

    static submit_login_data( data ){
        return axios_create().post( '/user/login', data )
    }

    static registration_data( name ){
        return axios_create().get( '/user/registration-data/' + name  )
    }

    static submit_registration_data( data ){
        return axios_create().post( '/user/create', data )
    }

    static submit_editing_data( data ){
        return axios_create().put( '/user/edit', data )
    }

    static submit_change_pass_data( data ){
        return axios_create().patch( 'user/password/change', data )
    }

    static logout(){
        return axios_create().post( '/user/logout' );
    }
}

export {base_url, Quiz, User}
