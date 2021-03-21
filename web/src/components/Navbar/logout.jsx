import React from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import {useGlobalStateUpdate} from '../../context/globalContext'
import URL from '../../baseUrl/BaseUrl'
function Logout() {
    const globalStateUpdate = useGlobalStateUpdate()
    const history = useHistory()
    function logout() {
        axios({
            method: 'post',
            url: URL+'/logout',
            withCredentials: true
        }).then((response) => {
            globalStateUpdate(prev => ({
                ...prev,
                loginStatus: false,
                role: null
            }))
            history.push("/login")
        }, (error) => {
            console.log(error);
        });
    }
    return (
        <div>
            <a className="text-success btn btn-outline-success mr-3" onClick={logout}>Logout<span className="sr-only">(current)</span></a>
        </div>
    )
}

export default Logout