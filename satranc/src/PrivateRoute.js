import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const PrivateRoute = ({ children, path }) => {

    const { auth } = useSelector((state)=>state);

    if(auth){
        return <BrowserRouter path={path}>
          {children}
        </BrowserRouter>
    }

    return <Redirect to='/giris' />
}

export default PrivateRoute;