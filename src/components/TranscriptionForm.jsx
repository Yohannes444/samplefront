import { useState } from 'react';

  const TranscriptionForm = ({ onTranscriptionResult }) => {
    const [audioUrl, setAudioUrl] = useState('');
    const [meetingId, setMeetingId] = useState('');
    const [userId, setUserId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
      try {
        const response = await fetch('http://localhost:3000/transcription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioUrl, meetingId, userId }),
        });
        if (!response.ok) throw new Error('Failed to transcribe audio');
        const data = await response.json();
        setResult({
          summary: data.summary,
          actionItems: data.actionItems,
        });
        onTranscriptionResult?.(data); // Optional callback for Redux
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Transcribe Audio</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Audio URL</label>
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.assemblyai.com/static/sample.wav"
          />
        </div>
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
          Transcribe Audio
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {result && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-600">Transcription Result:</h4>
            <p className="text-gray-800"><strong>Summary:</strong> {result.summary}</p>
            <h5 className="text-sm font-medium mt-2 text-gray-600">Action Items:</h5>
            <ul className="list-disc pl-5 text-gray-800">
              {result.actionItems.map((item, index) => (
                <li key={index}>
                  {item.task} (Assigned to: {item.assignedTo}, Due: {new Date(item.dueDate).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  export default TranscriptionForm;