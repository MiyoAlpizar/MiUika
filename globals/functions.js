
export function FormatCurrency(n, x) {
    const re = `\\d(?=(\\d{${x || 3}})+${n > 0 ? '\\.' : '$'})`;
    return n.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isBool(bool) {
    return typeof bool === 'boolean' ||
        (typeof bool === 'object' && typeof bool.valueOf() === 'boolean');
}

export function isTextValid(text, min = 0) {
    if (text === null) {
        return false;
    }
    if (text.trim().length < min) {
        return false;
    }

    return true;
}

export function CrateJSONProp(prop, val) {
    let jsonStr = '';
    if (isBool(val) || isNumeric(val)) {
        jsonStr = `{"${prop}":${val}}`;
    } else {
        let value = '';
        if (val != null) {
            value = val;
        }
        jsonStr = `{"${prop}":"${value.trim()}"}`;
    }


    return JSON.parse(jsonStr);
}

