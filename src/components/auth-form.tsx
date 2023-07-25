import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import './auth-styles.css';
import MainPage from "./main-page";

const AuthForm: FC = () => {
    const [username_l, setUsername_l] = useState<string>('');
    const [password_l, setPassword_l] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_d, setPasswordD] = useState<string>('');
    const [class_id, setClassId] = useState<number>(0);
    const {store} = useContext(Context);
    return (
        <div>
            <div className="form">
                <div className="login">
                    <input
                        className="field"
                        onChange={e => setUsername_l(e.target.value)}
                        value={username_l}
                        type={"text"}
                        placeholder={"username"}
                    />
                    <input
                        className="field"
                        onChange={e => setPassword_l(e.target.value)}
                        value={password_l}
                        type={"text"}
                        placeholder={"password"}
                    />
                    <button className="abtn" onClick={() => store.login(username_l, password_l)}>Login</button>
                </div>
                <div className="reg">
                    <input
                        className="field"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        type={"text"}
                        placeholder={"username"}
                    />
                    <input
                        className="field"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type={"text"}
                        placeholder={"email"}
                    />
                    <input
                        className="field"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type={"text"}
                        placeholder={"password"}
                    />
                    <input
                        className="field"
                        onChange={e => setPasswordD(e.target.value)}
                        value={password_d}
                        type={"text"}
                        placeholder={"password d"}
                    />
                    <div className="radio-toolbar">
                        <input id="radio1"  type="radio" checked={class_id === 0} onChange={() => setClassId(0)}/><label htmlFor="radio1">Warrior</label>
                        <input id="radio2"  type="radio" checked={class_id === 1} onChange={() => setClassId(1)}/><label htmlFor="radio2">Mage</label>
                        <input id="radio3"  type="radio" checked={class_id === 2} onChange={() => setClassId(2)}/><label htmlFor="radio3">Thief</label>
                    </div>
                    <button className="abtn" onClick={() => store.registration(username, email, password, password_d, class_id)}>Registration</button>
                </div>
            </div>
        </div>

    );
};

export default observer(AuthForm);