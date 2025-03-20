import { useEffect, useRef, useState } from "react"
import FocusPeaking from "./FocusPeaking";
import { useVideoMenu } from "./VideoMenu";

interface VideoFeedProps {
    uploadedFile : File | null
}

function VideoFeed({uploadedFile}: VideoFeedProps) {

    const {videoSrc, changeVideoSrc} = useVideoMenu()

    const videoRef = useRef(null);

    useEffect(() => {
        changeVideoSrc(uploadedFile)
    }, [])

    return (
        <div className="min-h-screen bg-gray-900">
            {uploadedFile && videoSrc && 
                <>
                    <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    loop
                    className="absolute top-0 left-0 z-1 w-full h-full object-cover">
                        <source src={URL.createObjectURL(videoSrc)} type="video/mp4" />
                    </video>
                    <FocusPeaking videoRef={videoRef} />
                </>
            }
            {!uploadedFile && `There was an issue uploading your video file please try again.`}
        </div>
    );
}
export default VideoFeed