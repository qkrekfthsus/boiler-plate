import axios from 'axios';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';


export default function (SpecificComponent, option, adminRoute = null){
    //*option
    //null => 아무나 출입 가능
    //true => 로그인한 유저만 가능
    //false => 로그인 안한 유저만 가능
    
    function AuthenticationCheck(props){
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth())
            .then(response => {
                console.log(response);
                //로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login');
                    }
                }
                //로그인한 상태
                else{
                    // admin유저가 아닌 유저가 admin페이지에 접근할 때
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/');
                    }
                    // 로그인은 했지만 로그인 안한 유저만 가능한 페이지에 접근할 때
                    else{
                        if(option === false){
                            props.history.push('/');
                        }
                    }
                }
            })
        }, [])
        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck;
}