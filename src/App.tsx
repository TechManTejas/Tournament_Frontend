import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Context } from "./context/context.provider";
import { Authentication } from "./pages/Authentication"
import { Dashboard } from "./pages/Dashboard"
import { Lobby } from "./pages/Lobby"

function App() {

  const { userAuthenticated , authenticatedVerified} = Context();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace={true} />}
        />
        <Route
          path="/auth"
          element={
            authenticatedVerified ? (
              <Navigate to="/dashboard" replace={true} />
            ) : userAuthenticated ? (
              <Navigate to="/lobby" replace={true} />
            ) : (
              <Authentication />
            )
          }
        />
        <Route
          path="/lobby"
          element={
            authenticatedVerified ? (
              <Navigate to="/dashboard" replace={true} />
            ) : userAuthenticated ? (
              <Lobby />
            ) : (
              <Navigate to="/auth" replace={true} />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={(
              <Dashboard />
            ) 
          }
        />
      </Routes>
    </Router>
  )
}

export default App
