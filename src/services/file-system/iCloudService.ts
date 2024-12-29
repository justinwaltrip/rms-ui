import { invoke } from "@tauri-apps/api/core";

interface OpenFolderResponse {
  path: string;
}

interface ReadDirResponse {
  entries: Array<{ name: string }>;
}

export class iCloudService {
  constructor() {}

  async openFolder(): Promise<string> {
    const payload = {};
    console.log("Invoking plugin:icloud|open_folder with args", {
      payload: payload,
    });
    try {
      const response = await invoke<OpenFolderResponse>(
        "plugin:icloud|open_folder",
        {
          payload: payload,
        },
      );
      console.log("Got response from open_folder");
      console.log(response);
      return response.path;
    } catch (error) {
      console.log("Got error from open_folder");
      console.error(error);
      throw error;
    }
  }

  async readDir(path: string): Promise<Array<string>> {
    const payload = {
      path: path,
    };
    console.log("Invoking plugin:icloud|read_dir with args", payload);
    try {
      const response = await invoke<ReadDirResponse>(
        "plugin:icloud|read_dir",
        payload,
      );
      console.log("Got response from read_dir");
      console.log(response);
      return response.entries.map((entry) => entry.name);
    } catch (error) {
      console.log("Got error from read_dir");
      console.error(error);
      throw error;
    }
  }
}
