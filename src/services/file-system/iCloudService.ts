import { invoke } from "@tauri-apps/api/core";

interface OpenFolderResponse {
  path: string;
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
}
