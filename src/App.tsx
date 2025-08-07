import "./App.css";
import { MainLayout } from "./components";
import { DocumentEditorProvider } from "./contexts/DocumentEditorContext";
// import DocumentEditorPlatform from "./DocumentEditorPlatform";

function App() {
  return (
    <>
      <DocumentEditorProvider>
        <MainLayout />
      </DocumentEditorProvider>
      {/* <DocumentEditorPlatform /> */}
    </>
  );
}

export default App;
