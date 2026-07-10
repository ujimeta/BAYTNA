import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Browse from "@/pages/browse";
import PropertyDetail from "@/pages/property-detail";
import CityLanding from "@/pages/city-landing";
import Agents from "@/pages/agents";
import AgentProfile from "@/pages/agent-profile";
import Favorites from "@/pages/favorites";
import About from "@/pages/about";
import ListProperty from "@/pages/list-property";
import SubmitListing from "@/pages/submit-listing";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/city/:city" component={CityLanding} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/:id" component={AgentProfile} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/about" component={About} />
      <Route path="/list-property" component={ListProperty} />
      <Route path="/submit-listing" component={SubmitListing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
