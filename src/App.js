import logo from './logo.svg';
import './App.css';
import {  Route, BrowserRouter as Router, Switch } from "react-router-dom";
import {Homepage, About, Contact, ForgotPassword, Login, Profile, QuizList, Registration, ResetPassword, Subjects, Settings, QuizPerticipation}
from "./pages";
import {Header} from "./components";
import {useState, useEffect} from "react";
import {init} from "./helpers/dom";
import Cookie from "./helpers/Cookie";



function App() {

    const [ loadCounter, setLoadCounter ] = useState( false);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false );


    useEffect( () => {
        init();
    });

    function setLoggedIn() {
        console.log( '-----------d-------------', Cookie.getToken() );
        setIsLoggedIn( true );
    }

  return (
    <div className="App">
        <Router basename={window.ROUTER_BASE || ''} >
            <Header isLoggedIn={isLoggedIn}/>
            <Switch>

                <Route path = "/" exact >
                    <PageHeader>Quiz List</PageHeader>
                    <PageContent><Homepage/></PageContent>
                </Route>

                <Route path = "/about">
                    <PageHeader>Abour Us</PageHeader>
                    <PageContent><About/></PageContent>
                </Route>

                <Route path = "/contact">
                    <PageHeader>Contact</PageHeader>
                    <PageContent><Contact/></PageContent>
                </Route>

                <Route path = "/participate/:id">

                    <ParticipationPage/>

                    {/*<PageHeader className='flex align-center'>*/}
                    {/*    <div className='flex flex-grow'>*/}
                    {/*        {JSON.stringify( pageData )}*/}
                    {/*        {headerTitle}*/}
                    {/*    </div>*/}
                    {/*</PageHeader>*/}
                    {/*<PageContent>*/}
                    {/*    <QuizPerticipation onQuizDataLoad={( data ) => {*/}
                    {/*        setHeaderTitle( data.title );*/}
                    {/*        setPageConfig( 'participation', data )*/}
                    {/*    }}/>*/}
                    {/*</PageContent>*/}
                </Route>

                <Route path = "/quizzes">
                    <PageHeader className='flex align-center'>
                        <div className='flex flex-grow'>Quiz List</div>
                        <div className='flex flex-grow-0'>
                            <button onClick={() => setLoadCounter( loadCounter + 1 )}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M20.944 12.979c-.489 4.509-4.306 8.021-8.944 8.021-2.698 0-5.112-1.194-6.763-3.075l1.245-1.633c1.283 1.645 3.276 2.708 5.518 2.708 3.526 0 6.444-2.624 6.923-6.021h-2.923l4-5.25 4 5.25h-3.056zm-15.864-1.979c.487-3.387 3.4-6 6.92-6 2.237 0 4.228 1.059 5.51 2.698l1.244-1.632c-1.65-1.876-4.061-3.066-6.754-3.066-4.632 0-8.443 3.501-8.941 8h-3.059l4 5.25 4-5.25h-2.92z"/>
                                </svg>
                            </button>
                        </div>
                    </PageHeader>
                    <PageContent><QuizList onLoginSuccess={setIsLoggedIn} reload={loadCounter} /></PageContent>
                </Route>

                <Route path = "/subjects">
                    <PageHeader>Subjects</PageHeader>
                    <PageContent><Subjects/></PageContent>
                </Route>
                <Route path = "/Settings">
                    <PageHeader>Settings</PageHeader>
                    <PageContent><Settings/></PageContent>
                </Route>

                <Route path = "/profile">
                    <PageHeader>Profile</PageHeader>
                    <PageContent><Profile/></PageContent>
                </Route>
                <Route path = "/user">
                    <PageHeader>Contact Us</PageHeader>
                    <PageContent><Contact/></PageContent>
                </Route>

                <Route path = "/login">
                    {/*<PageHeader center>Login</PageHeader>*/}
                    <PageContent><Login/></PageContent>
                </Route>

                <Route path = "/registration">
                    {/*<PageHeader center>Login</PageHeader>*/}
                    <PageContent><Registration/></PageContent>
                </Route>

            </Switch>
        </Router>

    </div>
  );
}


function ParticipationPage() {
    const [ headerTitle, setHeaderTitle ] = useState( "Loading...");

    return <div className='flex align-center flex-col'>
        <PageHeader className='flex align-center'>
            <div className='flex flex-grow'>
                {headerTitle}
            </div>
        </PageHeader>
        <PageContent>
        <QuizPerticipation onQuizDataLoad={( data ) => {
            console.log( 'DATAAAAA', data );
            setHeaderTitle( data.title );
        }}/>
        </PageContent>
    </div>
}

function PageContent({children}) {
    return <main className='bg-blue-100'>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

            <div className="px-4 py-6 sm:px-0">
                <div className="">
                    {children}
                </div>
            </div>

        </div>
    </main>
}

function PageHeader({children, center, className, style}) {
    console.log(  'center',center)
    var  cen = center === true ?  'text-center': '';
    return <header className={ 'bg-white shadow ' + cen }>
        <div className={'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ' + className} style={style} >
            <div className="flex flex-grow text-3xl font-bold leading-tight text-gray-900">
                {children}
            </div>
        </div>
    </header>
}


export default App;

export {PageHeader}
