import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {IUser} from "./models/i-user";
import {useNavigate} from "react-router";
import StoreSocket from "./store/store-socket";
import AuthForm from "./components/auth-form";
import MainPage from "./components/main-page";
const App = () => {
    const {socket} = useContext(StoreSocket).SocketState;

    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        socket?.disconnect();
    },[]);
    useEffect(() => {
        if(localStorage.getItem('token'))
            store.checkAuth();
    }, []);

    const navigate = useNavigate();
    if(store.is_loading) {
        return <div>Loading...</div>
    }
    if(!store.is_auth){
        return (
        <div>
            <AuthForm/>
        </div>
        )
    }
    return (
        <MainPage/>
    );

};


export default observer(App);
