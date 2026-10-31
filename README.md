# VidChat: Frontend

The React client for **VidChat**, a language-exchange social app. You set your native and learning languages, find partners, add them as friends, and then chat or video call them in real time. Messaging and calls are powered by [Stream](https://getstream.io/).

**Live:** [mayurvideochat.netlify.app](https://mayurvideochat.netlify.app/)
**Backend repo:** [VideoChat-backend](https://github.com/mayurgarg08/VideoChat-backend)

## Features

- **Sign up / log in** with cookie-based JWT sessions
- **Onboarding:** set your bio, native language, learning language and location, and get a random avatar
- **Discover partners:** recommended users, each shown with language flags
- **Friends:** send, accept and track friend requests
- **Notifications** for incoming requests, accepted requests and new messages
- **1:1 real-time chat** with threads (Stream Chat React)
- **HD video calls** with speaker layout and call controls (Stream Video React SDK). Start a call from the chat with one click.
- **32 DaisyUI themes** with a theme picker, saved with Zustand
- Protected routes and loading states powered by TanStack Query

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, Vite |
| Styling | Tailwind CSS, DaisyUI |
| State / data | TanStack React Query, Zustand, Axios |
| Real-time | `stream-chat`, `stream-chat-react`, `@stream-io/video-react-sdk` |
| Routing | React Router |
| UI | Lucide icons, React Hot Toast |

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: friends and recommended learners |
| `/signup`, `/login` | Authentication |
| `/onboarding` | Complete your profile |
| `/friends` | Your friends |
| `/notifications` | Friend requests and alerts |
| `/chat/:id` | Chat with a friend |
| `/call/:id` | Video call |

## Getting started

### Prerequisites
- Node.js 18+
- The [backend](https://github.com/mayurgarg08/VideoChat-backend) running locally
- A free [Stream](https://getstream.io/) account (API key)

### Setup

```bash
git clone https://github.com/mayurgarg08/VideoChat-frontend.git
cd VideoChat-frontend
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5001/api
VITE_STREAM_API_KEY=your_stream_api_key
```

```bash
npm run dev       # http://localhost:5173
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | Run ESLint |

## Deployment

Deployed on Netlify. `public/_redirects` sends every route to `index.html` so client-side routing works.

## Author

**Mayur Garg** · [GitHub](https://github.com/mayurgarg08) · [LinkedIn](https://www.linkedin.com/in/mayur-garg-428a291b4/)
