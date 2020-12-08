import logo from './logo.svg';
import './App.css';
import {  Route, BrowserRouter as Router, Switch } from "react-router-dom";
import {Homepage} from "./pages";
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
                <Route path = "/" exact component={Homepage}>

                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                                Quiz List
                            </h1>
                        </div>
                    </header>

                    <main className='bg-gray-300'>
                        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                            <div className="px-4 py-6 sm:px-0">
                                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
                            </div>

                        </div>
                    </main>

                </Route>
                <Route path = "/about">About</Route>
                <Route path = "/contact">Contact</Route>
                <Route path = "/about">Profile</Route>
                <Route path = "/quizzes">Quiz List</Route>
                <Route path = "/subjects">Subjects</Route>
                <Route path = "/settings">Subjects</Route>
                <Route path = "/profile">Profile</Route>
                <Route path = "/contact">Contact</Route>
            </Switch>
        </Router>

    </div>
  );
}

export default App;
