import { useWindowSize } from 'moment-hooks';
import breakpoints from '../config/size';

const allowedSigns = ['<', '<=', '=', '>=', '>'];

export default (...args) => {
    const { width } = useWindowSize();
    let sign = '=';
    let breakpoint = '';

    if (args.length === 1) {
        breakpoint = args[0];
    } else {
        sign = args[0];
        breakpoint = args[1];
    }

    const wantedSize = breakpoints[breakpoint];

    if (wantedSize === undefined) {
        throw new Error(
            `Invalid breakpoint. Valid values are (${Object.keys(
                breakpoints
            ).join(', ')})`
        );
    }

    if (allowedSigns.indexOf(sign) === -1) {
        throw new Error(
            `Invalid sign. Valid values are (${allowedSigns.join(', ')})`
        );
    }

    if (sign === '<') {
        return width < wantedSize;
    }

    const nextSize = Object.values(breakpoints)
        .filter(x => x > wantedSize)
        .reduce(
            (smallest, current) =>
                smallest == null || smallest > current ? current : smallest,
            null
        );

    const isEqual = width >= wantedSize && width < nextSize;

    if (sign === '<=') {
        return width < wantedSize || isEqual;
    }

    if (sign === '=') {
        return isEqual;
    }

    if (sign === '>=') {
        return width >= wantedSize;
    }

    if (sign === '>') {
        return width >= nextSize;
    }

    throw new Error('Something strange went passed validation');
};
