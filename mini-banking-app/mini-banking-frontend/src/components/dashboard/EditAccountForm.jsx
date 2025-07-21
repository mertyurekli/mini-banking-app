import React, { useState } from 'react';

const EditAccountForm = ({ account, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: account.name || '',
    type: account.type || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...account,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="name">Account Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="type">Account Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select Account Type</option>
          <option value="SAVING">Savings</option>
          <option value="CREDIT">Credit</option>
        </select>
      </div>



      <div className="modal-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditAccountForm; 