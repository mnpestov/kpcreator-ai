import React from 'react';
import './ProtoSwitch.css';

const ProtoSwitch = ({ checked, onChange, disabled = false, label }) => {
  return (
    <label className={`proto-switch-label ${disabled ? 'proto-switch-disabled' : ''}`}>
      <div className="proto-switch-wrapper">
        <input
          type="checkbox"
          className="proto-switch-input"
          checked={checked}
          onChange={(e) => {
            if (!disabled && onChange) {
              onChange(e.target.checked);
            }
          }}
          disabled={disabled}
        />
        <div className="proto-switch-track">
          <div className="proto-switch-thumb" />
        </div>
      </div>
      {label && <span className="proto-switch-text">{label}</span>}
    </label>
  );
};

export default ProtoSwitch;
