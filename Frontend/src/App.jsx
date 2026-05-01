import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ShareView from './pages/ShareView';
import './index.css';

// Protected Route Component
const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// Main Layout for Chat
const ChatLayout = () => (
  <ChatProvider>
    <div className="app-container">
      <Sidebar />
      <ChatArea />
    </div>
  </ChatProvider>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:threadId" element={<ShareView />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatLayout />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
