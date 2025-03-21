import { useState, createContext, ReactNode, useContext, JSX, ChangeEvent, RefObject, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Menu, Square } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider";
import {
    ToggleGroup,
    ToggleGroupItem
} from "@/components/ui/toggle-group";
import { Input } from "./ui/input";

interface VideoMenuContextType {
    showFocusPeaking: boolean;
    toggleShowFocusPeaking: () => void;
    threshold: number;
    changeThreshold: (value: number[]) => void;
    color: string;
    changeColor: (color: string) => void;
    videoFeed: string;
    handleFeedChange: (feed: string | undefined) => void;
    videoRef: HTMLVideoElement | null
    registerVideoElement: (element: HTMLVideoElement | null) => void;
    uploadedVideoFile: File | null;
    setUploadedVideoFile: (file: File | null) => void;
    isWebcamActive: boolean;
}

const VideoMenuContext = createContext<VideoMenuContextType | undefined>(undefined);

interface VideoMenuProviderProps {
    children?: ReactNode;
}

const VIDEO_WIDTH_START = 1024;
const VIDEO_WIDTH_STOP = 0;

export function VideoMenuProvider({children}: VideoMenuProviderProps) {
    const [showFocusPeaking, setShowFocusPeaking] = useState<boolean>(false);
    const [threshold, setThreshold] = useState<number>(50);
    const [color, setColor] = useState<string>('#ff0000');
    const [videoFeed, setVideoFeed] = useState<string>("");
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
    const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
    const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

    // Register video reference to Video Menu Provider
    const registerVideoElement = (element: HTMLVideoElement | null) => {
        setVideoRef(element);
    }
    
    // Toggle showing focus peaking
    const toggleShowFocusPeaking = () => setShowFocusPeaking(!showFocusPeaking);
    
    // Handle change threshold
    const changeThreshold = (value: number[]) => {
        setThreshold(value[0]);
    }

    // Handle change color
    const changeColor = (color : string) => {
        setColor(color)
    }

    // Function to start webcam
    const startWebcam = async (): Promise<void> => {
        if (!videoRef) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.srcObject = stream;
            videoRef.width = VIDEO_WIDTH_START
            videoRef.play();
            setIsWebcamActive(true);
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };
    
    // Function to stop webcam
    const stopWebcam = (): void => {
        if (!videoRef) return;
        
        const stream = videoRef.srcObject as MediaStream;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.width = VIDEO_WIDTH_STOP
            videoRef.srcObject = null;
        }
        setIsWebcamActive(false);
    };

    // Handles file uploads
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedVideoFile(file);
        }
    }

    // Handle video feed changes
    useEffect(() => {
        if (videoFeed === "WEBCAM" && !isWebcamActive) {
            if (videoRef && uploadedVideoFile) {
                videoRef.width = VIDEO_WIDTH_STOP
                videoRef.src = "";
            }
            startWebcam();
        } else if (videoFeed === "UPLOAD") {
            if (isWebcamActive) {
                stopWebcam();
            }
            
            // Load uploaded video if available
            if (videoRef && uploadedVideoFile) {
                videoRef.src = URL.createObjectURL(uploadedVideoFile);
                videoRef.width = VIDEO_WIDTH_START
            }
        }
    }, [videoFeed, uploadedVideoFile, isWebcamActive]);

    // Handles setting video feed
    const handleFeedChange = (value: string | undefined) => {
        if (value === "WEBCAM" || value === "UPLOAD") {
            setVideoFeed(value);
        }
    };

    const contextValue = {
        showFocusPeaking,
        toggleShowFocusPeaking,
        threshold,
        changeThreshold,
        color,
        changeColor,
        videoFeed,
        handleFeedChange,
        videoRef,
        registerVideoElement,
        uploadedVideoFile,
        setUploadedVideoFile,
        isWebcamActive
    };

    return (
        <VideoMenuContext.Provider value={contextValue}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"secondary"} className="absolute top-5 right-5 z-3"><Menu/></Button>
                </PopoverTrigger>
                <PopoverContent className="bg-primary w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none text-white">Dimensions</h4>
                            <p className="text-sm text-muted-foreground">
                                Set the dimensions for the layer.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 items-center gap-1">
                                <Label className="text-white" htmlFor="focus-peak">Focus Peaking:</Label>
                                <Button
                                    onClick={toggleShowFocusPeaking}
                                    variant={"outline"}
                                    className={`${showFocusPeaking ? '' : 'bg-gray-600/50 hover:bg-gray-600/90 border-none'}`}
                                >{showFocusPeaking ? <Eye/> : <EyeClosed/>}</Button>
                            </div>
                            <div className="grid mt-3 mb-1 grid-cols-2 items-center gap-1">
                                <Label className="text-white" htmlFor="threshold">Threshold:</Label>
                                <Slider
                                    className=""
                                    onValueChange={changeThreshold}
                                    defaultValue={[threshold]}
                                    max={100}
                                    step={1}
                                />
                            </div>
                            <div className="grid mt-3 mb-1 grid-cols-2 items-center gap-1">
                                <Label className="text-white" htmlFor="threshold">Threshold:</Label>
                                <ToggleGroup value={color} onValueChange={changeColor} type="single">
                                    <ToggleGroupItem className="hover:bg-gray-600/50" value="#ff0000" aria-label="Toggle red peaking color">
                                        <Square color="#ff0000" fill="#ff0000" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className="hover:bg-gray-600/50" value="#00ff00" aria-label="Toggle green peaking color">
                                        <Square color="#00ff00" fill="#00ff00" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className="hover:bg-gray-600/50" value="#0000ff" aria-label="Toggle blue peaking color">
                                        <Square color="#0000ff" fill="#0000ff" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className="grid mt-3 mb-1 grid-cols-2 items-center gap-1">
                                <Label className="text-white" htmlFor="threshold">Video Feed:</Label>
                                <ToggleGroup className="text-muted-foreground" value={videoFeed} onValueChange={handleFeedChange} type="single">
                                    <ToggleGroupItem variant={"outline"} className="hover:bg-gray-600/50 hover:text-white" value="UPLOAD" aria-label="Toggle to upload video.">
                                        <p className="">Upload</p>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem variant={"outline"} className="hover:bg-gray-600/50 hover:text-white" value="WEBCAM" aria-label="Toggle to use webcam.">
                                        <p className="">Webcam</p>
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            { videoFeed == 'UPLOAD' &&
                                <div className="grid mt-3 mb-1 grid-cols-1 items-center gap-1">
                                    <Input type="file" onInput={handleFileUpload} accept="video/*" className="bg-white border-none text-black hover:bg-white/70 cursor-pointer transition-all" />
                                    <p className="mt-3 text-white">Selected Video: {uploadedVideoFile == null ? 'No Upload' : uploadedVideoFile.name }</p>
                                </div>
                            }
                            { videoFeed =='WEBCAM' && 
                                <div className="grid mt-3 mb-1 grid-cols-1 items-center gap-1">
                                    <Button className="hover:cursor-pointer" variant={"secondary"}>Start Webcam</Button>
                                </div>
                            }
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            {children}
        </VideoMenuContext.Provider>
    );
}

export function useVideoMenu(): VideoMenuContextType {
    const context = useContext(VideoMenuContext);
    if (context === undefined) {
        throw new Error("useVideoMenu must be used within a VideoMenuProvider");
    }
    return context;
}