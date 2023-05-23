import {authenticationResponse, userCreationDTO, userDetails} from "./auth.models";
import axios from "axios";
import {urlAccounts} from "../endpoints";
import React, {useContext, useState} from "react";
import DisplayErrors from "../utils/DisplayErrors";
import AuthFormRegister from "./AuthFormRegister";
import {getClaims, saveToken} from "./handleJWT";
import AuthenticationContext from "./AuthenticationContext";
import {useHistory} from "react-router-dom";

export default function Register() {

    const [errors, setErrors] = useState<string[]>([]);
    const {update} = useContext(AuthenticationContext);
    const history = useHistory();

    async function register(details: userDetails) {
        if (details.password === details.confirmPassword) {
            setErrors([]);
            const userCreationDetails: userCreationDTO = {
                email: details.email,
                password: details.password,
                name: details.name,
                surname: details.surname,
                birthday: details.birthday,
                gender: details.gender,
                address: details.address
            };
            try {
                setErrors([]);
                const response = await axios
                    .post<authenticationResponse>(`${urlAccounts}/create`, userCreationDetails);
                saveToken(response.data);
                update(getClaims());
                history.push('/');
                window.location.reload();
            } catch (error) {
                // @ts-ignore
                setErrors(error.response.data);
            }
        } else {
            let error: string[] = ["Passwords don't match",];
            setErrors(error);
        }
    }

    return (
        <>
            <h3>Register</h3>
            <DisplayErrors errors={errors}/>
            <AuthFormRegister model={{
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                surname: '',
                birthday: new Date(''),
                gender: '',
                address: ''
            }}
                              onSubmit={async values => await register(values)}/>
        </>
    );
}