import {Quiz} from '../helpers/db';
import {useEffect, useState} from "react";
import {Button, Overly} from "../components/ui";
import { useParams, useHistory } from "react-router-dom";

export default ({reload, onQuizDataLoad}) => {
    const [ showModal, setShowModal] = useState(false);
    const [ data, setData ] = useState({});
    const [ questions, setQuestions ] = useState([]);
    const [ remainingQuestions, setRemainingQuestions ] = useState(-1 );
    const [ currentQuestion, setCurrentQuestion ] = useState({});
    const [ params, setParams ] = useState({page_size:4, page:1} );
    const [ loading, setLoading ] = useState( !reload );
    const [ overly, setOverly ] = useState({msg: '', show: true} );
    const [ answerPosition, setAnswerPosition ] = useState( -1 );
    let { id } = useParams( );
    const history = useHistory();

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

        setOverly({ msg: 'Submitting...', show: true });

        const participation_id = data.id;

        Quiz.give_answer( id, {
            answer : answerPosition,
            participation_id : data.id,
            question_id : currentQuestion.question_id,
            remaining : remainingQuestions
        })
        .then( ({data}) => {
            console.log( "ROOOOOP-answer", data);

            //setQuestions( data.questions || [] );

            if( data.action = 'answer_given' ) {
                setAnswerPosition( -1 );
                questions.splice(0, 1 );
                updateQuestionStatus( questions );

                console.log( questions, questions.length )

                if( questions.length == 0 ) {
                    setOverly({ msg: 'Completed', show: true });
                    setTimeout(() => {
                        history.push( '/result/' + participation_id );
                    }, 1500)
                }
            }

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

    function changeAnswer(e) {
        setAnswerPosition( e.target.value );
    }

    function AnswerOptionControl( { option, position } ) {
        return (
            <div className={'relative p-2 mr-2 border border-blue-900 cursor-pointer ' + (answerPosition==position? 'bg-green-800 text-white':'')}>
                <label className='block' style={{height: '100%', width: '100%'}}>
                    <input type='radio' name='answer' checked={answerPosition==position}
                           value={position} onChange={(e) => {changeAnswer(e)} } />
                    ({ option.opt })
                </label>
            </div>
        )
    }



    return <div>
        {/*<Modal size='4xl' show={showModal} >*/}
        {/*    <QuizDetailsModal onLoggedIn={onLoginSuccess} data={currentData} onCloseClick={() => setShowModal(false)}/>*/}
        {/*</Modal>*/}



        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="shadow py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">

                    <div className="pb-3 relative overflow-hidden border-b border-gray-200 md:rounded-lg sm:rounded-b-none sm">
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
                            <div className='flex my-2'>
                                { currentQuestion.answer_options &&
                                    currentQuestion.answer_options.map( ( opt, i ) =>
                                        <AnswerOptionControl option={opt} key={i} position={i}></AnswerOptionControl> )}
                            </div>
                        </div>

                        <div className='flex justify-center'>
                            <Button size='xl' disabled={overly.show} onClick={ ( e ) => { e.preventDefault(); submitAnswer( ) }}>Next</Button>
                        </div>

                        {/*<p>Ok...{JSON.stringify( currentQuestion )}</p>*/}
                    </div>


                </div>
            </div>
        </div>
    </div>
}
