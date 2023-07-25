import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import StoreHttp from "./store/store-http";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LobbyPage from "./components/lobby-page";
import ChangeUserDataForm from "./components/change-form";
import AuthForm from "./components/auth-form";
interface State {
    store: StoreHttp,
}
const store = new StoreHttp();

export const Context = createContext<State>({
    store,
})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
        <BrowserRouter>
            <Context.Provider value={{store}}>
                <Routes>
                    <Route path='/' element={<App/>}/>
                    <Route path='/change' element={<ChangeUserDataForm/>}/>
                    <Route path='/lobby' element={<LobbyPage />}/>
                    <Route path='/auth' element={<AuthForm />}/>
                </Routes>
            </Context.Provider>
        </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
