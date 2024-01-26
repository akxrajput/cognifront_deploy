// SocialMediaOptions.jsx

import React, { useState } from 'react';
import './socialmediaoptions.css';

const SocialMediaOptions = () => {
  // Use state to track selected options
  const [selectedOptions, setSelectedOptions] = useState({
    SMS: false,
    telegram: false,
    EMAIL: false,
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  const handleSetPlatform = async () => {
    try {
      // Send a POST request to your backend endpoint
      const response = await fetch('/api/platform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform: selectedOptions }),
      });
  
      if (response.ok) {
        console.log('Selected options sent successfully');
        // Handle success if needed
      } else {
        console.error('Error setting platform preferences on the backend');
        // Handle error if needed
      }
    } catch (error) {
      console.error('Error setting platform preferences on the backend:', error);
    }
  };

   
  
  // Render the component
  return (
    <div className='options'>
      <p>Select your preferred Service</p>
      <label className='social-label'>
        <input
          type="checkbox"
          name="SMS"
          className='social-input'
          checked={selectedOptions.SMS}
          onChange={handleCheckboxChange}
        />
        SMS
      </label>
      <br />
      <label className='social-label'>
        <input
          type="checkbox"
          name="telegram"
          className='social-input'
          checked={selectedOptions.telegram}
          onChange={handleCheckboxChange}
        />
        Telegram
      </label>
      <br />
      <label className='social-label'>
        <input
          type="checkbox"
          name="EMAIL"
          className='social-input'
          checked={selectedOptions.EMAIL}
          onChange={handleCheckboxChange}
        />
        EMAIL
      </label>

      <button  onClick={handleSetPlatform} id='btn-setplat'>SET PLATFORM</button>
    </div>
  );
};

export default SocialMediaOptions;
