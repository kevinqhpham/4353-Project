import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

const UserHeader = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const inboxRef = useRef(null);

    useEffect(() => {
        fetch("/notifications")
            .then(response => response.json())
            .then(data => setNotifications(data))
            .catch(error => console.error("Error fetching notifications:", error));
    }, []);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const popupStyles = {
        container: {
            position: 'absolute',
            top: '40px',
            right: 0,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            width: '250px',
            zIndex: 100,
        }
    };

    return (
        <div style={{ position: 'relative', display: 'flex', gap: '10px', padding: '10px' }}>
            <Link to='/userpage' style={linkStyle}>Home</Link>
            <Link to='/profile' style={linkStyle}>Profile</Link>
            <Link to='/history' style={linkStyle}>History</Link>
            <div style={{ position: 'relative' }} ref={inboxRef}>
                <button onClick={togglePopup} style={buttonStyle}>Inbox</button>
                {isPopupOpen && (
                    <div style={popupStyles.container}>
                        <h4>Notifications</h4>
                        <ul style={{ paddingLeft: '20px', textAlign: 'left' }}>
                            {notifications.map((note, i) => (
                                <li key={i}>{note}</li>
                            ))}
                        </ul>
                        <button onClick={togglePopup} style={{ marginTop: '10px' }}>Close</button>
                    </div>
                )}
            </div>
            <Link to='/login' style={{ ...linkStyle, backgroundColor: '#28a745' }}>Logout</Link>
        </div>
    );
};

const linkStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: '16px',
};

const buttonStyle = {
    ...linkStyle,
    fontFamily: 'inherit', 
};

export default UserHeader;
