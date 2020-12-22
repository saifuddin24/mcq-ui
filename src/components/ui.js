import {useState} from "react";

function Button( props ) {

    function sizeClass() {
        switch ( props.size ) {
            case 'xs': return ' px-2 py-1 text-xs ';
            case 'sm': return ' px-3 py-2 text-sm ';
            case 'x': return ' px-4 py-3  text-sm ';
            case 'xl': return ' px-5 py-4 text-base ';
            case 'xxl': return ' px-6 py-5 text-lg ';
            default: return ' px-3 py-2 text-sm'
        }
    }

    function colorsClass() {

        if( props.disabled || props.disabled === true || props.disabled === 'true' ) {
            return 'bg-gray-300 text-gray-400 cursor-default';
        }

        switch ( props.variant ) {
            case 'success': return ' bg-green-300 hover:bg-green-400 text-indigo-600 hover:text-indigo-900';
            case 'outline-success': return 'border border-green-300 hover:bg-green-300 text-indigo-600 hover:text-indigo-900';
            case 'info': return '  bg-blue-400 hover:bg-blue-500 text-indigo-900 hover:text-indigo-900';
            case 'outline-info': return 'border  border-blue-400 hover:bg-blue-400 text-indigo-900 hover:text-indigo-900';
            case 'danger': return ' bg-red-600 hover:bg-red-700 text-indigo-600 hover:text-indigo-900';
            case 'outline-danger': return 'border border-red-600 hover:bg-red-700 text-red-600 hover:text-indigo-100';
            case 'warning': return 'bg-yellow-400 hover:bg-yellow-500 text-indigo-600 hover:text-indigo-900';
            case 'outline-warning': return 'border border-yellow-400 hover:bg-yellow-500 text-yellow-400 hover:text-gray-100';
            default: return ' bg-green-300 hover:bg-green-400 text-indigo-600 hover:text-indigo-900'
        }
    }

    var attrs = {};

    Object.keys( props ).map( key => (key != 'className') ? attrs[key] = props[key]:null );
    attrs.className =  'outline-none leading-none rounded-sm ' + colorsClass() + ' ' + sizeClass() + ' ' + props.className;

    return <button {...attrs}>{props.children}</button>
}

function InputField( props ) {
    var customClass = "appearance-none relative block w-full px-3 py-2 border " +
        "border-gray-300 placeholder-gray-500 text-gray-900 rounded-md " +
        "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"

    const attrs = {};
    Object.keys( props ).map( key => (key != 'className') ? attrs[key] = props[key]:null );
    attrs.className = customClass + ' '+ props.ClassName;

    return <input {...attrs}/>
}


function FieldError({errors, field}) {
    errors = errors || {};

    if( errors[field] ) {
        const errs = errors[field];
        if( typeof errs.map != 'function' )
            return '';

        return <div className='text-sm text-red-800'>
            {errs.map( (err, i) => <p key={i} className='my-0 mb-1 py-0'>{err}</p> )}
        </div>
    }
    return '';
}


function  Alert({variant, children, className }){
    const [ expired, setExpired ] = useState( 0 );

    function getVariant() {
        switch ( variant ) {
            case 'success': return ' bg-green-300 text-green-700 border border-green-300';
            case 'outline-success': return 'border border-green-300 text-green-300';
            case 'info': return '  bg-blue-400 text-blue-900 border border-blue-900';
            case 'outline-info': return 'border border-blue-400 text-blue-400';
            case 'danger': return ' bg-red-600 text-red-900 border border-red-900';
            case 'outline-danger': return 'border border-red-600 text-red-600';
            case 'warning': return 'bg-yellow-500 text-yellow-100 border border-yellow-700';
            case 'outline-warning': return 'border border-yellow-400 text-yellow-400';
            default: return ' bg-green-300 text-green-700 border border-green-300'
        }
    }


     if( children ) {
         return <p className={'text-center mt-2 shadow-sm '+ getVariant() + ' py-2 px-1 ' + className}>
             {children}
         </p>
     }
     return '';
}

function Overly({show, color,colorVariant, opacity, children, z}) {
    function getColor() {
        return (color || 'gray') + '-' + ( colorVariant || '300');
    }

    if( !show ) return '';

    return <div className={'absolute inset-0 bg-'
            + getColor() + ' z-'+( z || '40' )+' opacity-'+( opacity || '40' )
            +' flex items-center justify-center'}>
        {children}
    </div>
}

export {Button, InputField, FieldError, Alert, Overly};
