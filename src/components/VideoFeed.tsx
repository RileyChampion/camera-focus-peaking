import { RefObject, useEffect, useRef, useState } from "react"
import FocusPeaking from "./FocusPeaking";
import { useVideoMenu } from "./VideoMenu";
import { FeedType } from "@/types/FeedType";
import { Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

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

    // Convert hex to color string
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

    // Check if webcam is ready
    const checkIfWebcamIsReady = () => {
        return videoFeed == 'WEBCAM' && isWebcamActive;
    }

    // Check if file upload is ready
    const checkIfFileUploadIsReady = () => {
        return videoFeed == 'UPLOAD' && uploadedVideoFile && !isWebcamActive;
    }

    // On first render, register video element, set feed type and set uploadedFile if provided
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
                    <Spinner className="text-secondary w-15 h-15 mb-2" size={"large"} />
                    <h1 className="text-white text-2xl">LOADING WEBCAM...</h1>
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