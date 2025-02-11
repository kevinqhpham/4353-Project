import React from 'react';
import UserHeader from '../components/UserHeader.js'
const Profile = () =>{
    return(
        <div>
            <div className = "header">
                <UserHeader/>
            </div>
            <div className = "body">
                <h1>Profile</h1>
            </div>
        </div>
    ) 
}

export default Profile;