import { useEffect, useRef, useState } from "react";
import { start } from "repl";
import { useVideoMenu } from "./VideoMenu";

// interface FocusPeakingProps {
//     videoRef: React.RefObject<null>
// }

function FocusPeaking() {
    const {showFocusPeaking, color, threshold} = useVideoMenu();
    const canvasRef = useRef(null);
    const animationRef = useRef<number | null>(null);
    
    const {videoRef} = useVideoMenu();
    
    const hexToRGB = (hex: string): [number, number, number]=> {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        
        return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : [255, 0 , 0]
    }

    const startFocusPeaking = () => {
        if (!videoRef || !canvasRef.current) {
            return;
        }
        
        const video = videoRef;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) return;
        
        // Set canvas dimensions to match video
        const resizeCanvas = () => {
            if (video.clientWidth && video.clientHeight) {
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
            }
        };
        
        // Initial resize and listen for video metadata to load
        resizeCanvas();
        video.addEventListener('loadedmetadata', resizeCanvas);
        
        const processFrame = () => {
            if (!video.videoWidth ) {
                // Video dimensions not ready yet, wait for next frame
                animationRef.current = requestAnimationFrame(processFrame);
                return;
            }
            
            // Ensure canvas and video dimensions match on each frame
            if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
            }
            
            try {
                // Draw the current video frame to the canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Only apply focus peaking if enabled
                if (showFocusPeaking) {
                    // Get the image data for processing
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // Create a new ImageData to store the focus peaking effect
                    const peakingData = ctx.createImageData(canvas.width, canvas.height);
                    const peakingPixels = peakingData.data;
                    
                    // Fill peakingData with transparent pixels
                    for (let i = 0; i < peakingPixels.length; i += 4) {
                        peakingPixels[i] = 0;     // R
                        peakingPixels[i + 1] = 0; // G
                        peakingPixels[i + 2] = 0; // B
                        peakingPixels[i + 3] = 0; // A (transparent)
                    }
                    
                    // Extract RGB from peaking color
                    const [colorR, colorG, colorB] = hexToRGB(color)
                    
                    // Sobel operator for edge detection
                    const w = canvas.width;
                    // const threshold = sensitivity;
                    
                    // Apply edge detection algorithm (simplified Sobel)
                    for (let y = 1; y < canvas.height - 1; y++) {
                        for (let x = 1; x < canvas.width - 1; x++) {
                            const idx = (y * w + x) * 4;
                            
                            // Calculate luminance of current pixel
                            const r = data[idx];
                            const g = data[idx + 1];
                            const b = data[idx + 2];
                            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
                            
                            // Calculate luminance of neighboring pixels
                            const idxLeft = (y * w + (x - 1)) * 4;
                            const lumaLeft = 0.299 * data[idxLeft] + 0.587 * data[idxLeft + 1] + 0.114 * data[idxLeft + 2];
                            
                            const idxRight = (y * w + (x + 1)) * 4;
                            const lumaRight = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
                            
                            const idxTop = ((y - 1) * w + x) * 4;
                            const lumaTop = 0.299 * data[idxTop] + 0.587 * data[idxTop + 1] + 0.114 * data[idxTop + 2];
                            
                            const idxBottom = ((y + 1) * w + x) * 4;
                            const lumaBottom = 0.299 * data[idxBottom] + 0.587 * data[idxBottom + 1] + 0.114 * data[idxBottom + 2];
                            
                            // Calculate gradient magnitude (simplified)
                            const gradX = Math.abs(lumaRight - lumaLeft);
                            const gradY = Math.abs(lumaBottom - lumaTop);
                            const grad = Math.sqrt(gradX * gradX + gradY * gradY);
                            
                            // If gradient is above threshold, mark this pixel for focus peaking
                            if (grad > threshold) {
                                peakingPixels[idx] = colorR;
                                peakingPixels[idx + 1] = colorG;
                                peakingPixels[idx + 2] = colorB;
                                peakingPixels[idx + 3] = 255; // Fully opaque
                            }
                        }
                    }
                    
                    // Draw the original image
                    ctx.putImageData(imageData, 0, 0);
                    
                    // Overlay the focus peaking effect
                    ctx.putImageData(peakingData, 0, 0);
                }
                
                // Continue processing frames
                animationRef.current = requestAnimationFrame(processFrame);
            } catch (err) {
                console.error("Error processing frame:", err);
                // Try to continue despite errors
                animationRef.current = requestAnimationFrame(processFrame);
            }
        };
        
        // Start the processing loop
        animationRef.current = requestAnimationFrame(processFrame);
    };
    
    useEffect(() => {
        startFocusPeaking();
        
        // Cleanup function
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
            // Remove event listener if video exists
            if (videoRef) {
                videoRef.removeEventListener('loadedmetadata', () => {});
            }
        };
    }, [videoRef, showFocusPeaking, threshold, color]);

    
    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 object-fill z-2"
        />
    )
}
export default FocusPeaking;