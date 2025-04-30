
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RequestCompanion from "./pages/RequestCompanion";
import FindCompanion from "./pages/FindCompanion";
import WaitingForMatch from "./pages/WaitingForMatch";
import OfferHelp from "./pages/OfferHelp";
import Connection from "./pages/Connection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/request" element={<RequestCompanion />} />
          <Route path="/find-companion" element={<FindCompanion />} />
          <Route path="/waiting" element={<WaitingForMatch />} />
          <Route path="/offer-help/:requestId" element={<OfferHelp />} />
          <Route path="/connection/:requestId" element={<Connection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
