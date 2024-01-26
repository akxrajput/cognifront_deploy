import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './schedule.css'

function Schedule() {
  const [value, onChange] = useState(new Date());

  return (
    <div className='cal'>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

export default Schedule;