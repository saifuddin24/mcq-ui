import {useEffect} from "react";
import {User} from "../helpers/db";
import {useState} from "react";
import {Alert, Button, FieldError, InputField} from "../components/ui";
import {_values} from "../helpers/form";

export default () => {

    var loading = true;
    const [ userdata, setData ] = useState( {} );
    const [ message, setMessage ] = useState( {text:'', type: 'success' } );
    const [ form_values, setFormValues ] = useState( {} );
    const [ editing, setEditing ] = useState( false );
    const [ errors, setErrors ] = useState( { } );
    const [ btn, setBtn ] = useState( { disabled: false, label: 'Save' } );

    function setFormData( data ){
        console.log( 'form_values_))', data );
        let c = {};

        c.first_name = data.first_name;
        c.last_name = data.last_name;
        c.email = data.email;
        c.phone_number = data.phone_number;

        setFormValues( c );

        console.log( 'form_values_))', c );

    }

    useEffect(function () {
        setData( {} );
        User.get()
            .then( ({data}) => {
                setData( data.data );
                setFormData( data.data )

                loading = false;
                console.log( data.data );
                console.log( 'pp', Object.keys( userdata ) );
            })
            .catch(({response}) => {
                console.log(response);
            })

    }, [ loading ]);

    function submit_editing_form() {
        setBtn({ disabled: true, label: 'Saving...' });

        // console.log( form_values );


        User.submit_editing_data( form_values )
            .then( ({data}) => {
                console.log( data );
                setData( data.data );
                setEditing( false );
                setMessage({text: data.message, type: 'success'})

                setTimeout( () => setMessage({text: '', type: 'success'}), 2000 )

            }).catch( ({response}) => {
                console.log( response );
                setErrors( response.data.errors );
                setMessage({text: response.data.message, type: 'warning'})
                setTimeout( () => setMessage({text: '', type: 'success'}), 5000 )
            }).finally(() => setBtn({ disabled: false, label: 'Save' }) );
    }


    function PasswordChange() {
        const [showForm, setShowForm] = useState(false);

        if( showForm )

            return <ChangePassword onCancel={() => { setShowForm(false)}}></ChangePassword>

        return <div>
            <span className='text-italic text-red-300'>(Secret)</span>
            <Button className='ml-2' size='xs'
                    onClick={ (  ) => { setShowForm(true ) } }
                    variant='outline-warning'>Change</Button>
        </div>
    }

    function ItemValue( {field} ) {
        if( field === 'password' )
            return <PasswordChange/>
        else {
            if( editing ) {
                return <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <InputField type='text'
                            onChange={ e => { setFormValues( _values( form_values, e ) ) } }
                            defaultValue={form_values[field]} name={field} />
                    <FieldError errors={errors} field={field}/>
                </dd>
            }

            return <dd className="mt-3 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {( (userdata[field] == null ? <span className='text-italic text-gray-400'>(Empty)</span>
                    : userdata[field])) }
            </dd>
        }
    }

    function ProfileItem({field, label}){

        return <div className="bg-gray-50 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">
                {label}
            </dt>
            <ItemValue field={field}/>
        </div>
    }


    function ButtonContainer() {
        if(editing) {
            return <div className='flex'>
                <Button disabled={btn.disabled} onClick={ () => { submit_editing_form( ) }} variant={'info'}>
                    {btn.label || 'Save'}
                </Button>
                <Button className='ml-2'
                        onClick={() => {

                            console.log( userdata );

                            setErrors( {} );
                            setFormData( userdata );
                            setEditing( false );
                        }}
                        variant='outline-danger'
                >Cancel</Button>
            </div>
        }
        return <Button onClick={() => {  setEditing( true );   }}>Edit</Button>
    }

    return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex">
            <div className='flex-grow'>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Account Informations
                </h3>
            </div>

            <div>
                <ButtonContainer/>
            </div>
        </div>
        <div className="border-t border-gray-200 p-5 sm:px-6">
            <Alert variant={message.type} >{message.text}</Alert>
            <dl>
                <ProfileItem field='first_name' label='First Name' />
                <ProfileItem field='last_name' label='Last Name' />
                <ProfileItem field='email' label='Email' />
                <ProfileItem field='phone_number' label='Phone Number' />
                <div className='border-b border-gray-200'></div>
                <ProfileItem field='password' label='Password' />
            </dl>
        </div>



    </div>
}


function ChangePassword({onCancel}) {
    const [ data, setData ] = useState({ old_password : "", password: "", password_confirmation: ""})
    const [ errors, setErrors ] = useState({ } );

    const [ message, setMessage ] = useState( {text:'', type: 'success' } );
    const [ editing, setEditing ] = useState( false );
    const [ btn, setBtn ] = useState( { disabled: false, label: 'Save' } );

    var timeoutID = 0;

    function submitChangePassswordForm() {
        setBtn( { disabled: true, label: 'Saving...' } );
        var timeout = 2000;
        clearTimeout( timeoutID );
        User.submit_change_pass_data( data)
            .then( ({data}) => {
                console.log( data );
                setData( data.data );
                setEditing( false );
                setMessage({text: data.message, type: 'success'})
                setTimeout( () => setMessage({text: '', type: 'success'}), 2000 )

            }).catch( ({response}) => {
                timeout = 10000;
                setErrors( response.data.errors );
                setMessage({text: response.data.message, type: 'warning'})
            }).finally(( ) => {
                setBtn( { disabled: false, label: 'Save' } );
                if( timeout === 2000 )
                    setErrors({});

                timeoutID = setTimeout( ( ) => {
                    if( typeof onCancel =='function' && timeout === 2000 ) {
                        setData( { old_password : "", password: "", password_confirmation: ""} );
                        onCancel( );
                    }
                    setMessage({text: '', type: 'success'});
                }, timeout)
                setBtn({ disabled: false, label: 'Save' })
            });

    }


    return <div className='flex flex-col flex-grow w-full' >
        <div className='w-full flex'>
            <h2 className='font-bold text-gray-900 text-xl flex-grow'>Change Password</h2>
            <div>
                <Button
                    disabled={btn.disabled}
                    variant='success'
                    onClick={() => { submitChangePassswordForm() } }>{btn.label}</Button>
                <Button
                    className='ml-2'
                    variant='outline-danger'
                    onClick={() => { if( typeof onCancel =='function') onCancel(); } }>Cancel</Button>
            </div>
        </div>
        <Alert className='my-3' variant={message.type}>{message.text}</Alert>

        <div className='flex flex-col my-4 w-full'>
            <label className='text-gray-700'>Current Password</label>
            <InputField type='text' name='old_password'
                        onChange={ e => { setData( _values( data, e ) ) } } />
            <FieldError errors={errors} field='old_password'/>
        </div>

        <div className='flex flex-col my-4 w-full'>
            <label className='text-gray-700'>New Password</label>
            <InputField type='text' name='password'
                        onChange={ e => { setData( _values( data, e ) ) } } />
            <FieldError errors={errors} field='password'/>
        </div>

        <div className='flex flex-col my-4 w-full'>
            <label className='text-gray-700'>Confirm New Password</label>
            <InputField type='text' name='password_confirmation'
                        onChange={ e => { setData( _values( data, e ) ) } } />
            <FieldError errors={errors} field='password_confirmation'/>
        </div>

    </div>

}
