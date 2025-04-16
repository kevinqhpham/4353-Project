import React from 'react';
import { Link } from "react-router-dom";

const AdminHeaeder = () => {
    return (
        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            <Link to='/adminpage' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
            <Link to='/adminevents' style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Events</Link>
            <Link to='/login' style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Logout</Link>
        </div>
    );
}

export default AdminHeaeder;