import { useState } from 'react';

  const TasksButton = ({ onTasksCreated }) => {
    const [meetingId, setMeetingId] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
      try {
        const response = await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId }),
        });
        if (!response.ok) throw new Error('Failed to create tasks');
        const data = await response.json();
        setStatus(data.status);
        onTasksCreated?.(data); // Optional callback for Redux
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Create Tasks</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meeting ID</label>
          <input
            type="text"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="test123"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Tasks in Todoist
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {status && <p className="text-green-600 text-sm">{status}</p>}
      </div>
    );
  };

  export default TasksButton;