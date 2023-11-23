import "./Home.css";
import { FC, useState } from "react";

import CreateCollectionDialog from "../../components/create-collection-dialog/CreateCollectionDialog";

const Option: FC<{
  text: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}> = ({ text, description, buttonLabel, onClick }) => {
  return (
    <div className="option">
      <div className="option-text">
        <div className="option-title">{text}</div>
        <div className="option-description">{description}</div>
      </div>
      <div className="option-spacer" />
      <button className="option-button" onClick={onClick}>
        {buttonLabel}
      </button>
    </div>
  );
};

const Home: FC = () => {
  // TODO remove
  const [createCollectionDialogVisible, setCreateCollectionDialogVisible] =
    useState(true);
  // const [createCollectionDialogVisible, setCreateCollectionDialogVisible] =
  //   useState(false);

  return (
    <div>
      <div data-tauri-drag-region className="title-bar" />
      <div className="home-sidebar"></div>
      <div className="home-content">
        <div className="options">
          <Option
            text="Create a new collection"
            description="Create a new recipe collection in your local file system"
            buttonLabel="Create"
            onClick={() => setCreateCollectionDialogVisible(true)}
          />
          <div className="divider" />
          <Option
            text="Open folder as a collection"
            description="Choose an existing folder of recipe files"
            buttonLabel="Open"
            onClick={() => {}}
          />
        </div>
      </div>
      <CreateCollectionDialog
        visible={createCollectionDialogVisible}
        close={() => setCreateCollectionDialogVisible(false)}
      />
    </div>
  );
};

export default Home;
