import React, { useState } from 'react';
import AdminHeader from '../components/AdminHeader.js';

const AdminEvents = () => {
  // -----------------------------
  // 1) EVENT MANAGEMENT FORM STATE
  // -----------------------------
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [location, setLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [errors, setErrors] = useState({});

  // Example skills/urgency options for the event management form
  const skillsOptions = ['Lift heavy objects', 'Empathy', 'Teamwork', 'Leadership'];
  const urgencyOptions = ['Low', 'Medium', 'High'];

  // -----------------------------
  // 2) VOLUNTEER MATCHING FORM STATE
  // -----------------------------
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [matchedEvent, setMatchedEvent] = useState(null);

  // Mock arrays for demonstration (In real app, fetch from DB or use global state)
  const mockVolunteers = [
    { id: 1, name: 'Al Raja', skills: ['Empathy', 'Teamwork'] },
    { id: 2, name: 'Kevin Pham', skills: ['Lift heavy objects'] },
    { id: 3, name: 'Aiman Prasla', skills: ['Lift heavy objects'] },
    { id: 4, name: 'Tom Huynh', skills: ['Leadership'] },
  ];

  // Example event data for matching (You could also store newly created events here)
  const mockEvents = [
    { id: 101, eventName: 'Blood Drive', requiredSkills: ['Empathy', 'Teamwork'] },
    { id: 102, eventName: 'Houston Food Bank', requiredSkills: ['Lift heavy objects'] },
    { id: 103, eventName: 'Homeless Shelter', requiredSkills: ['Leadership'] },
  ];

  // -----------------------------
  // 3) EVENT MANAGEMENT: HANDLE SUBMIT
  // -----------------------------
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    let currentErrors = {};

    // Validate Event Name
    if (!eventName) {
      currentErrors.eventName = 'Event Name is required';
    } else if (eventName.length > 100) {
      currentErrors.eventName = 'Event Name must be 100 characters or less';
    }

    // Validate Event Description
    if (!eventDescription) {
      currentErrors.eventDescription = 'Event Description is required';
    }

    // Validate Location
    if (!location) {
      currentErrors.location = 'Location is required';
    }

    // Validate Required Skills
    if (requiredSkills.length === 0) {
      currentErrors.requiredSkills = 'Please select at least one required skill';
    }

    // Validate Urgency
    if (!urgency) {
      currentErrors.urgency = 'Urgency is required';
    }

    // Validate Event Date
    if (!eventDate) {
      currentErrors.eventDate = 'Event Date is required';
    }

    setErrors(currentErrors);

    // If no errors, process form submission
    if (Object.keys(currentErrors).length === 0) {
      const newEvent = {
        eventName,
        eventDescription,
        location,
        requiredSkills,
        urgency,
        eventDate,
      };
      console.log('New Event Created:', newEvent);
      alert('Event created/updated successfully!');

      // Reset the form fields
      setEventName('');
      setEventDescription('');
      setLocation('');
      setRequiredSkills([]);
      setUrgency('');
      setEventDate('');
    }
  };

  // Handle multi-select for required skills
  const handleSkillsChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setRequiredSkills(selected);
  };

  // -----------------------------
  // 4) VOLUNTEER MATCHING: HANDLE SELECT
  // -----------------------------
  const handleVolunteerChange = (e) => {
    const volunteerId = parseInt(e.target.value);
    const vol = mockVolunteers.find((v) => v.id === volunteerId);
    setSelectedVolunteer(vol);

    // Simple matching logic: find the FIRST event that shares at least one skill
    const foundEvent = mockEvents.find((evt) =>
      evt.requiredSkills.some((skill) => vol.skills.includes(skill))
    );

    setMatchedEvent(foundEvent || null);
  };

  return (
    <div>
      {/* Admin Header */}
      <div className="header">
        <AdminHeader />
      </div>

      {/* Page Content: Two columns side by side */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>

        {/* LEFT COLUMN: Event Management Form */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h2>Event Management Form</h2>
          <form onSubmit={handleSubmitEvent}>
            {/* Event Name */}
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

            {/* Event Description */}
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
              {errors.eventDescription && (
                <div style={{ color: 'red' }}>{errors.eventDescription}</div>
              )}
            </div>

            {/* Location */}
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

            {/* Required Skills */}
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
              {errors.requiredSkills && (
                <div style={{ color: 'red' }}>{errors.requiredSkills}</div>
              )}
            </div>

            {/* Urgency */}
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

            {/* Event Date */}
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="eventDate">Date *</label>
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

            {/* Submit Button */}
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
              Submit
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Volunteer Matching Form */}
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <h2>Volunteer Matching Form</h2>
          {/* Select a Volunteer */}
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="selectVolunteer">Select a Volunteer</label>
            <br />
            <select
              id="selectVolunteer"
              onChange={handleVolunteerChange}
              style={{ width: '100%', padding: '8px' }}
              defaultValue=""
            >
              <option value="" disabled>
                -- Choose a Volunteer --
              </option>
              {mockVolunteers.map((vol) => (
                <option key={vol.id} value={vol.id}>
                  {vol.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display Volunteer Info */}
          {selectedVolunteer && (
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              <h3>Volunteer Name</h3>
              <p>{selectedVolunteer.name}</p>
              <h4>Skills:</h4>
              <ul>
                {selectedVolunteer.skills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Matched Event Info */}
          {matchedEvent ? (
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '10px',
              }}
            >
              <h3>Matched Event</h3>
              <p>{matchedEvent.eventName}</p>
              <h4>Required Skills:</h4>
              <ul>
                {matchedEvent.requiredSkills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          ) : (
            selectedVolunteer && (
              <p style={{ color: 'red' }}>No matching event found for this volunteer.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
