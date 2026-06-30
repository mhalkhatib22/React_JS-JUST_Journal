import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// --- Standard Imports ---
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Policies from "./pages/Policies";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";

// --- Lazy Loading Components ---
// Author[cite: 6]
// const AuthorDashboard = lazy(
//   () => import("./pages/Dashboard/Author/AuthorDashboard"),
// );
const Dashboard = lazy(
  () => import("./components/Dashboard"),
);
const AuthorHome = lazy(() => import("./pages/Dashboard/Author/AuthorHome"));
const CreateResearch = lazy(
  () => import("./pages/Dashboard/Author/CreateResearch"),
);
const MyResearch = lazy(() => import("./pages/Dashboard/Author/MyResearch"));
const CreateFeedback = lazy(
  () => import("./pages/Dashboard/Author/CreateFeedback"),
);
const Notifications = lazy(
  () => import("./pages/Dashboard/Author/Notifications"),
);

// Editor[cite: 6]
// const EditorDashboard = lazy(
//   () => import("./pages/Dashboard/Editor/EditorDashboard"),
// );
const EditorHome = lazy(() => import("./pages/Dashboard/Editor/EditorHome"));
const AllResearch = lazy(() => import("./pages/Dashboard/Editor/AllResearch"));
const SendForReview = lazy(
  () => import("./pages/Dashboard/Editor/SendResearchForReview"),
);
const FinalDecision = lazy(
  () => import("./pages/Dashboard/Editor/FinalDecision"),
);
const ResearcherPromotion = lazy(
  () => import("./pages/Dashboard/Editor/ResearcherPromotion"),
);
const VisitorReviews = lazy(
  () => import("./pages/Dashboard/Editor/VisitorReviews"),
);
const ViewFeedback = lazy(
  () => import("./pages/Dashboard/Editor/ViewFeedback"),
);

// Reviewer[cite: 6]
// const ReviewerDashboard = lazy(
//   () => import("./pages/Dashboard/Reviewer/ReviewerDashboard"),
// );
const ReviewerHome = lazy(
  () => import("./pages/Dashboard/Reviewer/ReviewerHome"),
);
const ReviewPapers = lazy(
  () => import("./pages/Dashboard/Reviewer/ReviewPapers"),
);
const ReviewerFeeedback = lazy(
  () => import("./pages/Dashboard/Reviewer/ReviewerFeedback"),
);

// --- Route Guards (Equivalent to router.beforeEach) ---

// 1. Protected Route: Ensures the user is logged in and has the correct role[cite: 6].
const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && allowedRole !== userRole) {
    if (userRole === "author") return <Navigate to="/author" replace />;
    if (userRole === "editor") return <Navigate to="/editor" replace />;
    if (userRole === "reviewer") return <Navigate to="/reviewer" replace />;
    return <Navigate to="/" replace />;
  }

  // Renders the child routes (children components in the route definition)
  return <Outlet />;
};

// 2. Public Auth Route: Prevents logged-in users from accessing the login/signup pages[cite: 6].
const PublicAuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (token) {
    if (userRole === "author") return <Navigate to="/author" replace />;
    if (userRole === "editor") return <Navigate to="/editor" replace />;
    if (userRole === "reviewer") return <Navigate to="/reviewer" replace />;
  }

  return children;
};

// --- Router Definition ---
const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Suspense is required when using React.lazy */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          [cite: 6]
          <Route path="/policies" element={<Policies />} />
          [cite: 6]
          <Route path="/about" element={<About />} />
          [cite: 6]
          <Route path="/forgot-password" element={<ForgotPassword />} />
          [cite: 6]
          {/* Auth Routes (Protected from logged-in users) */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />
          [cite: 6]
          <Route
            path="/signup"
            element={
              <PublicAuthRoute>
                <Signup />
              </PublicAuthRoute>
            }
          />
          [cite: 6]
          {/* --- Author Routes --- */}
          <Route element={<ProtectedRoute allowedRole="author" />}>
            [cite: 6]
            <Route path="/author" element={<Dashboard />}>
              <Route index element={<AuthorHome />} />
              [cite: 6]
              <Route path="create" element={<CreateResearch />} />
              [cite: 6]
              <Route path="my-research" element={<MyResearch />} />
              [cite: 6]
              <Route path="feedback" element={<CreateFeedback />} />
              [cite: 6]
              {/* <Route path="notifications" element={<Notifications />} /> */}
              [cite: 6]
              <Route path="profile" element={<UserProfile />} />
              [cite: 6]
            </Route>
          </Route>
          {/* --- Editor Routes --- */}
          <Route element={<ProtectedRoute allowedRole="editor" />}>
            [cite: 6]
            <Route path="/editor" element={<Dashboard />}>
              <Route index element={<EditorHome />} />
              [cite: 6]
              <Route path="all-research" element={<AllResearch />} />
              [cite: 6]
              <Route path="send-for-review" element={<SendForReview />} />
              [cite: 6]
              <Route path="final-decision" element={<FinalDecision />} />
              [cite: 6]
              <Route path="promotion" element={<ResearcherPromotion />} />
              [cite: 6]
              <Route path="visitor-reviews" element={<VisitorReviews />} />
              [cite: 6]
              <Route path="view-feedback" element={<ViewFeedback />} />
              [cite: 6]
              <Route path="profile" element={<UserProfile />} />
              [cite: 6]
            </Route>
          </Route>
          {/* --- Reviewer Routes --- */}
          <Route element={<ProtectedRoute allowedRole="reviewer" />}>
            [cite: 6]
            <Route path="/reviewer" element={<Dashboard />}>
              <Route index element={<ReviewerHome />} />
              [cite: 6]
              <Route path="review-papers" element={<ReviewPapers />} />
              [cite: 6]
              <Route path="profile" element={<UserProfile />} />
              [cite: 6]
              <Route path="feedback" element={<ReviewerFeeedback />} />
              [cite: 6]
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
