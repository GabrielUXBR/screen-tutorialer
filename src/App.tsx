
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecordingProvider } from "@/context/RecordingContext";
import { CreditsProvider } from "@/context/CreditsContext";
import Index from "./pages/Index";
import ViewTutorial from "./pages/ViewTutorial";
import NotFound from "./pages/NotFound";
import Credits from "./pages/Credits";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CreditsProvider>
        <RecordingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tutorial/:id" element={<ViewTutorial />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RecordingProvider>
      </CreditsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
