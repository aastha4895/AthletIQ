# AthletIQ - Sports Talent Assessment Platform

## 🏆 Overview
AthletIQ is an innovative mobile-based solution for democratizing sports talent assessment in India. The platform enables athletes to record fitness assessment videos and uses AI/ML for verification and analysis.

## ✨ Features
- 🎥 Video recording for fitness assessments
- 🤖 AI-based performance analysis using MediaPipe
- 📊 Real-time cheat detection
- 🏃‍♂️ Performance benchmarking against age/gender standards
- 🎮 Gamified user interface with progress tracking
- 🔒 Secure data transmission and storage

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript, MediaPipe AI
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI/ML**: MediaPipe Pose Detection
- **Authentication**: JWT
- **File Storage**: Local storage with upload support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/AthletIQ.git
cd AthletIQ
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start MongoDB
```bash
mongod
```

6. Start the backend server
```bash
cd backend
npm start
```

7. Open frontend
```bash
# Open frontend/landing-page.html in your browser
```

## 🏃‍♂️ Assessment Tests Supported
- Height & Weight measurement
- Vertical Jump analysis
- Shuttle Run timing
- Sit-ups counting
- Endurance Run tracking
- Tennis swing analysis
- Basketball shooting form
- Football ball control
- Running gait analysis
- Swimming stroke technique

## 🤖 AI Technology
- **MediaPipe Pose Detection**: Real-time body landmark tracking
- **Computer Vision**: Frame-by-frame video analysis
- **Movement Analysis**: Biomechanical assessment
- **Sport-Specific Algorithms**: Tailored analysis for each sport
- **Performance Scoring**: Accurate assessment based on form and technique

## 📱 Project Structure
```
AthletIQ/
├── frontend/           # Frontend application
│   ├── landing-page.html
│   ├── auth.html
│   ├── dashboard.html
│   ├── profile.html
│   └── js/
│       ├── api.js
│       └── mediapipe-ai.js
├── backend/            # Backend API
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── middleware/
└── docs/              # Documentation
```

## 🌐 Live Demo
- **Frontend**: [https://athletiq.vercel.app](https://athletiq.vercel.app)
- **Backend API**: [https://athletiq-backend.railway.app](https://athletiq-backend.railway.app)

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team
- **Developer**: Your Name
- **AI Integration**: MediaPipe Technology
- **Database**: MongoDB Atlas

## 🙏 Acknowledgments
- Google MediaPipe for AI pose detection
- MongoDB for database solutions
- Vercel and Railway for hosting

---
Made with ❤️ for Indian sports talent development