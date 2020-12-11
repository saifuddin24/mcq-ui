import logo from './logo.svg';
import './App.css';
import {  Route, BrowserRouter as Router, Switch } from "react-router-dom";
import {Homepage, About, Contact, ForgotPassword, Login, Profile, QuizList, Registration, ResetPassword, Subjects, Settings} from "./pages";
import {Header} from "./components";
import {useState, useEffect} from "react";
import {init} from "./helpers/dom";


function App() {
    useEffect( () => {
        init();
    });

  return (
    <div className="App">
        <Router>
            <Header/>
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

                <Route path = "/quizzes">
                    <PageHeader>Quiz List</PageHeader>
                    <PageContent><QuizList/></PageContent>
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
                    <PageHeader>Settings</PageHeader>
                    <PageContent><Settings/></PageContent>
                </Route>
                <Route path = "/user">
                    <PageHeader>Contact Us</PageHeader>
                    <PageContent><Settings/></PageContent>
                </Route>
            </Switch>
        </Router>

    </div>
  );
}

function PageContent({children}) {
    return <main className='bg-gray-100'>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

            <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                    {children}
                </div>
            </div>

        </div>
    </main>
}

function PageHeader({children}) {
    return <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                {children}
            </h1>
        </div>
    </header>
}


export default App;

export {PageHeader}
