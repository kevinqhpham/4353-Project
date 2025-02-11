import React from 'react';
import { Link } from "react-router-dom";

const UserHeader = () => {
    return (
        <div style={{ display: 'flex', gap: '10px', backgroundColor: '#333', padding: '10px' }}>
            <Link to='/userpage' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
            <Link to='/profile' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Profile</Link>
            <Link to='/inbox' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Inbox</Link>
        </div>
    );
}

export default UserHeader;