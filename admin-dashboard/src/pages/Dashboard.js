import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Tag } from 'antd';
import { 
  UserOutlined, 
  VideoCameraOutlined, 
  TrophyOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data - in production, this would come from API
  const stats = {
    totalAthletes: 15420,
    totalAssessments: 45680,
    pendingReviews: 234,
    approvedAssessments: 42150
  };

  const recentAssessments = [
    {
      key: '1',
      athlete: 'Rahul Kumar',
      testType: 'Vertical Jump',
      score: 'Excellent',
      status: 'Approved',
      date: '2024-01-15'
    },
    {
      key: '2',
      athlete: 'Priya Sharma',
      testType: 'Shuttle Run',
      score: 'Good',
      status: 'Pending Review',
      date: '2024-01-15'
    },
    {
      key: '3',
      athlete: 'Arjun Singh',
      testType: 'Sit-ups',
      score: 'Average',
      status: 'Flagged',
      date: '2024-01-14'
    }
  ];

  const monthlyData = [
    { month: 'Jan', assessments: 3200, athletes: 1200 },
    { month: 'Feb', assessments: 3800, athletes: 1400 },
    { month: 'Mar', assessments: 4200, athletes: 1600 },
    { month: 'Apr', assessments: 4800, athletes: 1800 },
    { month: 'May', assessments: 5200, athletes: 2000 }
  ];

  const testTypeData = [
    { name: 'Vertical Jump', value: 25, color: '#8884d8' },
    { name: 'Shuttle Run', value: 20, color: '#82ca9d' },
    { name: 'Sit-ups', value: 22, color: '#ffc658' },
    { name: 'Endurance Run', value: 18, color: '#ff7300' },
    { name: 'Height & Weight', value: 15, color: '#00ff00' }
  ];

  const columns = [
    {
      title: 'Athlete',
      dataIndex: 'athlete',
      key: 'athlete',
    },
    {
      title: 'Test Type',
      dataIndex: 'testType',
      key: 'testType',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => {
        const color = score === 'Excellent' ? 'green' : score === 'Good' ? 'blue' : 'orange';
        return <Tag color={color}>{score}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Approved' ? 'green' : status === 'Pending Review' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>AthletIQ Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Athletes"
              value={stats.totalAthletes}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Assessments"
              value={stats.totalAssessments}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Reviews"
              value={stats.pendingReviews}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Approved Assessments"
              value={stats.approvedAssessments}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="Monthly Assessment Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="assessments" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="athletes" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Test Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {testTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="System Performance">
            <div style={{ marginBottom: 16 }}>
              <div>AI Processing Accuracy</div>
              <Progress percent={94} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div>Cheat Detection Rate</div>
              <Progress percent={87} status="active" strokeColor="#52c41a" />
            </div>
            <div>
              <div>System Uptime</div>
              <Progress percent={99.8} status="active" strokeColor="#1890ff" />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Regional Distribution">
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Maharashtra</span>
                <span>3,245 athletes</span>
              </div>
              <Progress percent={21} showInfo={false} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Karnataka</span>
                <span>2,890 athletes</span>
              </div>
              <Progress percent={18} showInfo={false} strokeColor="#52c41a" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tamil Nadu</span>
                <span>2,456 athletes</span>
              </div>
              <Progress percent={16} showInfo={false} strokeColor="#faad14" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Others</span>
                <span>6,829 athletes</span>
              </div>
              <Progress percent={45} showInfo={false} strokeColor="#f5222d" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Assessments Table */}
      <Card title="Recent Assessments">
        <Table 
          columns={columns} 
          dataSource={recentAssessments} 
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Dashboard;