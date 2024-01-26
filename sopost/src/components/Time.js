import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './time.css';
import axios from 'axios';

const Time = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectvalue , setSelectedvalue] = useState("TIME is not selected")

  const handleDateTimeChange = (date) => {
    setSelectedDateTime(date);
    // Do something with the selected date and time
    console.log('Selected Date and Time:', date);
    setSelectedvalue("Now ,  hit the SET TIME BUTTON");

    
  };

  const sendDateTimeToBackend = async (date) => {
    const formattedDateTime = selectedDateTime.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'IST', // Adjust the time zone as needed
    });
    
    try {
      // Make an HTTP POST request to the backend
      const response = await axios.post('/api/time', { dateTime: formattedDateTime });
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error sending data to the backend:', error);
    }
    setSelectedvalue(" NOW , UPLOAD IMAGE ON RIGHT SIDE")
  };

  

  return (
    <div className='date-timer'>
      <label>{selectvalue}</label>
      <h3>NOTE: IT'S A 24HR CLOCK</h3>
      <div>
        <DateTimePicker
          onChange={handleDateTimeChange}
          value={selectedDateTime}
          format="yyyy-MM-dd HH:mm"
          clearIcon={null} // Hide the clear icon
        />
      </div>
      <button id='btn-timeset' onClick={sendDateTimeToBackend}>SET TIME</button>
    </div>
  );
};

export default Time;
