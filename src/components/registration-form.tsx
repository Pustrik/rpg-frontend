import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const RegistrationForm: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_d, setPasswordD] = useState<string>('');
    const [class_id, setClassId] = useState<number>(0);
    const {store} = useContext(Context);

    return (
        <div>
            <input
                onChange={e => setUsername(e.target.value)}
                value={username}
                type={"text"}
                placeholder={"username"}
            />
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type={"text"}
                placeholder={"email"}
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type={"text"}
                placeholder={"password"}
            />
            <input
                onChange={e => setPasswordD(e.target.value)}
                value={password_d}
                type={"text"}
                placeholder={"password d"}
            />
            <label><input type="radio" checked={class_id === 0} onChange={() => setClassId(0)}/>Warrior</label>
            <label><input type="radio" checked={class_id === 1} onChange={() => setClassId(1)}/>Mage</label>
            <label><input type="radio" checked={class_id === 2} onChange={() => setClassId(2)}/>Thief</label>
            <button onClick={() => store.registration(username, email, password, password_d, class_id)}>Registration</button>
        </div>
    );
};

export default observer(RegistrationForm);