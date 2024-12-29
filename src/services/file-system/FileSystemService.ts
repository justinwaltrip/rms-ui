import { open } from "@tauri-apps/plugin-dialog";

export class FileSystemService {
  constructor() {}

  async openFolder(): Promise<string> {
    try {
      const response = await open({
        multiple: false,
        directory: true,
      });
      if (response) {
        return response;
      } else {
        throw new Error("No folder selected");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
