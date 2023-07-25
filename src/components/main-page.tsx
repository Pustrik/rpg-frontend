import React, {FC, useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {IUser} from "../models/i-user";
import {useNavigate} from "react-router";
import "./main-styles.css"
import AuthForm from "./auth-form";

const MainPage: FC = () => {

    const {store} = useContext(Context);
    const navigate = useNavigate();
    const [users, setUsers] = useState<IUser[]>([]);

    const Nav = () => {
        navigate('/lobby');
    }
    const NavChange = () => {
        navigate('/change');
    }
    if(store.class_id == 0) {
        return (
            <div>
                <div id="info">
                    <h1>{`Салам аллейкум  ${store.user.username}!`}</h1>
                    <div id="warrior">
                    </div>
                </div>
                <div id="menu">
                    <button className="btn" onClick={() => store.logout()}>Выйти</button>
                    {users.map(user =>
                        <div key={user.username}>{user.username}
                            <button>Атака</button>
                            <button>Способность</button>
                        </div>
                    )}
                    <button className="btn" onClick={Nav}>В лобби</button>
                    <button className="btn" onClick={NavChange}>Изменить данные</button>
                </div>
            </div>
        );
    }
    if(store.class_id == 1) {
        return (
            <div>
                <div id="info">
                    <h1>{`Салам аллейкум  ${store.user.username}!`}</h1>
                    <div id="mage">
                    </div>
                </div>
                <div id="menu">
                    <button className="btn" onClick={() => store.logout()}>Выйти</button>
                    {users.map(user =>
                        <div key={user.username}>{user.username}
                            <button>Атака</button>
                            <button>Способность</button>
                        </div>
                    )}
                    <button className="btn" onClick={Nav}>В лобби</button>
                    <button className="btn" onClick={NavChange}>Изменить данные</button>
                </div>
            </div>
        );
    }
        return (
            <div>
                <div id="info">
                    <h1>{`Салам аллейкум  ${store.user.username}!`}</h1>
                    <div id="thief">
                    </div>
                </div>
                <div id="menu">
                    <button className="btn" onClick={() => store.logout()}>Выйти</button>
                    <button className="btn" onClick={Nav}>В лобби</button>
                    <div>
                    <button className="btn" onClick={NavChange}>Изменить данные</button>
                    </div>
                </div>
            </div>
        );
};

export default observer(MainPage);