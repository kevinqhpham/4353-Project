import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './profile.module.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngnaehayrjwlccyguvia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbmFlaGF5cmp3bGNjeWd1dmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE2NjksImV4cCI6MjA1NzUwNzY2OX0.XYPIwnE8vZGnXo17d5o0lOoO7Tit4omsN_UPBRdOKUM';

export const supabase = createClient(supabaseUrl, supabaseKey);

const Profile = () => {
    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('user_profile')
                .select('*')
                .eq('id')
                .single(); 
    
            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setFormData(data);
            }
        };
    
        fetchProfile();
    }, []);
    
    
    const [formData, setFormData] = useState({
        fullName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        skills: [],
        preferences: '',
        availability: [],
    });

    const stateCodes = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 
        'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 
        'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
      
    const stateNames = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 
        'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 
        'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 
        'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
        'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
      
    const states = stateCodes.map((code, index) => ({
        code,
        name: stateNames[index]
    }));
    
    const skillsOptions = ['Lift heavy objects', 'Empathy', 'Teamwork', 'Leadership', 'Working with children', 'Communication', 'Problem-solving'];

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'zipCode') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSkillsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, skills: selectedOptions });
    };

    const handleDateChange = (date) => {
        if (!date) return;
        setFormData((prevState) => {
            const exists = prevState.availability.some(d => d.getTime() === date.getTime());
            return {
                ...prevState,
                availability: exists
                    ? prevState.availability.filter(d => d.getTime() !== date.getTime())
                    : [...prevState.availability, date] 
            };
        });
    };
    
    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullName || formData.fullName.length > 50) newErrors.fullName = 'Full name is required (Max 50 characters)';
        if (!formData.address1 || formData.address1.length > 100) newErrors.address1 = 'Address 1 is required (Max 100 characters)';
        if (!formData.city || formData.city.length > 100) newErrors.city = 'City is required (Max 100 characters)';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode || formData.zipCode.length < 5 || formData.zipCode.length > 9) newErrors.zipCode = 'Zip code must be 5-9 characters';
        if (formData.skills.length === 0) newErrors.skills = 'At least one skill must be selected';
        if (formData.availability.length === 0) newErrors.availability = 'Select at least one available date';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            const { error } = await supabase
                .from('user_profile')
                .upsert([
                    {
                        id: 2,
                        full_name: formData.fullName,
                        address1: formData.address1,
                        address2: formData.address2,
                        city: formData.city,
                        state: formData.state,
                        zip_code: formData.zipCode,
                        skills: formData.skills.join(','),
                        preferences: formData.preferences,
                        availability: formData.availability.map(date => date.toISOString())
                    }
                ]);
    
            if (error) {
                console.error('Error updating profile:', error.message);
            } else {
                alert('Profile updated successfully!');
            }
        }
    };
    
    
    return (
        <div>
            <div className="header">
                <UserHeader />
            </div>
            <div className="body">
                <h1>Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Full Name:</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} maxLength="50" required />
                        {errors.fullName && <p className="error">{errors.fullName}</p>}
                    </div>

                    <div>
                        <label>Address 1:</label>
                        <input type="text" name="address1" value={formData.address1} onChange={handleChange} maxLength="100" required />
                        {errors.address1 && <p className="error">{errors.address1}</p>}
                    </div>

                    <div>
                        <label>Address 2 (Optional):</label>
                        <input type="text" name="address2" value={formData.address2} onChange={handleChange} maxLength="100" />
                    </div>

                    <div>
                        <label>City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} maxLength="100" required />
                        {errors.city && <p className="error">{errors.city}</p>}
                    </div>

                    <div>
                        <label>State:</label>
                        <select name="state" value={formData.state} onChange={handleChange} required>
                            <option value="">Select a state</option>
                            {states.map((state) => (
                                <option key={state.code} value={state.code}>{state.name}</option>
                            ))}
                        </select>
                        {errors.state && <p className="error">{errors.state}</p>}
                    </div>

                    <div>
                        <label>Zip Code:</label>
                        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} maxLength="9" required />
                        {errors.zipCode && <p className="error">{errors.zipCode}</p>}
                    </div>

                    <div>
                        <label>Skills:</label>
                        <select name="skills" multiple value={formData.skills} onChange={handleSkillsChange} required>
                            {skillsOptions.map((skill) => (
                                <option key={skill} value={skill}>{skill}</option>
                            ))}
                        </select>
                        {errors.skills && <p className="error">{errors.skills}</p>}
                    </div>

                    <div>
                        <label>Preferences (Optional):</label>
                        <textarea name="preferences" value={formData.preferences} onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label>Availability:</label>
                        <DatePicker
                            selected={null}
                            onChange={handleDateChange}
                            isClearable
                        />
                        {errors.availability && <p className="error">{errors.availability}</p>}
                    </div>

                    <h3>Selected Dates:</h3>
                    <ul className="selected-dates">
                        {formData.availability.map((date, index) => (
                            <li key={index}>{date.toDateString()}</li>
                        ))}
                    </ul>

                    <button type="submit">Save Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;