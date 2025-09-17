import z from "zod";
import { getApiUrl } from "../env";
import { Asset, assetSchema } from "../types/asset";



const generateLyricsSchema = z.object({
    lyrics: z.string(),
    duration: z.number(),
    imageCount: z.number(),
    timePerImage: z.number(),
});
type GenerateLyricsResponse = z.infer<typeof generateLyricsSchema>;


export class AiService {
    static async generateLyrics(images: Asset[], projectId: string) {
        const endpoint = getApiUrl(`/ai/${projectId}/generate-lyrics`);

        const imageAssetIds = images.map((image) => image.id);
        const body = JSON.stringify({ imageAssetIds });
        console.log(body);
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });

        if (!response.ok) throw new Error("Failed to generate lyrics");
        const data = await response.json();
        return generateLyricsSchema.parse(data);
    }
    static async generateAudio(args: { lyrics: string, lyricsPrompt: string, projectId: string }) {
        const { lyrics, lyricsPrompt, projectId } = args;
        const endpoint = getApiUrl(`/ai/${projectId}/generate-audio`);
        const body = JSON.stringify({ prompt: lyrics, lyricsPrompt });
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });
        if (!response.ok) throw new Error("Failed to generate audio");
        const data = await response.json();
        console.log(data);
        return assetSchema.parse(data);
    }
}