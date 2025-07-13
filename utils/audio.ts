import { Track } from "@/types/music";
import { getPictureAsDataURL, readAudioFile } from "taglib-ts";

export const extractMetadata = async (filePath: string): Promise<Partial<Track>> => {
  try {
    const fileRef = await readAudioFile(filePath);

    if (fileRef.isValid()) {
      const tag = fileRef.tag();
      const audioProps = fileRef.audioProperties();
      const pictures = tag?.pictures() || [];

      return {
        title: tag?.title() || undefined,
        artist: tag?.artist() || undefined,
        album: tag?.album() || undefined,
        year: tag?.year() || undefined,
        track_number: tag?.track() || undefined,
        genre: tag?.genre() || undefined,
        duration: audioProps?.lengthInSeconds() || undefined,
        cover_image: pictures.length > 0 ? getPictureAsDataURL(pictures[0]) : undefined,
      };
    }
  } catch (error) {
    console.error('Error extracting metadata:', error);
  }

  return {};
};