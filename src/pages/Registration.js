import {useState,useEffect} from "react";
import { User} from "../helpers/db";
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
}
const CREATE_USER_LABEL = 'Create User';
const CREATE_USER_LABEL_CREATING = 'Creating...';

export default ({onLoginSuccess, onRegistrationFailed, onLoginBtnClick, title, logo, returnTo}) => {
    returnTo = returnTo || '/';
    let history = useHistory();
    let loaded = false;
    let user_type = null;
    const [ userdata, setUserdata ] = useState( { email: '', phone_number: '', password: '', usertype: null } );
    const [ message, setMessage ] = useState( '' );
    const [ success, setSuccess ] = useState( false );
    const [ errors, setErrors ] = useState( { email:[], phone_number: [], password: [], usertype: [] } );
    const [ submitBtn, setSubmitBtn ] = useState( { text: CREATE_USER_LABEL, disabled: true } );

    function loginBtnClick(e) {
        e.preventDefault();
        if( typeof onLoginBtnClick == 'function' ) {
            onLoginBtnClick();
        }else {
            history.push('/login')
        }
    }

    useEffect( function () {
        User.registration_data( 'student' )
            .then( ({data})  => {
                console.log( 'RESULT: ', data );
                setSubmitBtn({ text: CREATE_USER_LABEL, disabled: false });
                setData( 'usertype', data.__r );
                // setData( 'usertype', '----o---');
            })
            .catch( ({response}) => {
                console.log( response );
            })

    }, [ userdata.usertype == null ]);

    function setData(key, value){
        var data = userdata;
        data[key] = value;
        setUserdata( data );
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
        setErrors( { email:[], phone_number: [], password: [], usertype: [] });
    }

    function requesting( yes ) {
        setSubmitBtn({ text: ( yes ? CREATE_USER_LABEL_CREATING : CREATE_USER_LABEL ), disabled: yes });
    }

    function msgColor() {
        return success ?  'green': 'red';
    }

    function formOnSubmit(e){
        e.preventDefault();
        console.log( 'USER_DATA.USER_TYPE', userdata );

        if( userdata.usertype != null ) {

            requesting( true );

            User.submit_registration_data( userdata )
                .then( ( {data} ) => {
                    setMessage( data.message+ ' Redirecting...' );
                    setSuccess( true );
                    if( Cookie.login( data.token )) {
                        if( typeof onLoginSuccess == 'function')
                            return onLoginSuccess( data );
                        setTimeout(() => {
                            window.location.href = returnTo;
                        }, 1000)
                    }
                    resetErrs();
                })
                .catch( ({response}) => {
                    setMessage( response.data.message );
                    if( response.status == 422 ) {
                        console.log( response.data.errors );
                        setErrors( response.data.errors );
                    }
                    if( typeof onRegistrationFailed == 'function')
                        onRegistrationFailed( response );
                })
                .finally( () => requesting(false))

        }
    }

    function Title( ) {
        if( title ) {
            return <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        }
        return <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registration</h2>
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
                <div className="rounded-md">

                    <div className='block mb-3'>
                        <label htmlFor="email" className="text-gray-600 text-sm">Email</label>
                        <input id="email" name="email" type="text" autoComplete="email"
                               onChange={(e) => setData( e.target.name, e.target.value)}
                               className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                               placeholder="Type your email address"/>
                        <Error field='email'/>
                    </div>

                    <div className='block mb-3'>
                        <label htmlFor="phone_number" className="text-gray-600 text-sm">Phone</label>
                        <input id="phone_number" name="phone_number" type="text" autoComplete="phone_number"
                               onChange={(e) => setData( e.target.name, e.target.value)}
                               className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                               placeholder="Type your phone numbers"/>
                        <Error field='phone_number'/>
                    </div>

                    <div className='block mb-3'>
                        <label htmlFor="password" className="text-gray-600 text-sm">Password</label>
                        <input id="password" name="password" type="password"
                               onChange={(e) => setData( e.target.name, e.target.value)}
                               autoComplete="current-password"
                               className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                               placeholder="Type your password. at least 6 digit"/>
                        <Error field='password'/>
                        <Error field='usertype'/>
                    </div>

                    {/*<div className='block mb-3'>*/}
                    {/*    <label htmlFor="password" className="sr-only">Password</label>*/}
                    {/*    <input id="password" name="password" type="password"*/}
                    {/*           onChange={(e) => setData( e.target.name, e.target.value)}*/}
                    {/*           autoComplete="current-password"*/}
                    {/*           className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"*/}
                    {/*           placeholder="Password"/>*/}
                    {/*    <Error field='password'/>*/}
                    {/*</div>*/}

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

                <div>
                    <div>
                        <SubmitButton disabled={submitBtn.disabled}>{submitBtn.text}</SubmitButton>
                    </div>
                    <p className='pt-2 text-sm text-gray-600'>
                        Already Member? <a href='javascript:void(0)' className='text-blue-400'
                                               onClick={loginBtnClick}>Click Here to Login</a>
                    </p>
                </div>
            </form>

        </div>
    </div>
}
