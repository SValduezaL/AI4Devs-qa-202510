# LTI Talent Tracking System - Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

- Node.js v16 or higher
- pnpm (install globally with `npm install -g pnpm`)
- Backend server running on http://localhost:3010

## Getting Started

### 1. Install dependencies

```sh
cd frontend
pnpm install
```

### 2. Configure environment variables

Make sure the `.env` file in the root directory contains:

```env
REACT_APP_API_URL=http://localhost:3010
FRONTEND_PORT=3000
```

### 3. Start the development server

```sh
pnpm start
```

The app will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

The page will reload when you make edits. You will also see any lint errors in the console.

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `pnpm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   ├── services/    # API service calls
│   ├── config/      # Configuration files
│   └── App.js       # Main application component
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Connecting to Backend

This frontend expects the backend API to be running on `http://localhost:3010`. Make sure:

1. The backend is running before starting the frontend
2. The `REACT_APP_API_URL` environment variable is correctly set
3. CORS is properly configured in the backend to allow requests from `http://localhost:3000`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
