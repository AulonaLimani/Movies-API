import Button from "../utils/Button";
import React, {useContext, useEffect, useState} from "react";
import AuthenticationContext from "./AuthenticationContext";
import {useNavigate} from "react-router-dom";
import LandingPage from "../movies/LandingPage";
import {individualUserDetails} from "./auth.models";
import axios from "axios";
import {urlAccounts, urlServer} from "../endpoints";

export default function Profile() {

    const [details, setDetails] = useState<individualUserDetails>();
    const {claims} = useContext(AuthenticationContext);
    const navigate = useNavigate();

    useEffect(() => {
        isRunning();
    })

    async function isRunning() {
        try {
            await axios.get(`${urlServer}/running`);
        } catch (error) {
            navigate(0);
        }
    }

    useEffect(() => {
        claims.map(claim => {
            if (claim.name === "email") {
                getUserDetailsByEmail(claim.value);
            }
        })
    }, [claims]);

    const getUserDetailsByEmail = async (email: string) => {
        try {
            const response = await axios.get(`${urlAccounts}/getByEmail?email=${email}`);
            setDetails(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            {claims.length > 0 ? <>

                    <h3>Profile</h3>
                    <br/>

                    <div className={"profile-container"}>
                        <p>
                            Name: {details?.name}
                        </p>
                        <p>
                            Surname: {details?.surname}
                        </p>
                        <p>
                            Birthday: {details?.birthday.toString().slice(0, 10)}
                        </p>
                        <p>
                            Gender: {details?.gender}
                        </p>
                        <p>
                            Address: {details?.address}
                        </p>
                        <Button
                            className={"btn btn-dark"}
                            onClick={() => {
                                navigate('/changepassword')
                            }}
                        >
                            Change Password
                        </Button>
                        <Button
                            className={"btn btn-dark margin-left"}
                            onClick={() => {
                                navigate('/edituser');
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                </> :
                <LandingPage/>
            }
        </>
    );
}