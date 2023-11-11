import "./App.css";
import SideBar from "./components/sidebar/SideBar";
import TitleBar from "./components/title-bar/TitleBar";
import Source from "./components/source-editor/SourceEditor";

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
