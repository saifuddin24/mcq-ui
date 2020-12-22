import {Quiz, User} from '../helpers/db';
import {useEffect, useState} from "react";
import {Button, Overly} from "../components/ui";
import Modal from "../components/modal";
import { ForgotPassword, Login, Registration, ResetPassword } from "./index";
import Cookie from "../helpers/Cookie";


export default ({reload, onLoginSuccess}) => {
    const [showModal, setShowModal] = useState(false);

    const [items, setItems ] = useState([]);
    const [currentPage, setCurrentPage ] = useState(1);
    const [perPage, setPerPage ] = useState(0 );
    const [totalRows, setTotalRows ] = useState(0 );
    const [params, setParams ] = useState({page_size:4, page:1} );
    const [currentData, setCurrentData ] = useState({ action:'', quizID:0 } );
    const [ loading, setLoading ] = useState( !reload );
    const [ overly, setOverly ] = useState({msg: '', show: true} );
    const cols = [ 'ID', 'Title', 'Categories', 'Status', 'Role', '' ];


    useEffect( () => {
        // loading = true;

        console.log( '---loading', loading );
        console.log( '---reload', reload );

        if( loading || reload > 0) {
            setOverly({msg: '', show: true});

            Quiz.get( params )
            .then(result => {
                setItems( result.data.items );
                const meta = result.data.meta;
                setPerPage( meta.per_page );
                setTotalRows( meta.total );
                console.log( result );
                setOverly({msg: '', show: false})
                //reload = false;
            }).catch(({response}) => {
                setOverly({msg: response.data.message, show: false});
            }).finally(() => {
                //reload = false;
                setLoading( false );
            })
        }


    }, [ loading, params, reload ] );


    //setParams({ page_size: 4, page: 1 });

    function TableItem({ item }) {
        return <tr className='flex flex-col md:table-row'>
            <td className="px-6 py-4 md:w-auto block md:table-cell">
                <div className="text-xl text-gray-900">
                    <span className='inline md:hidden font-bold'>{cols[0]}: </span>
                    <span className='text-green-600'>{item.id}</span>
                </div>
            </td>
            <td className="px-6 py-4 ">
                <div className="">
                    <div className="text-sm text-blue-700">
                        <span className='inline md:hidden font-bold'>{cols[1]}</span>{item.title}
                    </div>
                    <div className="text-sm text-gray-500">
                        Full Marks <span className='font-bold text-gray-800'>{item.full_marks}</span>,
                        Nagetive Mark:
                        <span className='font-bold text-gray-800'>
                            { item.negative_marks_each || 0 }
                            { item.negative_mark_type == 'percent' && item.negative_marks_each > 0
                                ? '%':''}
                        </span>
                    </div>

                </div>
            </td>
            <td className="px-6 py-4">
                <span className='inline md:hidden font-bold'>{cols[2]} </span>
                <div className="text-sm text-gray-400">{item.category_names.join( ', ' )}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                  <span className='inline-block mr-2 md:hidden font-bold'>{cols[3]} </span>
                <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active
                </span>
            </td>
            <td className="px-6 py-4">
                Admin
            </td>
            <td className="px-6 py-4 pb-10 md:pb-6 flex text-center md:table-cell whitespace-nowrap">
                <Button
                    className='mr-2 text-sm md:py-3 md:px-4' size={'sm'}
                    onClick={() => {
                        setShowModal( true );
                        setCurrentData({ action: 'learn', quizID: item.id } );
                    }}
                    variant='outline-success'>Learn More</Button>
                <Button className='ml-2 text-sm md:py-3 md:px-4' size={'sm'} variant='info'
                    onClick={() => {
                        setShowModal( true );
                        setCurrentData({ action: 'participate', quizID: item.id } );
                    }}
                >Participate</Button>
            </td>
        </tr>
    }


    return <div>
        <Modal size='4xl' show={showModal} >
            <QuizDetailsModal onLoggedIn={onLoginSuccess} data={currentData} onCloseClick={() => setShowModal(false)}/>
        </Modal>



        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="shadow py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <Pagination
                        className='bg-gray-50 px-4 py-2 flex-1 flex md:hidden items-center justify-between sm:rounded-lg sm:rounded-b-none'
                        perPage={perPage}
                        onPageChange={(page) => {
                            console.log( page );
                            setParams({ page, page_size: 4 });
                            // setCurrentPage( page )
                        }} totalRows={totalRows}/>

                    <div className="relative overflow-hidden border-b border-gray-200 md:rounded-lg sm:rounded-b-none sm">
                        <Overly show={overly.show}>
                            { overly.msg || 'Loading...' }
                        </Overly>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {cols[0]}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {cols[1]}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {cols[2]}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {cols[3]}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {cols[4]}
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {
                                    items.length > 0 ?
                                    items.map( item => <TableItem key={item.id} item={item}></TableItem> ):
                                    <tr>
                                        <td colSpan={10}>
                                            <div className='h-64 w-100 justify-center flex items-center text-xl text-gray-300'>No Quiz Found!</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        className='bg-gray-50 px-4 py-4 md:flex-1 md:flex sm:items-center sm:justify-between sm:rounded-lg sm:rounded-t-none'
                        perPage={perPage}
                        onPageChange={(page) => {
                            console.log( page );
                            setParams({ page, page_size: 4 });
                            // setCurrentPage( page )
                        }} totalRows={totalRows}/>

                </div>
            </div>


        </div>

    </div>
}

const lgSECTION = 'login';
const regSECTION = 'registration';
const startSECTION = 'start';

function QuizDetailsModal( { onCloseClick, data, onLoggedIn } ) {

    function closeThisPanel() {
        return typeof onCloseClick == 'function' ? onCloseClick():null;
    }

    function Title() {
        switch (data.action) {
            case 'learn':
            case 'participate':
                return <span>
                { quizdata.title || <span className='text-gray-300 text-sm text-decoration-italic'>Loading...</span>}
            </span>;
            //case 'participate': return <span>Participation in Quiz</span>;
        }
        return '';
    }


    const [ quizdata, setQuizData ] = useState( {});

    const [ loading, setLoading ] = useState( true );
    // var loading = true;

    useEffect(() => {
        if( loading ) {

            Quiz.find( data.quizID )
                .then( ({data}) => {
                    console.log( data );
                    setQuizData(  data.data );
                    setLoading( false );
                })
                .catch(({response}) => {
                    console.log( response )
                });
        }

    }, [loading] )


    return  <div
        style={{ height: '80vh', wordBreak: 'break-word', width: '100%', maxWidth: '95%'}}
        className="border-0 relative rounded-lg shadow-lg relative
        mx-auto
        flex flex-col w-full bg-white outline-none focus:outline-none">
        {/*header*/}

        <div
            className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-sm md:text-xl font-semibold"><Title/></h3>
            <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl
                leading-none font-semibold outline-none focus:outline-none"
                onClick={() => closeThisPanel() }
            >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block leading-none
                    outline-none focus:outline-none">&times;</span>
            </button>
        </div>
        {/*body*/}
        <div style={{overflowY:'scroll'}} className="relative p-6 flex-auto text-center">
            <Overly show={loading} opacity={90}>Loading...</Overly>
            <div className="flex flex-col md:flex-row text-sm text-green-700 justify-between">
                <div>Full Marks <span className='font-bold text-gray-800'>{quizdata.full_marks}</span></div>
                <div>Negative Marks for wrong answer {' '}
                    <span className='font-bold text-gray-800'>
                        { quizdata.negative_marks_each || 0 }
                        { quizdata.negative_mark_type == 'percent' && quizdata.negative_marks_each > 0 ? '%':''}
                    </span>
                </div>
            </div>
            {
                data.action == 'learn' &&
                <p className="my-4 text-gray-600 text-sm leading-relaxed text-justify">
                    {quizdata.description}
                </p>
            }

            <QuizBodySection onLoggedIn={onLoggedIn}/>
        </div>
        {/*footer*/}
        <div
            className="flex items-center justify-end px-6 py-4 border-t border-solid border-gray-300 rounded-b">
            <Button
                onClick={() => closeThisPanel()}
                variant='outline-danger'>Close</Button>
        </div>
    </div>
}


function QuizBodySection({onLoggedIn}) {
    const [ section, setSection ] = useState( startSECTION );
    const [ token, setToken ] = useState( null );

    function onStartClick() {
        console.log('RR: DATA', Cookie.getToken() );
        User.get( token )
            .then(({data}) => {
                console.log( data );
                startQuiz();
            })
            .catch( ({response}) => {
                console.log( response );
                setSection( lgSECTION );
            })

    }

    function startQuiz() {
        console.log( '_______________This is ok______________' );
        setSection('ready');
    }

    function onLoginSuccess( data ) {
        if( typeof onLoggedIn == 'function' ){
            onLoggedIn()
        }

        var token = data.access_token || data.token;
        setToken( token );
        console.log('RR: DATA', token );
        console.log('RR: DATA', data );

        startQuiz();
    }

    return   <div>
        <div className='text-left '>
            { section == regSECTION &&
                <Registration
                    onLoginSuccess={onLoginSuccess}
                    title='Sign in to participate'
                    logo={false}
                    onLoginBtnClick={() => {setSection(lgSECTION)}}
                ></Registration>
            }
            { section == lgSECTION &&
                <Login
                    onLoginSuccess={onLoginSuccess}
                    title='Login to participate'
                    logo={false}
                    onRegisterBtnClick={() => {setSection(regSECTION)}}
                ></Login>
            }
        </div>
        { section == startSECTION &&
        <div className='pt-4 md:pt-8'>
            <p>Are you ready to start?</p>

            <Button variant='info' size='xl' onClick={onStartClick}>Start</Button>
        </div>
        }
        { section == 'ready' && <p>Ready to start...</p> }
    </div>
}

function Pagination({  onPrevClick, onNextClick, onPageChange, totalRows, perPage, className }){

    perPage = perPage || 0;
    const numOfPage = totalRows % perPage == 0 ?
        totalRows / perPage : Math.floor( totalRows / perPage ) + 1;

    const [ activePage, setActivePage ] = useState( 1 );
    // if( typeof onPageChange == 'function')
    //     onPageChange( activePage );

    function changePage( dir ) {
        var changed = false;
        if( dir == 1 && activePage < numOfPage  ) {
            changed = true;
            setActivePage( activePage + 1 )
            if( typeof onPrevClick == 'function' )
                onNextClick( activePage + 1 );
                onPageChange( activePage + 1 );
        }else if ( dir == -1 && activePage > 1 ){
            changed = true;
            setActivePage( activePage - 1 );
            if( typeof onPrevClick == 'function' )
                onPrevClick( activePage - 1 );
                onPageChange( activePage - 1 );
        }
    }

    return <div className={className}>



        <div>
            <p className="text-sm text-gray-700">
                Showing {perPage} of page <span className="font-medium"> {activePage} </span>
                of total
                <span className="font-medium"> {totalRows} </span>
                quizzes
            </p>
        </div>
        <div>
            <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                <a href=""
                   onClick={(e) => {
                       e.preventDefault();
                       changePage( -1 );
                   }}
                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                         fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"/>
                    </svg>
                </a>
                {/*<a href="#"*/}
                {/*   className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">*/}
                {/*    1*/}
                {/*</a>*/}
                {/*<span*/}
                {/*    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">*/}
                {/*  ...*/}
                {/*</span>*/}
                {/*<a href="#"*/}
                {/*   className="hidden md:inline-flex relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">*/}
                {/*    8*/}
                {/*</a>*/}

                <a href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       changePage( 1 );
                   }}
                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>

                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                         fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"/>
                    </svg>
                </a>
            </nav>
        </div>
    </div>
}
