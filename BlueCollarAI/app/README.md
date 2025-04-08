# BlueCollarAI App Structure

This document outlines the structure of the BlueCollarAI app, which uses Expo Router for navigation.

## Directory Structure

```
app/
├── (client)/             # Client role group
│   ├── (tabs)/           # Client tab screens
│   │   ├── _layout.js    # Tab layout for client
│   │   ├── index.js      # Dashboard/home screen
│   │   ├── post-job.js   # Post job screen
│   │   ├── find-workers.js # Find workers screen
│   │   ├── messages.js   # Client messages
│   │   └── payment.js    # Payment screen
│   └── _layout.js        # Parent layout for client
├── (worker)/             # Worker role group
│   ├── (tabs)/           # Worker tab screens
│   │   ├── _layout.js    # Tab layout for worker
│   │   ├── index.js      # Available jobs
│   │   ├── my-jobs.js    # Worker's current jobs
│   │   ├── messages.js   # Worker messages
│   │   └── profile.js    # Worker profile
│   ├── _layout.js        # Parent layout for worker
│   └── profile-setup.js  # Profile setup screen
├── auth/                 # Authentication screens
│   ├── login.js          # Login screen
│   └── signup.js         # Signup screen
├── job/                  # Job-related screens
│   └── [id].js           # Job details (dynamic route)
├── _layout.tsx           # Root layout
├── index.js              # Entry screen
├── role-selection.js     # Role selection screen
├── conversation.js       # Conversation screen
├── explore.js            # Explore screen
├── settings.js           # Settings screen
└── theme/                # Theme-related files
    └── index.js          # Theme definition
```

## Navigation Structure

The app uses Expo Router with a nested navigation structure:

1. **Root Stack** (_layout.tsx): Main app navigation
   - Entry points (index.js, role-selection.js)
   - Authentication (auth/login.js, auth/signup.js)
   - Role-specific groups ((worker) and (client))
   - Shared screens (job/[id].js, conversation.js, settings.js, explore.js)

2. **Worker Flow** ((worker)/_layout.js):
   - Stack with profile setup and tabs
   - Tab navigation for core worker screens

3. **Client Flow** ((client)/_layout.js):
   - Tab navigation for core client screens

## Theme

The app uses a consistent theme defined in the theme directory. 