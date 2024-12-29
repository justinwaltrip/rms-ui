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
}
