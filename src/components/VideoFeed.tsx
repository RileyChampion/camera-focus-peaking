import { useRef, useState } from "react"
import FocusPeaking from "./FocusPeaking";
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

interface VideoFeedProps {
    uploadedFile : File | null
}

function VideoFeed({uploadedFile}: VideoFeedProps) {
    const [showFocusPeaking, setShowFocusPeaking] = useState(false);
    const [threshold, setThreshold] = useState(25);
    const [color, setColor] = useState('#ff0000')

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
                        peakingEnabled={showFocusPeaking}
                        sensitivity={threshold}
                        peakingColor={color}
                        videoRef={videoRef}
                    />
                    {/* <Button 
                        onClick={toggleShowFocusPeaking}
                        className="absolute top-0 left-0 z-3"
                    >{showFocusPeaking ? <Eye/> : <EyeClosed/>}Toggle Focus Peaking</Button> */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="absolute top-5 right-5 z-3"><Menu/></Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-primary border-primary w-80">
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
                                            onValueChange={(e) => setThreshold(e[0])}
                                            defaultValue={[threshold]}
                                            max={50}
                                            step={1}
                                        />
                                    </div>
                                    <div className="grid mt-3 mb-1 grid-cols-2 items-center gap-1">
                                        <Label className="text-white" htmlFor="threshold">Threshold:</Label>
                                        <ToggleGroup onValueChange={e => setColor(e)} type="single">
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
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            }
            {!uploadedFile && `There was an issue uploading your video file please try again.`}
        </div>
    );
}
export default VideoFeed