import { useRef, useState } from "react"
import FocusPeaking from "./FocusPeaking";
import { Button } from "./ui/button";
import { Eye, EyeClosed } from "lucide-react";

interface VideoFeedProps {
    uploadedFile : File | null
}

function VideoFeed({uploadedFile}: VideoFeedProps) {
    const [showFocusPeaking, setShowFocusPeaking] = useState(false);

    const videoRef = useRef(null);

    const toggleShowFocusPeaking = () => setShowFocusPeaking(!showFocusPeaking)

    return (
        <div className="min-h-screen bg-gray-900">
            {uploadedFile && 
                <>
                    <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    loop
                    className="absolute top-0 left-0 z-1 w-full h-full object-cover">
                        <source src={URL.createObjectURL(uploadedFile)} type="video/mp4" />
                    </video>
                    <FocusPeaking 
                        show={showFocusPeaking}
                        videoReference={videoRef}
                    />
                    <Button 
                        onClick={toggleShowFocusPeaking}
                        className="absolute top-0 left-0 z-3"
                    >{showFocusPeaking ? <Eye/> : <EyeClosed/>}Toggle Focus Peaking</Button>
                </>
            }
            {!uploadedFile && `There was an issue uploading your video file please try again.`}
        </div>
    );
}
export default VideoFeed