import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./components/ai-chat/ChatContext";
import MeetMyAI from "./components/ai-chat/MeetMyAI";
import HomePage from "./pages/HomePage";
import StickyNav from "./components/layout/StickyNav";

const CaseStudyRoboticArm = lazy(() => import("./pages/CaseStudyRoboticArm"));
const CaseStudyPong = lazy(() => import("./pages/CaseStudyPong"));

function CaseStudyPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StickyNav />
      {children}
    </>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <span className="text-caption uppercase tracking-wide text-text-secondary">
        Loading…
      </span>
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <BrowserRouter>
        <main className="bg-bg-primary min-h-screen">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/case-studies/robotic-arm"
                element={
                  <CaseStudyPage>
                    <CaseStudyRoboticArm />
                  </CaseStudyPage>
                }
              />
              <Route
                path="/case-studies/pong-ai"
                element={
                  <CaseStudyPage>
                    <CaseStudyPong />
                  </CaseStudyPage>
                }
              />
            </Routes>
          </Suspense>
          <MeetMyAI />
        </main>
      </BrowserRouter>
    </ChatProvider>
  );
}
