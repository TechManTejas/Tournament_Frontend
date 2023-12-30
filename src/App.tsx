import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Context } from "./context/context.provider";
import { Authentication } from "./pages/Authentication"
import { Dashboard } from "./pages/Dashboard"
import { Lobby } from "./pages/Lobby"
import PUBLICMATCHVIEWS from './pages/_PUBLICMATCHVIEWS_';

function App() {

  const { userAuthenticated, userVerified } = Context();

  return (
    <Router>
      <Routes>
        <Route
          path="/live"
          element={<PUBLICMATCHVIEWS/>}
        />
        <Route
          path="/"
          element={
            <>
              {
                !userAuthenticated &&
                <Navigate to="/auth" replace={true} />
              }
              {
                userAuthenticated &&
                <Navigate to="/lobby" replace={true} />
              }
              {
                userVerified &&
                <Navigate to="/dashboard" replace={true} />
              }
            </>
          }
        />
        {
          !userAuthenticated &&
          <Route
            path="/auth"
            element={<Authentication />}
          />
        }
        {
          userAuthenticated &&
          <>
            {
              !userVerified &&
              <Route
                path="/lobby"
                element={<Lobby />}
              />
            }
            {
              userVerified &&
              <Route
                path="/dashboard/*"
                element={<Dashboard />}
              />
            }
          </>
        }
      </Routes>
    </Router>
  )
}

export default App
