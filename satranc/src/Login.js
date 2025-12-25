import React, { useState } from 'react';
import { Button, Form, Grid } from 'semantic-ui-react'
import './Login.css'
import { api }  from './Api';
import { LoginAction } from './store/actions/authAction';
import { withRouter, useHistory } from "react-router";
import { useDispatch } from "react-redux";

function Login() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    // const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const submit = () => {
        api.login(username, password).then(val => {
            if (val) {
                dispatch(LoginAction(username, password));
                history.push('/oyun');
            }
            else {
                console.log("giriş başarısız");
            }
        });
    }

    const register = () => {
        history.push('/kaydol');
    }

    return <Grid className='loginForm'>
        <Grid.Row centered>
            <Grid.Column width={6}>
                <Form onSubmit={submit}>
                    <Form.Field>
                        <label>Kullanıcı adı</label>
                        <input placeholder='Kullanıcı adı' onChange={onChangeUsername}></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Parola</label>
                        <input type='password' placeholder='Parola' onChange={onChangePassword}></input>
                    </Form.Field>
                    <Button color='green' floated='right' type='submit'>Giriş yap</Button>
                    <Button color='blue' floated='left' onClick={register}>Kaydol</Button>
                </Form>
            </Grid.Column>
        </Grid.Row>
    </Grid>
}

export default withRouter(Login);