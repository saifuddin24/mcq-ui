import logo from './logo.svg';
import './App.css';
import {  Route, BrowserRouter as Router, Switch } from "react-router-dom";
import {Homepage} from "./pages";
import {Header} from "./components";


function App() {
  return (
    <div className="App">
        {/*<Router>*/}
        {/*    <Header/>*/}
        {/*    <Switch>*/}
        {/*        <Route path = "/" exact component={Homepage}/>*/}
        {/*        <Route path = "/about">About</Route>*/}
        {/*        <Route path = "/contact">Contact</Route>*/}
        {/*    </Switch>*/}
        {/*</Router>*/}

      <nav class="bg-gray-800">

        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

        </div>


        <div class="hidden sm:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900">Dashboard</a>
            <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Team</a>
            <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Projects</a>
            <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Calendar</a>
          </div>
        </div>
      </nav>

    </div>
  );
}

export default App;
