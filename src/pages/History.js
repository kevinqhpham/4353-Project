import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader.js';
import './History.css';

const VolunteerHistory = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/history/history')
            .then((response) => response.json())
            .then((data) => setEvents(data))
            .catch((error) => console.error('Error fetching history:', error));
    }, []);

    return (
        <div>
            <div className = "header">
                    <UserHeader/>
                </div>
            <div className="history-container">
                <h1 className="history-header">Volunteer History</h1>
                <div className="overflow-x-auto">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Description</th>
                                <th>Location</th>
                                <th>Required Skills</th>
                                <th>Urgency</th>
                                <th>Event Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={index}>
                                    <td>{event.name}</td>
                                    <td>{event.description}</td>
                                    <td>{event.location}</td>
                                    <td>{event.skills}</td>
                                    <td className={event.urgency === "High" ? "urgency-high" : event.urgency === "Medium" ? "urgency-medium" : "urgency-low"}>
                                        {event.urgency}
                                    </td>
                                    <td>{event.date}</td>
                                    <td className={`status ${event.status === "Participated" ? "status-participated" : event.status === "Canceled" ? "status-canceled" : "status-no-show"}`}>
                                        {event.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VolunteerHistory;
