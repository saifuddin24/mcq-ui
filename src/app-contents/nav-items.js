import {Homepage} from "../pages";

export default [
    {
        title: 'Home',
        link: '/',
        component: Homepage,
        options: {exact: true},
        parents: []
    },
    {
        title: 'About Us',
        link: '/about',
        options: {},
        parents: []
    },
    {
        title: 'MCQ',
        link: '/quizzes',
        options: {},
        parents: []
    },
    {
        title: 'Subject',
        link: '/subjects',
        options: {},
        parents: []
    }
]
