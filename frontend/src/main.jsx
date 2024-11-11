import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./routing/App";

import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
