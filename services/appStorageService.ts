import * as FileSystem from 'expo-file-system';

class AppStorageService  {
  private static instance: AppStorageService;
  private static tracksFolder: string = 'tracks';

  public static getInstance(): AppStorageService {
    if (!AppStorageService.instance) {
      AppStorageService.instance = new AppStorageService();
    }
    return AppStorageService.instance;
  }

  async setupAppStorage(): Promise<void> {
    const musicDir = FileSystem.documentDirectory + AppStorageService.tracksFolder;
    const dirInfo = await FileSystem.getInfoAsync(musicDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(musicDir, { intermediates: true });
    }
  }
}

export const appStorageService = AppStorageService.getInstance();
