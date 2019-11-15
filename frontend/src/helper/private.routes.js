import React from "react";
import { Route , Redirect } from "react-router-dom" ;
import cookie from 'react-cookies'

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => ( cookie.load('token') !== undefined
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
);

export const LoginRoute = ({ component: Component, ...rest }) => (
    console.log("login", cookie.load('token')) || 
    <Route {...rest} render={props => ( cookie.load('token') !== undefined
            ? <Redirect to={{ pathname: '/homepage', state: { from: props.location } }} />
            : <Component {...props} />
    )} />
);

