import express from 'express';

const app = express();
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[Mock Server] ${req.method} ${req.url}`);
  next();
});

// Mock Auth
app.post('/api/auth/login', (req, res) => {
  res.status(200).json({
    success: true,
    token: 'mock-jwt-token-value',
    user: {
      id: 'mock_user_123',
      name: 'Ladi Akshay',
      email: 'ladi@iiest.ac.in'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Mock registration successful'
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: 'mock_user_123',
      name: 'Ladi Akshay',
      email: 'ladi@iiest.ac.in',
      college: 'IIEST Shibpur',
      branch: 'CST',
      graduationYear: 2027
    }
  });
});

// Mock Resume
app.get('/api/resume', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: 'mock_resume_123',
      originalFileName: 'Ladi_Akshay_Resume_2026.pdf',
      mimeType: 'application/pdf',
      fileSize: 1048576, // 1 MB
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  });
});

// Mock Applications
const mockApps = [
  {
    _id: 'app_1',
    companyName: 'Google',
    role: 'Software Engineering Intern',
    source: 'linkedin',
    currentStage: 'Technical Interview',
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextEventType: 'Technical Assessment 1',
    nextEventDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    jobDescription: 'Seeking highly motivated software engineers to join Google Cloud team. Core skills: React, Node.js, distributed database scaling, algorithms.',
    notes: 'Referred by a senior. Technical round scheduled for 45 mins focusing on system design & data structures.',
    statusHistory: [
      { status: 'Applied', changedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'OA Scheduled', changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'OA Cleared', changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'Technical Interview', changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'app_2',
    companyName: 'Microsoft',
    role: 'SDE-1 Full Stack',
    source: 'oncampus',
    currentStage: 'Offered',
    appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    nextEventType: '',
    nextEventDate: null,
    jobDescription: 'Design user interfaces and backend API orchestration layers using React, TypeScript, C# and Azure.',
    notes: 'Completed 3 rounds of interviews. Offered package letter received on Friday.',
    statusHistory: [
      { status: 'Applied', changedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'Technical Interview', changedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'HR Interview', changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'Offered', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    _id: 'app_3',
    companyName: 'Amazon',
    role: 'Front End Engineer',
    source: 'indeed',
    currentStage: 'OA Cleared',
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    nextEventType: 'Technical Interview Prep',
    nextEventDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    jobDescription: 'Implement interactive web applications using HTML5, CSS3, ES6, React, and modular styling.',
    notes: 'OA had 2 coding questions. Cleared both. Waiting for coordinator to schedule interview rounds.',
    statusHistory: [
      { status: 'Applied', changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'OA Scheduled', changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { status: 'OA Cleared', changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

app.get('/api/applications', (req, res) => {
  res.status(200).json({
    success: true,
    count: mockApps.length,
    data: mockApps
  });
});

app.get('/api/applications/stats', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      summary: {
        Applied: 0,
        'OA Scheduled': 0,
        'OA Cleared': 1,
        'Technical Interview': 1,
        'HR Interview': 0,
        Offered: 1,
        Rejected: 0
      },
      totalApplications: mockApps.length,
      groupedApplications: {}
    }
  });
});

app.get('/api/applications/analytics', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalApplications: 3,
        activeApplications: 2,
        offers: 1,
        rejections: 0,
        offerRate: 33.3,
        rejectionRate: 0
      },
      stageDistribution: {
        Applied: 0,
        'OA Scheduled': 0,
        'OA Cleared': 1,
        'Technical Interview': 1,
        'HR Interview': 0,
        Offered: 1,
        Rejected: 0
      },
      sourceDistribution: {
        linkedin: 1,
        oncampus: 1,
        indeed: 1
      },
      monthlyApplicationTrend: [
        { month: '2026-06', applications: 1 },
        { month: '2026-07', applications: 2 }
      ],
      conversionRates: {
        appliedToOA: 100,
        oaScheduledToCleared: 100,
        oaClearedToTechnical: 50,
        technicalToHR: 0,
        hrToOffer: 0
      }
    }
  });
});

app.get('/api/applications/:id', (req, res) => {
  const app = mockApps.find(a => a._id === req.params.id);
  if (app) {
    res.status(200).json({ success: true, data: app });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

// Mock AI Prep History
app.get('/api/ai/history/:id', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      exists: true,
      isStale: false,
      preparationId: 'prep_mock_1',
      promptVersion: 'v1.6',
      mode: 'full',
      result: {
        technicalQuestions: [
          {
            question: 'What is the difference between Virtual DOM and Shadow DOM?',
            difficulty: 'Medium',
            expectedAnswer: 'The Virtual DOM is a React-specific lightweight copy of the real DOM used to compute updates (reconciliation). The Shadow DOM is a web standard used for encapsulating styling inside Web Components (e.g. video player controls).',
            topic: 'React'
          },
          {
            question: 'How do you optimize render performance in a large React application?',
            difficulty: 'Hard',
            expectedAnswer: 'Optimize by: using React.memo for component memoization, useCallback/useMemo to prevent reference changes, windowing/virtualization (like react-window) for long lists, lazy loading components via Suspense, and debouncing user inputs.',
            topic: 'React'
          },
          {
            question: 'Explain the difference between call, apply, and bind in JavaScript.',
            difficulty: 'Medium',
            expectedAnswer: 'All three modify the "this" context. call() invokes the function immediately with comma-separated arguments. apply() invokes immediately with arguments passed as an array. bind() returns a new function with the context preset, to be executed later.',
            topic: 'JavaScript'
          }
        ],
        hrQuestions: [
          {
            question: 'Tell me about a time you had to adapt to a sudden change in project specifications.',
            starHint: 'S: During an academic hackathon, specs were updated 4 hours before deadline. T: Pivot frontend interface integration vector. A: Conducted quick sync, refactored Axios interceptors, utilized mock caching endpoints. R: Delivered working MVP on time, won top 5 team placement.'
          },
          {
            question: 'Why do you want to work at Google?',
            starHint: 'S: Technical alignment and engineering culture. T: Showcase understanding of Google Cloud ecosystem. A: Mention interest in working on distributed systems at scale. R: Demonstrate how my personal values match Googles open collaboration standard.'
          }
        ],
        studyRoadmap: {
          roadmap: [
            {
              day: 1,
              focus: 'Advanced State Orchestration & Custom Hooks',
              topics: ['State batching in React 18/19', 'Context API performance limits', 'Writing clean hooks (useSession, useFetch)'],
              resources: ['Official React Docs', 'Kent C Dodds Blog']
            },
            {
              day: 2,
              focus: 'Browser Performance Diagnostics',
              topics: ['Lighthouse Audits', 'Core Web Vitals (LCP, FID, CLS)', 'Optimizing network bundle size'],
              resources: ['web.dev/vitals', 'Chrome DevTools documentation']
            },
            {
              day: 3,
              focus: 'MERN API Security Best Practices',
              topics: ['JWT expiry rotations', 'XSS sanitizers (DOMPurify)', 'NoSQL query injection prevention'],
              resources: ['OWASP Top 10 Security cheat sheets']
            }
          ]
        },
        generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  });
});

app.post('/api/ai/prepare', (req, res) => {
  // Simulate delay
  setTimeout(() => {
    res.status(201).json({
      success: true,
      message: 'Mock prep generated successfully',
      data: {
        _id: 'prep_mock_2',
        companyName: 'Google',
        role: 'Software Engineering Intern',
        mode: 'full',
        promptVersion: 'v1.6',
        technicalQuestions: [
          {
            question: 'Explain the working of event delegation in JavaScript and why it is useful.',
            difficulty: 'Medium',
            expectedAnswer: 'Event delegation uses event bubbling: you bind a single event listener to a parent element rather than binding multiple listeners to child elements. This improves memory usage and handles dynamically added children automatically.',
            topic: 'JavaScript'
          }
        ],
        hrQuestions: [
          {
            question: 'How do you handle disagreement with your team lead on technical design?',
            starHint: 'S: Team lead preferred SQL, I proposed NoSQL. T: Make design trade-off visible. A: Developed a quick Benchmark test case. R: Agreed on a hybrid design that satisfied scaling requirements.'
          }
        ],
        studyRoadmap: {
          roadmap: [
            {
              day: 1,
              focus: 'Data Structures review',
              topics: ['Trie insertions', 'Graph traversals (BFS/DFS)', 'Heap sorting'],
              resources: ['LeetCode', 'GeeksForGeeks']
            }
          ]
        },
        generatedAt: new Date().toISOString()
      }
    });
  }, 3000);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`[Mock Server] Mock backend active on port ${PORT}`);
});
