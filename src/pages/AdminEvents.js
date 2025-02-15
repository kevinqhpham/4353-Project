import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader.js';

const AdminEvents = () => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [location, setLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [errors, setErrors] = useState({});

  // Example options for skills and urgency – adjust as needed.
  const skillsOptions = ["Communication", "First Aid", "Technical Support", "Organizing"];
  const urgencyOptions = ["Low", "Medium", "High"];

  const handleSubmit = (e) => {
    e.preventDefault();
    let currentErrors = {};

    // Validate Event Name
    if (!eventName) {
      currentErrors.eventName = "Event Name is required";
    } else if (eventName.length > 100) {
      currentErrors.eventName = "Event Name must be 100 characters or less";
    }

    // Validate Event Description
    if (!eventDescription) {
      currentErrors.eventDescription = "Event Description is required";
    }

    // Validate Location
    if (!location) {
      currentErrors.location = "Location is required";
    }

    // Validate Required Skills
    if (requiredSkills.length === 0) {
      currentErrors.requiredSkills = "Please select at least one required skill";
    }

    // Validate Urgency
    if (!urgency) {
      currentErrors.urgency = "Urgency is required";
    }

    // Validate Event Date
    if (!eventDate) {
      currentErrors.eventDate = "Event Date is required";
    }

    setErrors(currentErrors);

    // If no errors, process form submission
    if (Object.keys(currentErrors).length === 0) {
      const eventData = {
        eventName,
        eventDescription,
        location,
        requiredSkills,
        urgency,
        eventDate,
      };
      console.log("Event Data Submitted:", eventData);
      alert("Event created/updated successfully!");

      // Reset the form fields
      setEventName('');
      setEventDescription('');
      setLocation('');
      setRequiredSkills([]);
      setUrgency('');
      setEventDate('');
    }
  };

  // Handle multi-select change for required skills
  const handleSkillsChange = (e) => {
    const options = e.target.options;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setRequiredSkills(selectedSkills);
  };

  return (
    <div>
      <div className="header">
        <AdminHeader />
      </div>
      <div className="container" style={{ padding: '20px' }}>
        <h1>Manage Events</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="eventName">Event Name (max 100 characters) *</label>
            <br />
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              maxLength="100"
              required
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.eventName && <div style={{ color: 'red' }}>{errors.eventName}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="eventDescription">Event Description *</label>
            <br />
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
              rows="4"
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.eventDescription && <div style={{ color: 'red' }}>{errors.eventDescription}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="location">Location *</label>
            <br />
            <textarea
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              rows="2"
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.location && <div style={{ color: 'red' }}>{errors.location}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="requiredSkills">Required Skills *</label>
            <br />
            <select
              id="requiredSkills"
              name="requiredSkills"
              multiple
              value={requiredSkills}
              onChange={handleSkillsChange}
              required
              style={{ width: '100%', padding: '8px' }}
            >
              {skillsOptions.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            {errors.requiredSkills && <div style={{ color: 'red' }}>{errors.requiredSkills}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="urgency">Urgency *</label>
            <br />
            <select
              id="urgency"
              name="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Select urgency</option>
              {urgencyOptions.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.urgency && <div style={{ color: 'red' }}>{errors.urgency}</div>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="eventDate">Event Date *</label>
            <br />
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
            {errors.eventDate && <div style={{ color: 'red' }}>{errors.eventDate}</div>}
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Save Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEvents;

//ddh