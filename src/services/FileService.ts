import { platform } from "@tauri-apps/plugin-os";

import { FileSystemService } from "./file-system/FileSystemService";
import { iCloudService } from "./file-system/iCloudService";

export class FileService {
  private fileSystemService: FileSystemService;
  private cloudService: iCloudService;
  private currentPlatform: string;

  constructor() {
    this.fileSystemService = new FileSystemService();
    this.cloudService = new iCloudService();
    this.currentPlatform = platform();
  }

  async openFolder(): Promise<string> {
    if (this.currentPlatform === "ios") {
      return this.cloudService.openFolder();
    } else {
      return this.fileSystemService.openFolder();
    }
  }

  async readDir(path: string): Promise<Array<string>> {
    if (this.currentPlatform === "ios") {
      return this.cloudService.readDir(path);
    } else {
      return this.fileSystemService.readDir(path);
    }
  }

  async readTextFile(path: string): Promise<string> {
    if (this.currentPlatform === "ios") {
      return this.cloudService.readTextFile(path);
    } else {
      return this.fileSystemService.readTextFile(path);
    }
  }

  async getImageSrc(path: string): Promise<string> {
    if (this.currentPlatform === "ios") {
      const base64 = await this.cloudService.readImageFile(path);
      return `data:image/png;base64,${base64}`;
    } else {
      return this.fileSystemService.getImageUrl(path);
    }
  }

  async writeTextFile(path: string, contents: string) {
    if (this.currentPlatform === "ios") {
      return this.cloudService.writeTextFile(path, contents);
    } else {
      return this.fileSystemService.writeTextFile(path, contents);
    }
  }
}
