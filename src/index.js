import React from "react";
import { createRoot } from "react-dom/client";
import Providers from "./Providers";
import Container from "./Container";
import Interface from "./interface/";

const root = createRoot(document.getElementById("root"));
//  <React.StrictMode>
root.render(
  <Providers>
    <Container>
      <Interface />
    </Container>
  </Providers>
);
