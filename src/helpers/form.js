import {default as React, useState} from "react";
import {User} from "../helpers/db";
import Cookie from "../helpers/Cookie";
function SubmitButton( props ) {

    let color = props.disabled ? ' text-gray-500 bg-gray-300 '
        :' text-white bg-indigo-600 hover:bg-indigo-700 ';

    console.log( 'COLOR: ', color );


    return <button type="submit"
                   disabled={props.disabled}
                   className={ 'group text-sm font-medium rounded-md  relative w-full flex justify-center py-2 px-4 border '+
                   ' border-transparent text-sm font-medium rounded-md '+ color +
                   ' focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
    >
        {props.children}


    </button>
}



// export default ( props ) => {
//     const [ userdata, setUserdata ] = useState( {username: '', password: ''} );
//     const [ message, setMessage ] = useState( '' );
//     const [ success, setSuccess ] = useState( false );
//     const [ errors, setErrors ] = useState( { username: [], password: [] } );
//     const [ submitBtn, setSubmitBtn ] = useState( { text: 'Sign In', disabled: false } );
//
//     function setData(key, value){
//         var data = userdata;
//         data[key] = value;
//         setUserdata( data );
//     }
//
//     function Error({field}) {
//         if( errors[field] ) {
//             const errs = errors[field];
//             return <div className='text-sm text-red-800'>
//                 {errs.map( (err, i) => <p key={i} className='my-0 mb-1 py-0'>{err}</p> )}
//             </div>
//         }
//         return '';
//     }
//
//     function resetErrs( ){
//         setErrors( {username: '', password: ''} );
//     }
//
//     function requesting( yes ) {
//         setSubmitBtn({ text: ( yes ? 'Signing In' : 'Sign In'), disabled: yes });
//     }
//
//     function msgColor() {
//         return success ?  'green' : 'red';
//     }
//
//     function formOnSubmit(e){
//         e.preventDefault();
//         requesting( true );
//
//         User.submit_login_data( userdata )
//             .then( ( {data} ) => {
//                 setMessage( data.message+ ' Redirecting...' );
//                 setSuccess( true );
//                 Cookie.login( data.token )
//                 resetErrs();
//                 setTimeout(() => {
//                     window.location.href = '/';
//                 }, 2000)
//             })
//             .catch( ({response}) => {
//                 setMessage( response.data.message );
//                 if( response.status == 422 ) {
//                     console.log( response.data.errors );
//                     setErrors( response.data.errors );
//                 }
//             })
//             .finally( () => requesting(false))
//
//     }
//
//
//
//     return <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={formOnSubmit}>{props.children}</form>
//
// }

export default class Form extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            'btnLabel': 'hjfhsj'
        }
    }

    static SubmitBtn(){
        useState();
        return <p>{this.state.btnLabel}</p>
    }

    render(){
        return <form className="mt-8 space-y-6" action="#" method="POST" >{this.props.children}</form>
    }
}
