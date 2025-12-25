import React from 'react';
import { Menu } from 'semantic-ui-react';
import { LogoutAction } from './store/actions/authAction';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Logout() {

    const { auth } = useSelector((state) => state);
    const dispatch = useDispatch();
    const history = useHistory();

    const click = () => {
        dispatch(LogoutAction());
        history.push('/giris');
    }

    if (auth) {
        return <Menu.Item onClick={click}>Çıkış yap</Menu.Item>;
    }

    return <></>
}

export default Logout;