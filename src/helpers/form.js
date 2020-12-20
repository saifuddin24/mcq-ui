import {default as React, useState} from "react";

function _values( values, e) {
    if( values instanceof Object ) {
        values[e.target.name] = e.target.value;
    }
    return values;
}

export { _values };
