import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router";
import "../components/change-styles.css"

const ChangeUserDataForm: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_d, setPasswordD] = useState<string>('');
    const [password_old, setPasswordOld] = useState<string>('');
    const [class_id, setClassId] = useState<number>(0);
    const {store} = useContext(Context);
    const navigate = useNavigate();
    const Nav = () => {
        navigate('/');
    }
    return (
        <div>
            <div className="formm">
            <input
                className="field"
                onChange={e => setUsername(e.target.value)}
                value={username}
                type={"text"}
                placeholder={"новый юзернейм"}
            />
            <input
                className="field"
                onChange={e => setPassword(e.target.value)}
                value={password}
                type={"text"}
                placeholder={"новый пароль"}
            />
            <input
                className="field"
                onChange={e => setPasswordD(e.target.value)}
                value={password_d}
                type={"text"}
                placeholder={"снова новый пароль"}
            />
            <input
                className="field"
                onChange={e => setPasswordOld(e.target.value)}
                value={password_old}
                type={"text"}
                placeholder={"старый пароль"}
            />
                <div className="radio-toolbar">
                    <input id="radio1"  type="radio" checked={class_id === 0} onChange={() => setClassId(0)}/><label htmlFor="radio1">Warrior</label>
                    <input id="radio2"  type="radio" checked={class_id === 1} onChange={() => setClassId(1)}/><label htmlFor="radio2">Mage</label>
                    <input id="radio3"  type="radio" checked={class_id === 2} onChange={() => setClassId(2)}/><label htmlFor="radio3">Thief</label>
                </div>
            <button className="abtn" onClick={() => store.changeUserData(username, password, password_d, password_old, class_id)}>Подтвердить изменения</button>
            <button className="abtn" onClick={Nav}>Назад</button>
            </div>
        </div>
    );
};

export default observer(ChangeUserDataForm);