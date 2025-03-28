import { useEffect, useRef } from "react";
import { useVideoMenu } from "./VideoMenu";

function FocusPeaking() {
    const {showFocusPeaking, color, threshold} = useVideoMenu();
    const canvasRef = useRef(null);
    const animationRef = useRef<number | null>(null);
    
    const {videoRef} = useVideoMenu();
    
    // Convert hex to RGB array
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

    // Starts focus peaking algorithm
    const startFocusPeaking = () => {
        if (!videoRef || !canvasRef.current) {
            return;
        }
        
        const video = videoRef;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) return;
        
        // Set canvas dimensions to match video with client information
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
            if (!video.clientWidth ) {
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
                
                    const w = canvas.width;
                    
                    // Apply edge detection algorithm (simplified Sobel)
                    for (let y = 1; y < canvas.height - 1; y++) {
                        for (let x = 1; x < canvas.width - 1; x++) {
                            const idx = (y * w + x) * 4;
                            
                            // Calculate luminance of neighboring pixels
                            const idxLeft = (y * w + (x - 1)) * 4;
                            const lumaLeft = 0.299 * data[idxLeft] + 0.587 * data[idxLeft + 1] + 0.114 * data[idxLeft + 2];
                            
                            const idxRight = (y * w + (x + 1)) * 4;
                            const lumaRight = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
                            
                            const idxTop = ((y - 1) * w + x) * 4;
                            const lumaTop = 0.299 * data[idxTop] + 0.587 * data[idxTop + 1] + 0.114 * data[idxTop + 2];
                            
                            const idxBottom = ((y + 1) * w + x) * 4;
                            const lumaBottom = 0.299 * data[idxBottom] + 0.587 * data[idxBottom + 1] + 0.114 * data[idxBottom + 2];

                            const idxTopLeft = ((y - 1) * w + (x - 1)) * 4
                            const lumaTopLeft = 0.299 * data[idxTopLeft] + 0.587 * data[idxTopLeft + 1] + 0.114 * data[idxTopLeft + 2];

                            const idxTopRight = ((y - 1) * w + (x + 1)) * 4
                            const lumaTopRight = 0.299 * data[idxTopRight] + 0.587 * data[idxTopRight + 1] + 0.114 * data[idxTopRight + 2];

                            const idxBottomLeft = ((y + 1) * w + (x - 1)) * 4
                            const lumaBottomLeft = 0.299 * data[idxBottomLeft] + 0.587 * data[idxBottomLeft + 1] + 0.114 * data[idxBottomLeft + 2];
                            
                            const idxBottomRight = ((y + 1) * w + (x + 1)) * 4
                            const lumaBottomRight = 0.299 * data[idxBottomRight] + 0.587 * data[idxBottomRight + 1] + 0.114 * data[idxBottomRight + 2];
                            
                            // Calculate gradient magnitude (simplified)
                            const gradX = Math.abs((2*lumaRight + lumaTopRight + lumaBottomRight) - (2*lumaLeft + lumaTopLeft + lumaBottomLeft));
                            const gradY = Math.abs((2*lumaBottom + lumaBottomLeft + lumaBottomRight) - (2*lumaTop + lumaTopLeft + lumaTopRight));
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
    
    // Update focus peaking when video menu elements change
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