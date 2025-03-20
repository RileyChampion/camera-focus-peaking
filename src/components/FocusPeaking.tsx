import { useEffect, useRef, useState } from "react";
import { start } from "repl";

interface FocusPeakingProps {
    peakingEnabled: boolean,
    sensitivity: number,
    peakingColor: string,
    videoRef: React.RefObject<null>
}

function FocusPeaking({peakingEnabled, sensitivity, peakingColor, videoRef}: FocusPeakingProps) {
    const canvasRef = useRef(null);
    
    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-2 w-full h-full object-cover"
        />
    )
}
export default FocusPeaking;