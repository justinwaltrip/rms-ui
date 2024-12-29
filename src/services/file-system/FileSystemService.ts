import { open } from "@tauri-apps/plugin-dialog";
import { BaseDirectory, readDir } from "@tauri-apps/plugin-fs";

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

  async readDir(path: string): Promise<Array<string>> {
    try {
      const files = await readDir(path, {
        baseDir: BaseDirectory.Home,
      });
      return files.map((file) => file.name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
