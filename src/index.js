import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import axios from 'axios';

import * as helper from './helper';
import { AuthContextProvider } from './context/authContextRedux';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
const apiHeader = { 'Content-Type': 'multipart/form-data' };

global.config = {
    properties: {
        baseURL: window.location.origin + '/',
        assetPath: 'http://localhost:3000/',
        apiHeader: apiHeader,
    },
    methods: helper
}

axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true;
axios.defaults.headers = apiHeader;

root.render(
    <React.StrictMode>
        <AuthContextProvider>
			<App/>
        </AuthContextProvider>
    </React.StrictMode>
);