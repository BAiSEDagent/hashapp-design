import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { DemoProvider } from "@/context/DemoContext";

import Activity from "@/pages/Activity";
import Receipt from "@/pages/Receipt";
import Rules from "@/pages/Rules";
import Agent from "@/pages/Agent";
import Payees from "@/pages/Payees";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Activity} />
        <Route path="/receipt/:id" component={Receipt} />
        <Route path="/rules" component={Rules} />
        <Route path="/agent" component={Agent} />
        <Route path="/payees" component={Payees} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DemoProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </DemoProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
