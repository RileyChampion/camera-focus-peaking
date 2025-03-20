import { useEffect, useRef, useState } from "react";
import { start } from "repl";

interface FocusPeakingProps {
    show: boolean,
    videoReference: React.RefObject<null>
}

function FocusPeaking({show, videoReference}: FocusPeakingProps) {
    const [peakingEnabled, setPeakingEnabled] = useState(show);

    const canvasRef = useRef(null);

    // const startFocusPeaking = () => {
    //     if (!videoReference.current || !canvasRef.current) {
    //         return;
    //     }

    //     const video = videoReference.current;
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d', { willReadFrequently: true });
    // }
    
    // useEffect(() => {
    //     startFocusPeaking();
    // }, [])
    
    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-2 w-full h-full object-cover"
        />
    )
}
export default FocusPeaking;