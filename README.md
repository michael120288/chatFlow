# QA Hub — Frontend

A full-stack QA automation practice platform built with React. Includes a real-time social app, interactive UI scenarios for Playwright/Cypress practice, and a level-based testing game.

You can find the backend repo [here](https://github.com/michael120288/chatty-backend).

## Features

1. Signup and signin authentication
2. Forgot password and reset password
3. Change password when logged in
4. Create, read, update and delete posts with images and GIFs
5. Post reactions and comments
6. Followers, following, block and unblock
7. Private chat messaging with text, images, GIFs, and reactions
8. Image upload via Cloudinary
9. In-app and email notifications
10. 39 interactive QA practice scenarios (forms, drag-and-drop, WebSocket, virtual scroll, and more)
11. Level-based Playwright/Cypress learning game with XP system
12. Flashcard decks for test automation learning
13. Real-time updates via Socket.IO
14. Unit tests with Jest and React Testing Library

## Tech Stack

|||||
|:-:|:-:|:-:|:-:|
| React 18 | Redux Toolkit | Axios | Socket.IO |
| React Router v6 | SASS | Date-fns | Lodash |
| Jest | React Testing Library | MSW | ESLint + Prettier |

## Requirements

- Node 16.x or higher
- Copy `.env.develop` to `.env` and fill in the required values:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GIPHY_API_KEY=your_giphy_key
```

You can get a free Giphy API key at [developers.giphy.com](https://developers.giphy.com/).

## Local Installation

```bash
git clone -b develop https://github.com/michael120288/chatFlow
cd chatFlow
npm install
npm start
```

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

## Deployment

| Layer | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | MongoDB Atlas |
| Redis | Upstash |
| Media | Cloudinary |

### Deploy to Vercel

1. Push to GitHub
2. Import repo at vercel.com
3. Add env vars: `REACT_APP_API_URL`, `REACT_APP_GIPHY_API_KEY`
4. Deploy

## Linting

```bash
npm run lint:check
npm run lint:fix
```
