import React, { useState } from 'react';
import { Link } from "react-router-dom";

const UserHeader = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const notifications = [
        "You have a new message!",
        "Your profile was updated successfully.",
        "Reminder: Complete your profile setup.",
    ];

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const popupStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        popup: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            width: '300px',
            textAlign: 'center',
        },
    };
    
    
    return (
        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            <Link to='/userpage' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
            <Link to='/profile' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Profile</Link>
            <Link to='/history' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>History</Link>
            <Link to='/login' style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Logout</Link>
            <button onClick={togglePopup}>Inbox</button>
            {isPopupOpen && (
                <div style={popupStyles.overlay}>
                    <div style={popupStyles.popup}>
                        <h3>Notifications</h3>
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>{notification}</li>
                            ))}
                        </ul>
                        <button onClick={togglePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserHeader;