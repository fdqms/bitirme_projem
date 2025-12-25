import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, Form, Button } from 'semantic-ui-react';
import { api } from './Api';
import { RegisterAction } from './store/actions/authAction';
import './Register.css'

function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');

    const history = useHistory();
    const dispatch = useDispatch();

    const submit = (e) => {
        e.preventDefault();

        api.register(name, username, password, mail).then(val => {
            if (val) {
                history.push('/oyun');
                dispatch(RegisterAction(username, password));
                console.log("kayit basarili")
            } else {
                console.log("kayit basarisiz");
            }
        });
    };

    return <Grid className='registerForm'>
        <Grid.Row centered>
            <Grid.Column width={6}>
                <Form onSubmit={submit}>
                    <Form.Field>
                        <label>Ad</label>
                        <input placeholder='Ad' onChange={(e) => setName(e.target.value)}></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Kullanıcı adı</label>
                        <input placeholder='Kullanıcı adı' onChange={(e) => setUsername(e.target.value)}></input>
                    </Form.Field>
                    <Form.Field>
                        <label>Parola</label>
                        <input placeholder='Parola' onChange={(e) => setPassword(e.target.value)} type="password"></input>
                    </Form.Field>
                    <Form.Field>
                        <label>E-posta</label>
                        <input placeholder='E-posta' onChange={(e) => setMail(e.target.value)}></input>
                    </Form.Field>
                    <Button floated='right' color='blue' type='submit'>Kaydol</Button>
                </Form>
            </Grid.Column>
        </Grid.Row>
    </Grid>;
}

export default Register;