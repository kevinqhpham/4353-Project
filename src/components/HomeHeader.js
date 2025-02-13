import React from 'react';
import { Link } from "react-router-dom";

const HomeHeader = () => {
    return (
        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            <Link to='/' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
            <Link to='/signup' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Sign Up</Link>
            <Link to='/login' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Login</Link>
            <Link to='/history' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>History</Link>
        </div>
    );
}

export default HomeHeader;