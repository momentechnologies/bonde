import React from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
    const rootElemRef = React.useRef(null);

    if (!rootElemRef.current) {
        rootElemRef.current = document.createElement('div');
    }

    React.useEffect(() => {
        document.body.appendChild(rootElemRef.current);

        return () => {
            rootElemRef.current.remove();
        };
    }, []);

    return ReactDOM.createPortal(children, rootElemRef.current);
};

export default Portal;
