"use client"; // Add this line to mark the component as a client component

import { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message on new login attempt

    /**
     * here I am using api call to do a login. The way I noticed the problem with django CORS
     * was to try accessin other routes, to see what happens. well, they failed to fetch
     * while they should fire unauthorized action response.
     * This got me to thinking to double check the CORS. this time I actually reviewed 
     * The history of my browser (well as I said it was working for me before the meeting).
     * Then I realized I was calling to domain name instead of IP address.
     * To be honest, macintash OS is new to me so I considered this:
     * I take the mapping of localhost as domain name to 127.0.0.1 as IP address as granted,
     * Yet it is worth to double check if such a mapping is done.
     * A simple try yields positive result on this theory.
     * So, I dig a bit deeper and I realised it is actually the django's own developement server
     * which is not do the mapping. Then, I chose the simplest solution:
     * 
     * Add both IP address and domain name to my django CORS white list!
     */
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Handle successful login (e.g., redirect to mentors page)
      window.location.href = '/mentors';
    } else {
      const errorData = await response.json();
      setError(errorData.error); // Set the error message from the server
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Error message */}
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
