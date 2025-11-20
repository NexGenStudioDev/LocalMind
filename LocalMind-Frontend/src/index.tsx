import { createRoot } from "react-dom/client";
import "./app/css/global.css";
import App from "./app/App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
