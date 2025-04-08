// Mock data for the BlueCollar.ai frontend demo

// Users (both workers and clients)
export const users = [
  {
    id: 'w1',
    name: 'James Wilson',
    email: 'james@example.com',
    password: 'password123',
    role: 'worker',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'w2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'worker',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'w3',
    name: 'Miguel Rodriguez',
    email: 'miguel@example.com',
    password: 'password123',
    role: 'worker',
    profilePicture: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: 'c1',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    password: 'password123',
    role: 'client',
    profilePicture: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    id: 'c2',
    name: 'David Chen',
    email: 'david@example.com',
    password: 'password123',
    role: 'client',
    profilePicture: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
];

// Worker profiles
export const workerProfiles = [
  {
    userId: 'w1',
    skills: ['Plumbing', 'Pipe Fitting', 'Emergency Repairs'],
    rate: 45, // hourly rate in USD
    serviceAreas: ['San Francisco', 'Oakland', 'Berkeley'],
    ratings: 4.8,
    reviews: [
      {
        clientId: 'c1',
        rating: 5,
        text: 'James did an excellent job fixing our kitchen sink. Fast and reliable service.',
        date: '2025-03-28',
      },
      {
        clientId: 'c2',
        rating: 4.5,
        text: 'Fixed our bathroom leak quickly. Would hire again.',
        date: '2025-03-15',
      },
    ],
    bio: 'Licensed plumber with 10+ years of experience in residential and commercial settings. Specializing in emergency repairs and installations.',
    lat: 37.7749,
    long: -122.4194,
  },
  {
    userId: 'w2',
    skills: ['Electrical', 'Wiring', 'Lighting Installation'],
    rate: 50,
    serviceAreas: ['San Francisco', 'San Mateo', 'Daly City'],
    ratings: 4.6,
    reviews: [
      {
        clientId: 'c2',
        rating: 5,
        text: 'Sarah rewired our home office and installed new lighting. Professional and knowledgeable.',
        date: '2025-03-22',
      },
    ],
    bio: 'Certified electrician focused on residential projects. I take pride in clean, safe work that exceeds code requirements.',
    lat: 37.7835,
    long: -122.4246,
  },
  {
    userId: 'w3',
    skills: ['Carpentry', 'Furniture Assembly', 'Custom Cabinets'],
    rate: 40,
    serviceAreas: ['Oakland', 'Berkeley', 'Alameda'],
    ratings: 4.9,
    reviews: [
      {
        clientId: 'c1',
        rating: 5,
        text: 'Miguel built custom shelving for our living room. The craftsmanship is excellent!',
        date: '2025-04-01',
      },
    ],
    bio: 'Skilled carpenter specializing in custom furniture and cabinet making. Creating functional, beautiful pieces for over 7 years.',
    lat: 37.8044,
    long: -122.2711,
  },
];

// Jobs
export const jobs = [
  {
    id: 'j1',
    title: 'Fix Leaking Kitchen Sink',
    description: 'Need an experienced plumber to fix a persistent leak under the kitchen sink. Some cabinet repair may also be needed.',
    category: 'Plumbing',
    budget: 150,
    location: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    distance: 2.5,
    datePosted: '2024-03-28',
    status: 'Open',
    clientId: 'c1',
    applications: ['w2'],
    assignedWorker: null
  },
  {
    id: 'j2',
    title: 'Bathroom Renovation',
    description: 'Complete bathroom remodel including new tiles, fixtures, and plumbing work.',
    category: 'Construction',
    budget: 5000,
    location: 'Oakland, CA',
    latitude: 37.8044,
    longitude: -122.2711,
    distance: 5.1,
    datePosted: '2024-03-27',
    status: 'Open',
    clientId: 'c2',
    applications: ['w1', 'w3'],
    assignedWorker: null
  },
  {
    id: 'j3',
    title: 'Install New Light Fixtures',
    description: 'Need an electrician to install 3 new ceiling light fixtures in living room and bedrooms.',
    category: 'Electrical',
    budget: 300,
    location: 'Berkeley, CA',
    latitude: 37.8715,
    longitude: -122.2730,
    distance: 7.8,
    datePosted: '2024-03-26',
    status: 'In Progress',
    clientId: 'c3',
    applications: ['w2'],
    assignedWorker: 'w2'
  },
  {
    id: 'j4',
    clientId: 'c2',
    title: 'Bathroom Sink Replacement',
    description: 'Need to replace an old bathroom sink with a new one. All materials will be provided.',
    location: 'Sunset District, San Francisco',
    category: 'Plumbing',
    budget: 175,
    status: 'Open',
    datePosted: '2025-04-06',
    lat: 37.7617,
    long: -122.4925,
    applications: [],
  },
  {
    id: 'j5',
    clientId: 'c1',
    title: 'Outdoor Deck Repair',
    description: 'Some boards on our deck are damaged and need replacement. Area is approximately 30 square feet.',
    location: 'Oakland, CA',
    category: 'Carpentry',
    budget: 300,
    status: 'Open',
    datePosted: '2025-04-04',
    lat: 37.8044,
    long: -122.2711,
    applications: ['w3'],
  },
];

// Messages
export const messages = [
  {
    id: 'm1',
    jobId: 'j2',
    senderId: 'c2',
    receiverId: 'w2',
    text: 'Hi Sarah, are you available to start the light fixture installation tomorrow around 10am?',
    timestamp: '2025-04-04T14:30:00Z',
    read: true,
  },
  {
    id: 'm2',
    jobId: 'j2',
    senderId: 'w2',
    receiverId: 'c2',
    text: 'Hello David, yes I can be there at 10am tomorrow. Do you have all the fixtures ready?',
    timestamp: '2025-04-04T14:45:00Z',
    read: true,
  },
  {
    id: 'm3',
    jobId: 'j2',
    senderId: 'c2',
    receiverId: 'w2',
    text: 'Great! Yes, I have all three fixtures unpacked and ready for installation.',
    timestamp: '2025-04-04T15:00:00Z',
    read: true,
  },
  {
    id: 'm4',
    jobId: 'j3',
    senderId: 'w3',
    receiverId: 'c1',
    text: 'I\'ve completed the bookshelf installation. Please take a look and let me know if you need any adjustments.',
    timestamp: '2025-04-01T16:45:00Z',
    read: true,
  },
  {
    id: 'm5',
    jobId: 'j3',
    senderId: 'c1',
    receiverId: 'w3',
    text: 'The bookshelf looks perfect, Miguel! Thank you for the excellent work.',
    timestamp: '2025-04-01T17:30:00Z',
    read: true,
  },
  {
    id: 'm6',
    jobId: 'j1',
    senderId: 'w1',
    receiverId: 'c1',
    text: 'I saw your job posting about the kitchen sink. I\'m available to take a look tomorrow if that works for you.',
    timestamp: '2025-04-06T09:15:00Z',
    read: false,
  },
];

// Categories for job filtering
export const categories = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Landscaping',
  'Roofing',
  'HVAC',
  'Flooring',
  'Moving',
  'Cleaning',
  'General Labor',
];

