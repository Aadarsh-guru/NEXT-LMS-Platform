import { uploadMediaAction } from "@/actions/media";

const uploadMedia = async (file: File, ref: string) => {
    try {
        const { success, uploadUrl, mediaUrl } = await uploadMediaAction(file.name, ref);
        if (success) {
            const response = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    'Content-Type': file.type
                },
            });
            if (response.ok) {
                return mediaUrl;
            }
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export default uploadMedia;