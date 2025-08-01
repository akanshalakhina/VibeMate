import "./global.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestComponent from "./components/TestComponent";
import Index from "./pages/Index";
import Survey from "./pages/Survey";
import Matches from "./pages/Matches";
import EnhancedMatches from "./pages/EnhancedMatches";
import VibeMatesMatches from "./pages/VibeMatesMatches";
import MatchRequests from "./pages/MatchRequests";
import MutualMatch from "./pages/MutualMatch";
import TestMatching from "./pages/TestMatching";
import Admin from "./pages/Admin";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/test" element={<TestComponent />} />
            <Route path="/" element={<Index />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/matches" element={<VibeMatesMatches />} />
            <Route path="/match-requests" element={<MatchRequests />} />
            <Route path="/mutual-match/:matchId" element={<MutualMatch />} />
            <Route path="/matches-enhanced" element={<EnhancedMatches />} />
            <Route path="/matches-legacy" element={<Matches />} />
            <Route path="/test-matching" element={<TestMatching />} />
  
            <Route path="/admin" element={<Admin />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