// Function to simulate API calls with mock data
export const mockApiCall = (endpoint, method = 'GET', data = null) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      switch (endpoint) {
        case 'users/login':
          const user = users.find(
            (u) => u.email === data.email && u.password === data.password
          );
          resolve(user || { error: 'Invalid credentials' });
          break;
        
        case 'jobs':
          resolve(jobs);
          break;
        
        case 'jobs/active':
          // Return jobs that are Open or In Progress
          const activeJobs = jobs.filter(job => ['Open', 'In Progress'].includes(job.status));
          resolve(activeJobs);
          break;

        case 'workers/nearby':
          // Return all worker profiles for demo
          resolve(workerProfiles);
          break;
        
        case 'jobs/nearby':
          // Filter jobs by location (mock implementation)
          const nearbyJobs = jobs.filter(job => job.status === 'Open');
          resolve(nearbyJobs);
          break;
        
        case `workers/${data?.userId}`:
          const worker = workerProfiles.find(w => w.userId === data.userId);
          resolve(worker || { error: 'Worker not found' });
          break;
        
        case `jobs/${data?.jobId}`:
          const job = jobs.find(j => j.id === data.jobId);
          resolve(job || { error: 'Job not found' });
          break;
        
        case `messages/${data?.userId}`:
          const userMessages = messages.filter(
            m => m.senderId === data.userId || m.receiverId === data.userId
          );
          resolve(userMessages || []);
          break;
        
        default:
          resolve({ error: 'Endpoint not found' });
      }
    }, 500); // 500ms delay to simulate network
  });
};

// Add default export for the file
export default {
  users,
  workerProfiles,
  jobs,
  messages,
  categories,
  mockApiCall
};