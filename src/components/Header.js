import {Link} from "react-router-dom";

export default () => {
    return <header className='App-header'>
        <h2>Quiz Circle</h2>
        <ul className='text-gray-600'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About Us</Link></li>
            <li><Link to='/quizzes'>Quizzes</Link></li>
            <li><Link to='/subject'>Subjecs</Link></li>
        </ul>
    </header>
}
