import { useEffect, useRef, useState } from "react";
import { start } from "repl";
import { useVideoMenu } from "./VideoMenu";

interface FocusPeakingProps {
    videoRef: React.RefObject<null>
}

function FocusPeaking({videoRef}: FocusPeakingProps) {
    const {showFocusPeaking, color, threshold } = useVideoMenu();

    const canvasRef = useRef(null);
    
    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-2 w-full h-full object-cover"
        />
    )
}
export default FocusPeaking;