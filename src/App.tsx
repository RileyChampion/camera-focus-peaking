import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Focus } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { VideoMenuProvider, useVideoMenu } from "./components/VideoMenu"
import VideoFeed from "./components/VideoFeed"
import { FeedType } from "./types/FeedType"

function App() {
  const [feed, setFeed] = useState<FeedType>(FeedType.NONE)
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleWebcam = () => {
    setFeed(FeedType.WEBCAM)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Need checks for file type and successful upload
    if (file) {
      setVideoFile(file);
      setFeed(FeedType.UPLOAD);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      { feed == FeedType.NONE &&
      <>
        <Focus className="text-secondary w-15 h-15 mb-1" />
        <h1 className="text-secondary text-6xl border-b-1 border-white pb-5 mb-5">Focus Peaking Exercise</h1>
        <div className="flex flex-col items-center justify-center w-50">
          <Button onClick={handleWebcam} className="w-50 mb-2 cursor-pointer" variant="secondary"><Camera /> Use Your Webcam</Button>
          <p className="text-white mb-2">OR</p>
          <Input onInput={handleFileUpload} accept="video/*" className="bg-white border-none text-black hover:bg-white/70 cursor-pointer transition-all" type="file"/>
        </div>
      </>
      }
      { feed != FeedType.NONE && 
        <VideoMenuProvider>
          <VideoFeed
            feedType={feed}
            uploadedFile={videoFile}
          />
        </VideoMenuProvider>
      }
      
    </div>
  )
}

export default App
