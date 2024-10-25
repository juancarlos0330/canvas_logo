import React from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import { AppProvider } from "./contexts/AppContext";
const engine = new Styletron();
const Providers = ({ children }) => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <AppProvider>{children}</AppProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default Providers;
