// DropdownRenderer.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { StatusEnum, GenderEnum } from './Enum'; // Import both StatusEnum and GenderEnum

function DropdownRenderer(props) {
  const { field, value = 0, onValueChange, data } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setSelectedValue(newValue);
    onValueChange(newValue);

    // Send API to backend to update
    axios.patch(`http://127.0.0.1:8000/api/updateuser/${data.id}`, {
      [gender]: newValue,
    })
      .then((response) => {
        console.log(JSON.stringify(response.data), "Updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const enumValues = field === 'status' ? Object.values(StatusEnum) : Object.values(GenderEnum);

  return (
    <select value={selectedValue} onChange={handleChange}>
      <option value={null}>Select {field.charAt(0).toUpperCase() + field.slice(1)}</option>
      {enumValues.map((enumValue) => (
        <option key={enumValue} value={enumValue}>
          {enumValue === GenderEnum.MALE ? 'Male' : 'Female'}{/* Convert enum value to a more human-readable format for gender */}
        </option>
      ))}
    </select>
  );
}

DropdownRenderer.propTypes = {
  field: PropTypes.string.isRequired, // 'status' or 'gender'
  value: PropTypes.number,
  onValueChange: PropTypes.func,
  data: PropTypes.object,
};

export default DropdownRenderer;
