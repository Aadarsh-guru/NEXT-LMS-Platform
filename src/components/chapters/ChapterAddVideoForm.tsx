"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, PlusCircle, RefreshCw, RotateCw, Video } from "lucide-react";
import { Chapter } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { deleteMediaAction } from "@/actions/media";
import uploadMedia from "@/lib/upload";
import { updateChapterAction } from "@/actions/chapters";
import { cn } from "@/lib/utils";
import VideoPlayer from "../shared/VideoPlayer";


interface ChapterAddVideoFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const ChapterAddVideoForm = ({ initialData, chapterId, courseId }: ChapterAddVideoFormProps) => {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);


    const hanldeUpload = async () => {
        setIsUploading(true);
        try {
            if (initialData?.resolutions?.length !== 0) {
                initialData.resolutions.map(async (resolution) => {
                    await deleteMediaAction(resolution);
                });
            }
            if (file) {
                const mediaUrl = await uploadMedia(file, `courses/chapters/${chapterId}`);
                if (mediaUrl) {
                    const response = await fetch(process.env.NEXT_PUBLIC_TRANSCODE_URL as string, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            videoUrl: mediaUrl,
                            onSuccessEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/transcode/success`,
                        })
                    });
                    if (response.ok) {
                        const { success } = await updateChapterAction(chapterId, courseId, { isVideoProcessing: true });
                        if (success) {
                            router.refresh();
                            setIsEditing(false);
                            return toast({
                                title: "Video uploded successfully."
                            });
                        }
                    }
                };
            };
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message || "Something wemt wrong!",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRefreshing = () => {
        setIsRefreshing(true);
        router.refresh();
        setIsEditing(false);
        setIsUploading(false);
        setFile(null);
        setIsRefreshing(false);
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between mb-2">
                Course video
                {!initialData.isVideoProcessing ? (
                    <Button onClick={() => setIsEditing(!isEditing)} variant={'outline'} >
                        {isEditing && (
                            <>Cancel</>
                        )}
                        {(!isEditing && initialData?.resolutions?.length === 0) && (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add an video
                            </>
                        )}
                        {(!isEditing && initialData?.resolutions?.length !== 0) && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit video
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        className="disabled:cursor-not-allowed"
                        onClick={handleRefreshing}
                        disabled={isRefreshing}
                        size={'icon'}
                        variant={'outline'}
                    >
                        <RotateCw className={cn(
                            "h-5 w-5 text-slate-500",
                            isRefreshing && "animate-spin"
                        )} />
                    </Button>
                )}
            </div>
            {(!isEditing && !initialData.isVideoProcessing) && (
                initialData?.resolutions?.length === 0 ?
                    (
                        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                            <Video className="h-10 w-10 text-slate-500" />
                        </div>
                    )
                    :
                    (
                        <VideoPlayer
                            title={initialData.title}
                            autoPlay={false}
                            resolutions={initialData?.resolutions?.sort()}
                        />
                    )
            )}
            {initialData.isVideoProcessing && (
                <div className="flex flex-col items-center justify-center h-60 bg-slate-200 rounded-md">
                    <div className="w-full flex justify-center items-center gap-4">
                        <RefreshCw className="h-8 w-8 text-slate-500 animate-spin" />
                        <h4 className="text-2xl text-slate-500" >Processing..</h4>
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2 px-4">
                        Videos can take few minutes to process. refresh the page if video does not appear.
                    </div>
                </div>
            )}
            {isEditing && (
                <div>
                    <div className="w-full flex items-center gap-4 py-4">
                        <Input
                            type="file"
                            disabled={isUploading}
                            onChange={(e) => setFile(e.target.files![0])}
                            accept="video/*"
                        />
                        <Button
                            type="button"
                            disabled={!file || isUploading}
                            onClick={hanldeUpload}
                        >
                            {isUploading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            )
                                :
                                "Upload"}
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter video.
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterAddVideoForm;