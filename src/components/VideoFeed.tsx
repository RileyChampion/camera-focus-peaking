import { RefObject, useEffect, useRef, useState } from "react"
import FocusPeaking from "./FocusPeaking";
import { useVideoMenu } from "./VideoMenu";
import { FeedType } from "@/types/FeedType";
import { Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoFeedProps {
    feedType : FeedType
    uploadedFile : File | null
}

function VideoFeed({feedType, uploadedFile}: VideoFeedProps) {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const {
        showFocusPeaking,
        threshold,
        color,
        videoFeed,
        uploadedVideoFile,
        isWebcamActive,
        registerVideoElement,
        handleFeedChange,
        setUploadedVideoFile,
    } = useVideoMenu();

    const hexToColorString = (hex: string) => {
        switch(hex) {
            case "#ff0000":
                return "RED"
            case "#00ff00":
                return "GREEN"
            case "#0000ff":
                return "BLUE"
            default:
                return "N/A"
        }
    }

    const checkIfWebcamIsReady = () => {
        return videoFeed == 'WEBCAM' && isWebcamActive;
    }

    const checkIfFileUploadIsReady = () => {
        return videoFeed == 'UPLOAD' && uploadedVideoFile && !isWebcamActive;
    }

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
        <div className="fixed min-h-fit bg-gray-950">
            {videoFeed == "UPLOAD" && !uploadedVideoFile && 
                <div className="flex flex-col justify-center items-center text-secondary">
                    <Upload className="w-15 h-15 mb-2" /> 
                    <p className="text-2xl">Please upload a video file in the menu dropdown.</p>
                </div>
            }
            {videoFeed == 'WEBCAM' && !isWebcamActive &&
                <div className="flex flex-col justify-center items-center text-secondary">
                    <h1 className="text-white">LOADING WEBCAM...</h1>
                </div>
            }
            {videoFeed != "NONE" &&
                <>
                    <video 
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        loop
                        className="" 
                    />
                    {checkIfWebcamIsReady() && <FocusPeaking />}
                    {checkIfFileUploadIsReady() && <FocusPeaking />}
                    {(checkIfWebcamIsReady() || checkIfFileUploadIsReady()) && 
                        <div className="flex justify-evenly mt-3">
                            <Badge variant={"secondary"}>Focus Peaking: {showFocusPeaking? "ENABLED" : "DISABLED"}</Badge>
                            <Badge variant={"secondary"}>Threshold: {threshold}</Badge>
                            <Badge variant={"secondary"}>Color: {hexToColorString(color)}</Badge>
                        </div>
                    }
                </>
            }
        </div>
    );
}
export default VideoFeed