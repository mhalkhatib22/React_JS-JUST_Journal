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
// Author
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

// Editor
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

// Reviewer
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

// 1. Protected Route: Ensures the user is logged in and has the correct role.
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

// 2. Public Auth Route: Prevents logged-in users from accessing the login/signup pages.
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
          <Route path="/policies" element={<Policies />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Auth Routes (Protected from logged-in users) */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicAuthRoute>
                <Signup />
              </PublicAuthRoute>
            }
          />
          {/* --- Author Routes --- */}
          <Route element={<ProtectedRoute allowedRole="author" />}>
            <Route path="/author" element={<Dashboard />}>
              <Route index element={<AuthorHome />} />
              <Route path="create" element={<CreateResearch />} />
              <Route path="my-research" element={<MyResearch />} />
              <Route path="feedback" element={<CreateFeedback />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>
          {/* --- Editor Routes --- */}
          <Route element={<ProtectedRoute allowedRole="editor" />}>
            <Route path="/editor" element={<Dashboard />}>
              <Route index element={<EditorHome />} />
              <Route path="all-research" element={<AllResearch />} />
              <Route path="send-for-review" element={<SendForReview />} />
              <Route path="final-decision" element={<FinalDecision />} />
              <Route path="promotion" element={<ResearcherPromotion />} />
              <Route path="visitor-reviews" element={<VisitorReviews />} />
              <Route path="view-feedback" element={<ViewFeedback />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>
          {/* --- Reviewer Routes --- */}
          <Route element={<ProtectedRoute allowedRole="reviewer" />}>
            <Route path="/reviewer" element={<Dashboard />}>
              <Route index element={<ReviewerHome />} />
              <Route path="review-papers" element={<ReviewPapers />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="feedback" element={<ReviewerFeeedback />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
