import { useState, useEffect } from 'react';
import appConfig from '../config/app';

const getBoundingRect = () =>
    appConfig.isServerSide
        ? { top: 0, left: 0 }
        : document.body.getBoundingClientRect();

export default () => {
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [bodyOffset, setBodyOffset] = useState(getBoundingRect());
    const [scrollY, setScrollY] = useState(bodyOffset.top);
    const [scrollX, setScrollX] = useState(bodyOffset.left);
    const [scrollDirection, setScrollDirection] = useState();

    const listener = e => {
        setBodyOffset(getBoundingRect());
        setScrollY(-bodyOffset.top);
        setScrollX(bodyOffset.left);
        setScrollDirection(lastScrollTop > -bodyOffset.top ? 'down' : 'up');
        setLastScrollTop(-bodyOffset.top);
    };

    useEffect(() => {
        window.addEventListener('scroll', listener);
        return () => {
            window.removeEventListener('scroll', listener);
        };
    });

    return {
        scrollY,
        scrollX,
        scrollDirection,
    };
};
