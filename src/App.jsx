import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { initializeUser, selectUser } from "./redux/slice/userSlice";

import Login from "./pages/Login";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import ErrorPage from "./pages/404";

import Dashboard from "./components/Dashboard";
import UserForm from './components/UserForm';
import MeetingAssistant from './components/MeetingAssistant';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);

  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(initializeUser());
      setLoading(false);
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div>
      {user && user.token && <Topbar userRole={user.user.role} />}
      <div style={{ padding: "0px" }}>
        {user && user.token && <Sidebar userRole={user.user.role} />}
        <div style={{ marginLeft: user && user.token ? 200 : 0 }}>
          <Routes>
           
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard userRole={user.user.role} />} />
                  <Route path="/meeting-assistant" element={<MeetingAssistant />} />
           
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard userRole={user.user.role} />} />
                  <Route path="/meeting-assistant" element={<MeetingAssistant />} />
              
              <Route path="/" element={<Login />} />
            
            <Route path="/signup" element={<UserForm />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;