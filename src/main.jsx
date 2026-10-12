import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './i18/i18n'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);


