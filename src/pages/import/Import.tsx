import { FC } from "react";

import SideBar from "../../components/sidebar/SideBar";
import TitleBar from "../../components/title-bar/TitleBar";

const Import: FC = () => {
  return (
    <div>
      <TitleBar activeFileIndex={-1} />
      <SideBar />
    </div>
  );
};

export default Import;
