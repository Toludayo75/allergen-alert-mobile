import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "Allergen Alert";

// Add the meta tags needed for PWA and mobile optimization
interface MetaTag {
  name?: string;
  content?: string;
  [key: string]: string | undefined;
}

interface LinkTag {
  rel?: string;
  href?: string;
  [key: string]: string | undefined;
}

const metaTags: MetaTag[] = [
  { name: "description", content: "Your food safety companion - detect allergens in food products" },
  { name: "theme-color", content: "#2ECC71" },
  { name: "apple-mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" }
];

// Add custom fonts
const linkTags: LinkTag[] = [
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" }
];

// Add meta tags to head
metaTags.forEach(meta => {
  const metaTag = document.createElement("meta");
  if ("name" in meta && typeof meta.name === "string") {
    metaTag.setAttribute("name", meta.name);
  }
  if ("content" in meta && typeof meta.content === "string") {
    metaTag.setAttribute("content", meta.content);
  }
  // Handle other meta attributes
  Object.entries(meta).forEach(([key, value]) => {
    if (key !== "name" && key !== "content" && typeof value === "string") {
      metaTag.setAttribute(key, value);
    }
  });
  document.head.appendChild(metaTag);
});

// Add link tags to head
linkTags.forEach(link => {
  const linkTag = document.createElement("link");
  if (link.rel && typeof link.rel === 'string') {
    linkTag.setAttribute("rel", link.rel);
  }
  if (link.href && typeof link.href === 'string') {
    linkTag.setAttribute("href", link.href);
  }
  document.head.appendChild(linkTag);
});

createRoot(document.getElementById("root")!).render(<App />);
