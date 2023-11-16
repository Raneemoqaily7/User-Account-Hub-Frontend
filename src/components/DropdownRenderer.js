// DropdownRenderer_User.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { StatusEnum } from './Enum'; // Import the StatusEnum

function DropdownRenderer(props) {
  const { value = 0, onValueChange } = props;
  const [selectedValue, setSelectedValue] = useState(value);
  const user = props.data;

  const handleChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setSelectedValue(selectedValue);
    onValueChange(selectedValue);

    // send API to backend to update
    axios.patch(`http://127.0.0.1:8000/api/updateuser/${user.id}`, {
      "status": selectedValue,
    })
      .then((response) => {
        console.log(JSON.stringify(response.data), "SSSSSSSSSSSSSSss");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <select value={selectedValue} onChange={handleChange}>
      {Object.keys(StatusEnum).map((key) => (
        <option key={StatusEnum[key]} value={StatusEnum[key]}>
          {key}
        </option>
      ))}
    </select>
  );
}

DropdownRenderer.propTypes = {
  value: PropTypes.number,
  onValueChange: PropTypes.func,
};

export default  DropdownRenderer

