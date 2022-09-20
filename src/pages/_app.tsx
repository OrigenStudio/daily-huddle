import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Component {...pageProps} />
    </DndProvider>
  );
};

export default MyApp;
