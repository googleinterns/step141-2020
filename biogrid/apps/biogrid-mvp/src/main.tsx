import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/app';

// declare let GlobalFetch;
declare module 'node-fetch' {
    const fetch: GlobalFetch['fetch'];
    export default fetch;
}

ReactDOM.render(<App />, document.getElementById('root'));
