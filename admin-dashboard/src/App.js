import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import Athletes from './pages/Athletes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

import './App.css';

const { Content } = Layout;
const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    localStorage.getItem('adminToken') !== null
  );

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <Login onLogin={() => setIsAuthenticated(true)} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar />
          <Layout>
            <Header onLogout={() => setIsAuthenticated(false)} />
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/athletes" element={<Athletes />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;