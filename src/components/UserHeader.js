import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const UserHeader = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetch("/notifications")
            .then(response => response.json())
            .then(data => setNotifications(data))
            .catch(error => console.error("Error fetching notifications:", error));
    }, []);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            <Link to='/userpage' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
            <Link to='/profile' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Profile</Link>
            <Link to='/history' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>History</Link>
            <button onClick={togglePopup}>Inbox</button>
            {isPopupOpen && (
                <div style={{ position: 'fixed', top: '20%', left: '40%', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Notifications</h3>
                    <ul>
                        {notifications.map((notification) => (
                            <li key={notification.id}>{notification.message} ({notification.type})</li>
                        ))}
                    </ul>
                    <button onClick={togglePopup}>Close</button>
                </div>
            )}
        </div>
    );
}

export default UserHeader;
