import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react';
import { RecoilRoot } from 'recoil';
import 'flowbite';

createRoot(document.getElementById('root')).render(
    <RecoilRoot>
    <App />
    </RecoilRoot>
)
