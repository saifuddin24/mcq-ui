import {useState} from "react";
import {User} from "../helpers/db";
import Cookie from "../helpers/Cookie";
import {  useHistory } from "react-router-dom";

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
};



export default ({onLoginSuccess, onLoginFailed, onRegisterBtnClick, title, logo, returnTo}) => {
    let history = useHistory();
    returnTo = returnTo || '/';
    const [ userdata, setUserdata ] = useState( {username: '', password: ''} );
    const [ message, setMessage ] = useState( '' );
    const [ success, setSuccess ] = useState( false );
    const [ errors, setErrors ] = useState( { username: [], password: [] } );
    const [ submitBtn, setSubmitBtn ] = useState( { text: 'Sign In', disabled: false } );

    function setData(key, value){
        var data = userdata;
        data[key] = value;
        setUserdata( data );
    }

    function registerBtnClick(e) {
        e.preventDefault();
        if( typeof onRegisterBtnClick == 'function' ) {
            onRegisterBtnClick();
        }else {
            history.push('/registration')
        }
    }

    function Error({field}) {
        if( errors[field] ) {
            const errs = errors[field];
            return <div className='text-sm text-red-800'>
                {errs.map( (err, i) => <p key={i} className='my-0 mb-1 py-0'>{err}</p> )}
            </div>
        }
        return '';
    }

    function resetErrs( ){
        setErrors( {username: '', password: ''} );
    }

    function requesting( yes ) {
        setSubmitBtn({ text: ( yes ? 'Signing In' : 'Sign In'), disabled: yes });
    }

    function msgColor() {
        return success ?  'green': 'red';
    }

    function formOnSubmit(e){
        e.preventDefault();
        requesting( true );

        User.submit_login_data( userdata )
            .then( ( {data} ) => {
                setMessage( data.message+ ' Redirecting...' );
                setSuccess( true );
                resetErrs();
                if( Cookie.login( data.access_token )) {
                    if( typeof onLoginSuccess == 'function')
                        return onLoginSuccess( data );
                    setTimeout(() => {
                        window.location.href = returnTo;
                    }, 2000)
                }
            })
            .catch( ({response}) => {
                setMessage( response.data.message );
                if( response.status == 422 ) {
                    console.log( response.data.errors );
                    setErrors( response.data.errors );
                }

                if( typeof onLoginFailed == 'function')
                    return onLoginFailed( response );
            })
            .finally( () => requesting(false))

    }

    function Title() {
        if( title ) {
            return <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        }
        return <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
    }

    function Logo() {
        if( logo !== false )
            return <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow"/>
        return '';

    }

    return <div className="flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div>
                <Logo/>
                <Title/>
                { message &&
                <p className={'text-center mt-2 text-' +msgColor()+ '-700 bg-'+msgColor()+'-200 py-2 px-1'}>
                    {message}
                </p>}
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={formOnSubmit}>
                <input type="hidden" name="remember" value="true"/>
                    <div className="rounded-md -space-y-px">
                        <div className='block mb-3'>
                            <label htmlFor="username" className="sr-only">Email address</label>
                            <input id="username" name="username" type="text" autoComplete="email"
                                   onChange={(e) => setData( e.target.name, e.target.value)}
                                   className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                   placeholder="Your Username"/>
                               <Error field='username'/>
                        </div>
                        <div className='block mb-3'>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password"
                                   onChange={(e) => setData( e.target.name, e.target.value)}
                                   autoComplete="current-password"
                                   className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                   placeholder="Password"/>
                            <Error field='password'/>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember_me" name="remember_me" type="checkbox"
                                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div>

                        <SubmitButton disabled={submitBtn.disabled}>
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">

                                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                          clipRule="evenodd"/>
                                </svg>
                            </span>
                            {submitBtn.text}
                        </SubmitButton>
                        </div>
                        <p className='pt-2 text-sm text-gray-600'>
                            Don't have account? <a href='javascript:void(0)' className='text-blue-400'
                                                   onClick={registerBtnClick}>Click Here to Register</a>
                        </p>
                    </div>
            </form>

        </div>
    </div>
}
