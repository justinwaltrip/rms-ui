import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  BaseDirectory,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

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

  async readTextFile(path: string): Promise<string> {
    try {
      const file = await readTextFile(path, {
        baseDir: BaseDirectory.Home,
      });
      return file;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getImageUrl(path: string): string {
    return convertFileSrc(path);
  }

  async writeTextFile(path: string, contents: string) {
    try {
      await writeTextFile(path, contents, {
        baseDir: BaseDirectory.Home,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
