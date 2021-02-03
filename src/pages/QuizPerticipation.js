import {Quiz} from '../helpers/db';
import {useEffect, useState} from "react";
import {Button, Overly} from "../components/ui";
import { useParams } from "react-router-dom";

export default ({reload, onQuizDataLoad}) => {
    const [ showModal, setShowModal] = useState(false);
    const [ data, setData ] = useState({});
    const [ questions, setQuestions ] = useState([]);
    const [ remainingQuestions, setRemainingQuestions ] = useState(-1 );
    const [ currentQuestion, setCurrentQuestion ] = useState({});
    const [ params, setParams ] = useState({page_size:4, page:1} );
    const [ loading, setLoading ] = useState( !reload );
    const [ overly, setOverly ] = useState({msg: '', show: true} );
    let { id } = useParams( );

    useEffect( () => {

        if( loading || reload > 0) {
            setOverly({ show: true});
            const p = params;
            Quiz.take( {
                "quiz_id": id
            })
            .then( ({data}) => {
                console.log( "ROOOOOP", data);

                if( typeof onQuizDataLoad == 'function' )
                    onQuizDataLoad( { title: data.quiz.title,  quiz: data.quiz, questions: data.questions } );

                setData( data.data );
                setQuestions( data.questions || [] );
                updateQuestionStatus( data.questions );
                setOverly({msg: '', show: false} );

            }).catch(({response}) => {
                console.log( 'ERR', response );
                setOverly({msg: response?.data.message, show: false});
            }).finally(() => {
                //reload = false;
                setLoading( false );
            })
        }


    }, [ loading, params, reload ] );


    function submitAnswer( ) {

        console.log( currentQuestion );

        setOverly({ msg: 'Submitting...' + data.id + ' ' + currentQuestion.question_id, show: true });

        Quiz.give_answer( id, { answer: 3, participation_id: data.id, question_id: currentQuestion.question_id } )
        .then( ({data}) => {
            console.log( "ROOOOOP-answer", data);

            //setQuestions( data.questions || [] );

            //updateQuestionStatus( data.questions );

            setOverly({msg: '', show: false} );

        }).catch(({response}) => {

            console.log( 'ERR', response );

            setOverly({msg: response?.data.message, show: false});

        }).finally(() => {
            //reload = false;
            setLoading( false );
        })

    }

    function updateQuestionStatus( quests ){
        setRemainingQuestions( quests.length );

        //alert( quests.length );
        if( quests.length > 0 ) {
            setCurrentQuestion( quests[ 0 ] );
        }
    }

    //setParams({ page_size: 4, page: 1 });

    function AnswerOption( { option } ) {
        return (
            <div>({ option.opt }) { option.value }</div>

        )
    }

    function AnswerOptionControl( { option } ) {
        return (
            <div>({ option.opt })</div>
        )
    }



    return <div>
        {/*<Modal size='4xl' show={showModal} >*/}
        {/*    <QuizDetailsModal onLoggedIn={onLoginSuccess} data={currentData} onCloseClick={() => setShowModal(false)}/>*/}
        {/*</Modal>*/}



        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="shadow py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">

                    <div className="relative overflow-hidden border-b border-gray-200 md:rounded-lg sm:rounded-b-none sm">
                        <Overly show={overly.show}>
                            { overly.msg || 'Loading...' }
                        </Overly>

                        <div className='flex flex-col'>
                            <h2 className='text-xl'>{currentQuestion.title}</h2>
                            <div className='flex flex-col'>
                                { currentQuestion.answer_options &&
                                    currentQuestion.answer_options.map( ( opt, i ) =>
                                        <AnswerOption option={opt} key={i}></AnswerOption> )}
                            </div>
                            <div className='flex'>
                                { currentQuestion.answer_options &&
                                    currentQuestion.answer_options.map( ( opt, i ) =>
                                        <AnswerOptionControl option={opt} key={i}></AnswerOptionControl> )}
                            </div>
                        </div>

                        <div>
                            <Button onClick={ ( e ) => { e.preventDefault(); submitAnswer( ) }}>Next</Button>
                        </div>

                        <p>Ok...{JSON.stringify( currentQuestion )}</p>
                    </div>


                </div>
            </div>
        </div>
    </div>
}
