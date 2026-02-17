import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { ClerkProvider } from "@clerk/clerk-react";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

const theme = createTheme({
  primaryColor: "green",
  colors: {
    green: [
      "#f0f9f4",
      "#dcf2e3",
      "#b8e5c7",
      "#94d8ab",
      "#70cb8f",
      "#4cbe73",
      "#177529", // office-green (index 6)
      "#135c21",
      "#0f4319",
      "#0b2a11",
    ],
  },
});

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk publishable key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <ClerkProvider publishableKey={publishableKey}>
        <BrowserRouter>
          <NotificationProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </NotificationProvider>
        </BrowserRouter>
      </ClerkProvider>
    </MantineProvider>
  </StrictMode>
);
