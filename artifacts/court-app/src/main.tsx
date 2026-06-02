import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

let apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  if (!apiUrl.startsWith("http")) apiUrl = "https://" + apiUrl;
  setBaseUrl(apiUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
