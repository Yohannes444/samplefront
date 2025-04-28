import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slice/userSlice';
import io from 'socket.io-client';

const MeetingAssistant = () => {
  const user = useSelector(selectUser);
  const [meetingId, setMeetingId] = useState('');
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [junk, setJunk] = useState([]);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      if (!response.ok) throw new Error('Server not responding');
      const data = await response.json();
      return data.status === 'Server is running' && data.socketIo === 'active';
    } catch (err) {
      console.error('[Health] Check failed:', err);
      return false;
    }
  };

  const startMeeting = async () => {
    try {
      if (!meetingId) throw new Error('Meeting ID is required');
      if (!user?.user?._id) throw new Error('User not authenticated');
      setError('');

      let retries = 3;
      let serverReady = await checkServerHealth();
      while (!serverReady && retries > 0) {
        console.log(`[Health] Server not ready, retrying (${retries} left)...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        serverReady = await checkServerHealth();
        retries--;
      }
      if (!serverReady) throw new Error('Server is not available');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      setMediaRecorder(recorder);

      const newSocket = io('http://localhost:3000', {
        query: { meetingId, userId: user.user._id },
        path: '/socket.io/',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('[Socket.IO] Connected:', newSocket.id);
        setIsMeetingActive(true);
        recorder.start(100);
      });

      newSocket.on('meetingStatus', ({ status }) => {
        console.log('[Socket.IO] Meeting status:', status);
        if (status === 'active') {
          setIsMeetingActive(true);
        }
      });

      newSocket.on('transcription', ({ text, timestamp }) => {
        console.log('[Transcription] Received:', text);
        setTranscriptions(prev => [...prev, { text, timestamp }]);
      });

      newSocket.on('agenda', (newItems) => {
        console.log('[Agenda] Received:', newItems);
        setAgenda(prev => [...prev, ...newItems]);
      });

      newSocket.on('actionItem', (item) => {
        console.log('[ActionItem] Received:', item);
        setActionItems(prev => [...prev, item]);
      });

      newSocket.on('scheduledEvent', (event) => {
        console.log('[ScheduledEvent] Received:', event);
        setScheduledEvents(prev => [...prev, event]);
      });

      newSocket.on('junk', ({ text, timestamp }) => {
        console.log('[Junk] Received:', text);
        setJunk(prev => [...prev, { text, timestamp }]);
      });

      newSocket.on('error', ({ message }) => {
        console.error('[Socket.IO] Error:', message);
        setError(message);
      });

      newSocket.on('connect_error', (err) => {
        console.error('[Socket.IO] Connect error:', err);
        setError('Failed to connect to server: ' + err.message);
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && newSocket.connected) {
          console.log(`[Audio] Sending chunk: ${event.data.size} bytes`);
          newSocket.emit('audio', event.data);
        }
      };

      newSocket.on('disconnect', () => {
        console.log('[Socket.IO] Disconnected');
        setIsMeetingActive(false);
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (err) {
      console.error('[Meeting] Start error:', err);
      setError(err.message);
    }
  };

  const endMeeting = () => {
    if (socket) {
      socket.disconnect();
      console.log('[Socket.IO] Manually disconnected');
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsMeetingActive(false);
  };

  useEffect(() => {
    let interval;
    if (isMeetingActive && meetingId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:3000/meeting-events/${meetingId}`);
          if (!response.ok) throw new Error('Failed to fetch meeting events');
          const data = await response.json();
          setAgenda(data.agenda || []);
          setActionItems(data.actionItems || []);
          setScheduledEvents(data.scheduledEvents || []);
        } catch (err) {
          console.error('[Fetch] Error:', err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isMeetingActive, meetingId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Meeting Assistant AI</h1>
      {!isMeetingActive ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
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
              onClick={startMeeting}
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
            >
              Start Meeting
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Transcription</h2>
            <div className="max-h-40 overflow-y-auto border border-gray-200 p-2 rounded-md">
              {transcriptions.map((t, index) => (
                <p key={index} className="text-gray-800">{t.text}</p>
              ))}
            </div>
            <button
              onClick={endMeeting}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
            >
              End Meeting
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Agenda</h2>
            {agenda.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-800">
                {agenda.map((item, index) => (
                  <li key={index}>{item.topic}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No agenda items yet.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Action Items</h2>
            {actionItems.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-800">
                {actionItems.map((item, index) => (
                  <li key={index}>
                    {item.task} (Assigned to: {item.assignedTo}, Due: {new Date(item.dueDate).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No action items yet.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Scheduled Meetings</h2>
            {scheduledEvents.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-800">
                {scheduledEvents.map((event, index) => (
                  <li key={index}>
                    {event.summary} at {new Date(event.startTime).toLocaleString()} (Attendees: {event.attendees.join(', ')})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No scheduled meetings yet.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Junk</h2>
            {junk.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-800">
                {junk.map((item, index) => (
                  <li key={index}>{item.text}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No junk items yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingAssistant;