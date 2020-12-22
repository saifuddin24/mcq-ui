import React, {useEffect} from "react";

export default ({children, show, size}) => {
    const [showModal, setShowModal] = React.useState(false);
    var loaded = false;
    //setShowModal( show );

    useEffect(()=>{
        setShowModal( show );
        loaded = true;
    }, [!loaded, show])

    function getSize(){
        switch (size) {
            case 'xl': return 'max-w-xl';
            case '2xl': return 'max-w-2xl';
            case '3xl': return 'max-w-3xl';
            case '4xl': return 'max-w-4xl';
            case '5xl': return 'max-w-5xl';
            case '6xl': return 'max-w-6xl';
            default: return 'max-w-3xl';
        }
    }

    return (
        <>

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden
                    overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className={'relative w-auto mx-auto w-full ' + getSize() }>
                            {/*content*/}
                            {children}
                        </div>
                    </div>
                    <div onClick={() => setShowModal(false)} className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
