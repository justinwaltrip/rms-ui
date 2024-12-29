import { invoke } from "@tauri-apps/api/core";

interface OpenFolderResponse {
  path: string;
}

interface ReadDirResponse {
  entries: Array<{ name: string }>;
}

interface ReadTextFileResponse {
  content: string;
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

  async readTextFile(path: string): Promise<string> {
    const payload = {
      path: path,
    };
    console.log("Invoking plugin:icloud|read_text_file with args", payload);
    try {
      const response = await invoke<ReadTextFileResponse>(
        "plugin:icloud|read_text_file",
        payload,
      );
      console.log("Got response from read_text_file");
      console.log(response);
      return response.content;
    } catch (error) {
      console.log("Got error from read_text_file");
      console.error(error);
      throw error;
    }
  }

  async readImageFile(path: string): Promise<string> {
    const payload = {
      path: path,
    };
    console.log("Invoking plugin:icloud|read_image_file with args", payload);
    try {
      const response = await invoke<ReadTextFileResponse>(
        "plugin:icloud|read_image_file",
        payload,
      );
      console.log("Got response from read_image_file");
      console.log(response);
      return response.content;
    } catch (error) {
      console.log("Got error from read_image_file");
      console.error(error);
      throw error;
    }
  }

  async writeTextFile(path: string, content: string): Promise<void> {
    const payload = {
      path: path,
      content: content,
    };
    console.log("Invoking plugin:icloud|write_text_file with args", {
      payload: payload,
    });
    try {
      await invoke("plugin:icloud|write_text_file", {
        payload: payload,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
