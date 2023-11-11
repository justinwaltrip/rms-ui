import "./App.css";
import SideBar from "./components/sidebar/SideBar";
import TitleBar from "./components/titlebar/TitleBar";
import Source from "./pages/source/Source";

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
