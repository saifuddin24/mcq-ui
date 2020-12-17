import {useEffect} from "react";
import {User} from "../helpers/db";
import {useState} from "react";

export default () => {

    var loading = true;
    const [ userdata, setData ] = useState( {} )

    useEffect(function () {
        User.get()
            .then( ({data}) => {
                loading = false;
                setData( data.data );
                console.log( data.data );
                console.log( 'pp', Object.keys( userdata ) );
            })
            .catch(({response}) => {
                console.log(response);
            })

    }, [ loading ]);


    // function ProfileItems() {
    //     if( userdata ) {
    //         var uKey = Object.keys( userdata );
    //         // return <div>{uKey[0]}: {userdata.email}</div>
    //         // return <div>dddddddddd</div>
    //
    //         Object.keys( userdata )
    //             .map( (key,i) => <ProfileItem key={i} item_value={userdata[key]} item_key={key}/> )
    //     }
    //
    //     return <div></div>;
    // }

    function ProfileItem({field, label}){
        if( userdata[field] !== undefined) {
            return <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                    {label}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {userdata[field] == null ? <span className='text-italic text-gray-400'>(Empty)</span>: userdata[field] }
                </dd>
            </div>
        }

        return ''
    }

    return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
                Account Informations
            </h3>
        </div>
        <div className="border-t border-gray-200">
            <dl>
                <ProfileItem field='first_name' label='First Name' />
                <ProfileItem field='last_name' label='Last Name' />
                <ProfileItem field='email' label='Email' />
                <ProfileItem field='phone_number' label='Phone Number' />
            </dl>
        </div>
    </div>
}
