import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "./App";
import { queryClient } from "./lib/queryClient";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />

      <Toaster
  theme="light"
  position="top-right"
  closeButton
  expand
  toastOptions={{
    classNames: {
      toast:
        "bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-xl",
      title: "font-semibold text-slate-900",
      description: "text-slate-500",
      closeButton:
        "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100",
    },
  }}
/>
    </QueryClientProvider>
  </React.StrictMode>
);