import { useState } from 'react';

  const AgendaForm = ({ onAgendaGenerated }) => {
    const [meetingId, setMeetingId] = useState('');
    const [title, setTitle] = useState('');
    const [attendees, setAttendees] = useState('');
    const [userId, setUserId] = useState('');
    const [agenda, setAgenda] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
      try {
        const response = await fetch('http://localhost:3000/agenda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetingId,
            title,
            attendees: attendees.split(',').map(email => email.trim()),
            userId,
          }),
        });
        if (!response.ok) throw new Error('Failed to generate agenda');
        const data = await response.json();
        setAgenda(data);
        onAgendaGenerated?.(data); // Optional callback for Redux
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Generate Agenda</h3>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Team Sync"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Attendees (comma-separated emails)</label>
          <input
            type="text"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="user@example.com, user2@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="test_user"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Generate Agenda
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {agenda.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-600">Agenda Items:</h4>
            <ul className="list-disc pl-5 text-gray-800">
              {agenda.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  export default AgendaForm;