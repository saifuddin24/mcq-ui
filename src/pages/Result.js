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

    function AnswerItem({ans, index}) {
        return (
            <div className={'mb-5'}>
                <p className='text-xl'><span>{ index+1 }.</span> <span>{ans.question}</span></p>
                <div className='ml-2 text-sm'>
                    {ans.options && ans.options.map( opt =>
                        <p className={ansClass(ans, opt.opt)}>
                            <span>{opt.opt}</span> <span>{opt.value}</span>
                        </p>
                    )}
                    {/*"given_answer":"1","right_answer":"1","not_answered":0,"is_correct":1,"mark_obtained":2.5,"question*/}
                    { ans.given_answer ?
                        <p className='pt-2 text-blue-500'>Given: {ans.given_answer} Right: {ans.right_answer} Obtained: {ans.mark_obtained}</p>:
                        <p className='pt-2 text-purple-500'>You didn't any answer </p>
                    }
                </div>
            </div>
        )
    }

    function ansClass( ans, opt){
        if( ans.given_answer == opt ) {
            console.log('ansClass', ans.given_answer, opt, ans.right_answer );
            return 'font-semibold '+ (ans.right_answer == opt ? 'text-green-500': 'text-red-500 line-through');
        }else if( ans.right_answer == opt ) {
            return 'font-bold text-blue-800';
        }

        return '';
    }


    {/*full_mark":25,"negative_marks_each":25,
        "negative_mark_type":"percent",
        "each_question_mark":2.5,
        "question_count":null,
        "answer_count":10,"total_mark_obtained":16.875*/}
    let negative_marking = 0;
    let mark_each = Number( data.each_question_mark );
    let negative_marks_each = Number( data.negative_marks_each );

    if( data.negative_mark_type == 'percent' ) {
        negative_marking = ( mark_each * ( negative_marks_each/100 ) );
    }else if( negative_marks_each ) {
        negative_marking = negative_marks_each;
    }

    return <div>



        <div className="flex flex-col bg-white p-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="shadow py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">

                    <div className="pb-3 relative overflow-hidden" style={{minHeight: '420px'}}>
                        <Overly show={overly.show}>
                            { overly.msg || 'Loading...' }
                        </Overly>
                        <div className='border border-green-300 mb-4 p-5'>

                            <p className='text-xl'>Obtained Mark: {data.total_mark_obtained}</p>
                            <p>Full Mark: {data.full_mark}</p>
                            <p>Each Question Mark: {data.each_question_mark}</p>
                            <p>Negative Marking: {negative_marking}</p>

                        </div>

                        <div>
                            {data.answer_list && data.answer_list.map( (ans,i) =>
                                <AnswerItem ans={ans} key={i} index={i}></AnswerItem>
                            )}
                        </div>

                        {/*<p>Ok...{ JSON.stringify( data ) }</p>*/}

                    </div>


                </div>
            </div>
        </div>
    </div>
}
