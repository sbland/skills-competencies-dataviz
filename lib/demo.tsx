import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ExampleReactComponent } from "./example-component.tsx";

export const renderExampleComponent = (rootId: string, text: string) => {
  createRoot(document.getElementById(rootId)!).render(
    <StrictMode>
      <ExampleReactComponent text={text} />
    </StrictMode>,
  );
};
