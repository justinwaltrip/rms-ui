import "./App.css";
import SideBar from "./components/sidebar/SideBar";
import Source from "./components/source-editor/SourceEditor";
import TitleBar from "./components/title-bar/TitleBar";

function App() {
  return (
    <div>
      <TitleBar />
      <SideBar />
      <Source />
    </div>
  );
}

export default App;
