import navs from '../app-contents/nav-items.js';
import {  Link, NavLink } from "react-router-dom";
import React from "react";
import Cookie from "../helpers/Cookie";
import db, {User} from "../helpers/db";

export default () => {





    function UserArea() {

        if( Cookie.isLoggedIn( ) ){
            return  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                </button>
                < UserMenu />
            </div>
        }else {
            return <div className='flex'>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <NavLink className='block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700'
                             activeClassName='bg-green-900 text-green-100'
                             to='/login'>Login</NavLink>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <NavLink className='block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700'
                             activeClassName='bg-green-900 text-green-100'
                             to='/registration'>Registration</NavLink>
                </div>
            </div>
        }


    }

    return <nav className="bg-blue-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <button data-target="#main-menu-mobile" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>

                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>

                        <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex-shrink-0 flex items-center">
                        <img className="block lg:hidden h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow"/>
                        <img className="hidden lg:block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg" alt="Workflow"/>
                    </div>
                    <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4 text">
                            { navs && navs.map( item => { return <NavItem options={item.options} link={item.link}>{item.title}</NavItem> } ) }
                        </div>
                    </div>
                </div>

                <UserArea/>
            </div>
        </div>

        <div className="sm:block" id="main-menu-mobile" data-hidden='true'>
            <div className="px-2 pt-2 pb-3 space-y-1">
                { navs && navs.map( item => { return <NavItem options={item.options} link={item.link}>{item.title}</NavItem> } ) }
            </div>
        </div>
    </nav>
}

function NavItem({children, link, options}){
    return <NavLink exact={options.exact} to={link}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700"
                    activeClassName="text-gray-100 bg-gray-900"
    >{children}</NavLink>
}


function UserMenu(){

    function  onLogoutClick(e){

        e.preventDefault();
        User.logout( )
            .then( ({data}) => {
                console.log( data );
                Cookie.logout();
                setTimeout(function () {
                    window.location.href = '/';
                }, 500)
            })
            .catch( ({response}) => {
                console.log( response );
            })

    }

    return <div className="ml-3 relative">
        <div>


            <button
                data-target="#user-profile-menu"
                className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu" aria-haspopup="true">
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full border-1" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
            </button>
        </div>

        <div id="user-profile-menu" data-hidden
             className={'origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5'}
             role="menu" aria-orientation="vertical"
             aria-labelledby="user-menu">
            <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</NavLink>
            <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</NavLink>
            <a href="" onClick={onLogoutClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
        </div>

    </div>
}

export { UserMenu }
