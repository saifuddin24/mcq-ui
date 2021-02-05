import {Quiz} from '../helpers/db';
import {useEffect, useState} from "react";
import {Button, Overly} from "../components/ui";
import { useParams } from "react-router-dom";

export default ({ reload }) => {
    const [ showModal, setShowModal] = useState(false);
    const [ data, setData ] = useState({});
    const [ loading, setLoading ] = useState( !reload );
    const [ overly, setOverly ] = useState({msg: '', show: true} );
    let { participation_id } = useParams( );

    useEffect( () => {

        if( loading || reload > 0) {
            setOverly({ show: true});
            Quiz.result( participation_id, {})
                .then( ({data}) => {
                    console.log( "ROOOOOP-answer", data);

                    setData( data.data || { } );

                    setOverly({msg: '', show: false} );

                }).catch(({response}) => {

                console.log( 'ERR', response );

                setOverly({msg: response?.data.message, show: false});

            }).finally(() => {
                //reload = false;
                setLoading( false );
            })
        }
    }, [ loading, reload ] );



    return <div>

        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="shadow py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">

                    <div className="pb-3 relative overflow-hidden border-b border-gray-200 md:rounded-lg sm:rounded-b-none sm">
                        <Overly show={overly.show}>
                            { overly.msg || 'Loading...' }
                        </Overly>
                        <div>

                            <p>Obtained Mark: {data.total_mark_obtained}</p>
                            <p>Full Mark: {data.full_mark}</p>

                        </div>

                        {/*<p>Ok...{JSON.stringify( data )}</p>*/}
                    </div>


                </div>
            </div>
        </div>
    </div>
}
