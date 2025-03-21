import { RefObject, useEffect, useRef, useState } from "react"
import FocusPeaking from "./FocusPeaking";
import { useVideoMenu } from "./VideoMenu";
import { FeedType } from "@/types/FeedType";

interface VideoFeedProps {
    feedType : FeedType
    uploadedFile : File | null
}

function VideoFeed({feedType, uploadedFile}: VideoFeedProps) {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const {registerVideoElement, handleFeedChange, setUploadedVideoFile} = useVideoMenu();

    useEffect(() => {
        if (localVideoRef.current) {
            registerVideoElement(localVideoRef.current);
        }
        handleFeedChange(feedType);
        if(uploadedFile) {
            setUploadedVideoFile(uploadedFile);
        }

        return () => {
            registerVideoElement(null);
        }
    }, []);

    return (
        <div className="fixed min-h-fit bg-gray-900">
            {feedType != "NONE" && 
                <>
                    <video 
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        loop
                        width={720}
                        className="" 
                    />
                    <FocusPeaking />
                </>
            }
            {!uploadedFile && `There was an issue uploading your video file please try again.`}
        </div>
    );
}
export default VideoFeed