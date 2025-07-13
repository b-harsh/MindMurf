import React, { useState } from 'react';

const AuthForm = ({ type, submitForm }) => {
  const isSignup = type === 'signup';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: 'en',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        submitForm(form);
      }}
    >
      <h2 className="text-2xl font-bold text-center text-blue-600">
        {isSignup ? 'Sign Up' : 'Login'}
      </h2>

      {isSignup && (
        <>
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />

          <select
            className="input"
            name="preferredLanguage"
            onChange={handleChange}
            value={form.preferredLanguage}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="mr">Marathi</option>
            <option value="ta">Tamil</option>
          </select>
        </>
      )}

      <input
        className="input"
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        className="input"
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button type="submit" className="btn w-full">
        {isSignup ? 'Create Account' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;
