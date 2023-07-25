import React, {useContext, useEffect, useReducer, useState} from 'react';
import {ISocketContextState, SocketReducer} from "../store/store-socket";
import {Context} from "../index";
import {useNavigate} from "react-router";
import {useSocket} from "../hooks/use-socket";
import IPlayer from "../../../interfaces/i-player";
import './lobby-styles.css';
import IMessage from "../../../interfaces/i-message";
import AuthForm from "./auth-form";
export interface IApplicationProps {}
const LobbyPage: React.FunctionComponent<IApplicationProps> = (props) => {
    const navigate = useNavigate();
    const {store} = useContext(Context);
    const [message, setMessage] = useState<string>('');

    const socket = useSocket('ws://localhost:8080', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false,
    });

    const defaultSocketContextState: ISocketContextState = {
        socket: undefined,
        player: {
            socket_id: '',
            username: store.user.username,
            hp: 0,
            statuses: [0, 0],
            class_id: 0
        },
        players: [],
        messages: [{username:'', message:''}]
    };
    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);

    useEffect(() => {
        socket.connect();
        SocketDispatch({type: 'update_socket', payload: socket});
        StartListeners();
        SendHandshake();
        // eslint-disable-next-line
    }, []);

    const StartListeners = () => {
        /** Messages */
        socket.on('user_connected', (players: IPlayer[]) => {
            console.info('User connected message received');
            SocketDispatch({ type: 'update_players', payload: players });
        });

        socket.on('user_disconnected', (player: string) => {
            console.info('User disconnected message received');
            SocketDispatch({ type: 'remove_player', payload: player});
        });

        socket.on('cant_attack', () => {
            alert('Нельзя атаковать');
        });

        socket.on('cant_spell', () => {
            alert('Нельзя применить спел');
        });

        socket.on('cant_revive', () => {
            alert('Нельзя воскреснуть');
        });

        socket.on('error', (err) => {
            console.error(err);
            alert('Произошла ошибка');
        });

        socket.on('check_session', () => {
            navigate('/');
            alert('Нельзя заходить с 1 учетки дважды');
            return;
        });


        socket.on('update_chat', (messages: IMessage[]) => {
            console.info('Messages upd' + message);
            console.info(message);
            SocketDispatch({ type: 'update_messages', payload: messages});
        });

        socket.on('update_all', (players: IPlayer[]) => {
            console.info('Attack happen');
            SocketDispatch({ type: 'update_players', payload: players});
        });
        socket.on('update_one', (player: IPlayer) => {
            console.info('Attack happen');
            SocketDispatch({ type: 'update_player', payload: player});
        });
        /** Connection / reconnection listeners */
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt);
            SendHandshake();
        });

        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection Attempt: ' + attempt);
        });

        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnection error: ' + error);
        });

        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure.');
            alert('Connection failed!');
        });
    };

    const SendHandshake = async () => {
        console.info('Sending handshake to server ...');
        socket.emit('handshake', SocketState.player, async (player: IPlayer, players: IPlayer[]) => {
            console.info('User handshake callback message received');
            SocketDispatch({ type: 'update_player', payload: player });
            SocketDispatch({ type: 'update_players', payload: players });
        });
        // setLoading(false);
    };

    const Nav = () => {
        navigate('/');
    }
    const Al = (a: string) => {
        alert(' ATTACK ' + a);
    }
    const Class = (id: number) => {
        if(id === 0)
            return 'Warrior';
        if(id === 1)
            return 'Mage';
        return 'Thief';
    }
    const Attack = (victim_name: string) => {
        const victim = SocketState.players.find((value) => {
            if(value.username === victim_name)
                return value;
        });
        console.info(SocketState.player.username + ' атакует ' + victim_name);
        socket.emit('attack', SocketState.player, victim);
    }
    const Revive = () => {
        console.info(SocketState.player.username + ' пытается воскреснуть');
        socket.emit('revive', SocketState.player);
    }
    const UseSpellMage = (victim_name: string) => {
        const victim = SocketState.players.find((value) => {
            if(value.username === victim_name)
                return value;
        });
        console.info(SocketState.player.username + ' пытается использовать спел');
        socket.emit('spell', SocketState.player, victim);
    }
    const UseSpell = () => {
        console.info(SocketState.player.username + ' пытается использовать спел');
        socket.emit('spell', SocketState.player);
    }
    const MageStatus = (status: number[]) => {
        if(status[1] == 1)
            return <li>Нельзя кастовать</li>
        return <li></li>
    }
    const ElseStatus = (status: number[]) => {
        if(status[0] == 1)
            if(SocketState.player.class_id == 0)
                return <li>Защищен от физ. урона</li>
            else
                return <li>Ушел в тень</li>
        return <li></li>
    }
    const SendMessage = (message: string, username: string) => {
        socket.emit('message', {username: username, message: message});
    }

    const GetClass = (id: number) => {
        if(id == 0)
            return 'Воин'
        if(id == 1)
            return 'Маг'
        return 'Вор'

    };
    useEffect(() => {
        if(localStorage.getItem('token')) {
            store.checkAuth();
            if (!store.is_auth) {
                navigate('/');
                return;
            }
        }
    }, []);

    if(store.is_loading) {
        return <div>Loading...</div>
    }
    if(SocketState.player.class_id == 1)
        return (
            <div>
                <div className='main'>
                    <div id="inf">
                        <h2>Информация об игроке</h2>
                        <br />
                        Класс: <strong>{Class(SocketState.player.class_id)}</strong>
                        <br />
                        Здоровье: <strong color="red">{SocketState.player.hp}</strong>
                        <br />
                        Дебафы: <strong>{MageStatus(SocketState.player.statuses)}</strong>
                        <br />
                    </div>
                    <div id="mage">
                    </div>
                    <button className="lobbtn" onClick={Nav}>Назад</button>
                    <button className="lobbtn" onClick={() => Revive()}>Воскреснуть</button>
                </div>
                <div id="players">
                    {SocketState.players.filter((player) => SocketState.player.username !== player.username).map((player) => <li>{'Юзернейм: ' + player.username}<br/>{'Здоровье: ' + player.hp}<br/>{'Класс: ' + GetClass(player.class_id)}<br/><button onClick={() => Attack(player.username)}>Удар</button><button onClick={() => UseSpellMage(player.username)}>Спел</button><br/><br/></li>)}
                </div>
                <div className='chat'>
                    {SocketState.messages.map((message) => <li>{message.username + ': ' + message.message}</li>)}
                    <div className='message'>
                        <input
                            onChange={e => setMessage(e.target.value)}
                            value={message}
                            type={"text"}
                            placeholder={"message"}
                        />
                        <button className="chatbtn" onClick={() => SendMessage(message, SocketState.player.username)}>Отправить</button>
                    </div>
                </div>
            </div>
        );
    else if(SocketState.player.class_id == 2)
        return (
            <div>
                <div className='main'>
                    <div id="inf">
                        <h2>Информация об игроке</h2>
                        <br />
                        Класс: <strong>{Class(SocketState.player.class_id)}</strong>
                        <br />
                        Здоровье: <strong>{SocketState.player.hp}</strong>
                        <br />
                        Бафы: <strong>{ElseStatus(SocketState.player.statuses)}</strong>
                        Дебафы: <strong>{MageStatus(SocketState.player.statuses)}</strong>
                        <br />
                    </div>
                    <div id="thief">
                    </div>
                    <button className="lobbtn" onClick={Nav}>Назад</button>
                    <button className="lobbtn" onClick={() => Revive()}>Воскреснуть</button>
                    <button className="lobbtn" onClick={() => {UseSpell()}}>Способность</button>
                </div>
                <div id="players">
                    {SocketState.players.filter((player) => SocketState.player.username !== player.username).map((player) => <li>{'Юзернейм: ' + player.username}<br/>{'Здоровье: ' + player.hp}<br/>{'Класс: ' + GetClass(player.class_id)}<br/><button onClick={() => Attack(player.username)}>Удар</button><br/><br/></li>)}
                </div>
                <div className='chat'>
                    {SocketState.messages.map((message) => <li>{message.username + ': ' + message.message}</li>)}
                    <div className='message'>
                        <input
                            onChange={e => setMessage(e.target.value)}
                            value={message}
                            type={"text"}
                            placeholder={"message"}
                        />
                        <button className="chatbtn" onClick={() => SendMessage(message, SocketState.player.username)}>Отправить</button>
                    </div>
                </div>
            </div>

        );
    return (
        <div>
            <div className='main'>
                <div id="inf">
                    <h2>Информация об игроке</h2>
                    <br />
                    Класс: <strong>{Class(SocketState.player.class_id)}</strong>
                    <br />
                    Здоровье: <strong>{SocketState.player.hp}</strong>
                    <br />
                    Бафы: <strong>{ElseStatus(SocketState.player.statuses)}</strong>
                    Дебафы: <strong>{MageStatus(SocketState.player.statuses)}</strong>
                    <br />
                </div>
                    <div id="warrior">
                    </div>
                    <button className="lobbtn" onClick={Nav}>Назад</button>
                    <button className="lobbtn" onClick={() => Revive()}>Воскреснуть</button>
                    <button className="lobbtn" onClick={() => {UseSpell()}}>Способность</button>
            </div>
            <div id="players">
                {SocketState.players.filter((player) => SocketState.player.username !== player.username).map((player) => <li>{'Юзернейм: ' + player.username}<br/>{'Здоровье: ' + player.hp}<br/>{'Класс: ' + GetClass(player.class_id) }<br/><button onClick={() => Attack(player.username)}>Удар</button><br/><br/></li>)}
            </div>
            <div className='chat'>
                {SocketState.messages.map((message) => <li>{message.username + ': ' + message.message}</li>)}
                <div className='message'>
                    <input
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        type={"text"}
                        placeholder={"message"}
                    />
                    <button className="chatbtn" onClick={() => SendMessage(message, SocketState.player.username)}>Отправить</button>
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;