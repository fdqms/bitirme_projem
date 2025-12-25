import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Provider } from 'react-redux';

import './index.css';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Menu } from 'semantic-ui-react';

import PrivateRoute from './PrivateRoute';

import App from './App';
import Home from './Home';
import Profile from './Profile';
import Login from './Login';
import Register from './Register';
import Logout from './Logout';

import store from './store/store';
import NotFound from './NotFound';


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Grid textAlign='center' className='mainGrid'>
        <Grid.Row stretched>
          <Grid.Column width={3}>
            <Menu tabular vertical>
              <Menu.Item>
                <Link to='/'>FDQMS</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to='/oyun'>Oyun</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to='/profil'>Profil</Link>
              </Menu.Item>
              <Logout />
            </Menu>
          </Grid.Column>
          <Grid.Column width={13}>
            <Switch>
              <Route path='/giris'>
                <Login />
              </Route>
              <Route path='/kaydol'>
                <Register />
              </Route>
              <PrivateRoute path='/oyun'>
                <App ai={false} />
              </PrivateRoute>
              <Route path='/yapay-zeka'>
                <App ai={true} />
              </Route>
              <PrivateRoute path='/profil'>
                <Profile />
              </PrivateRoute>
              <Route path='/'>
                <Home />
              </Route>
              <Route path='/*'>
                <NotFound />
              </Route>
            </Switch>
          </Grid.Column>
        </Grid.Row>

      </Grid>

    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
);

reportWebVitals();