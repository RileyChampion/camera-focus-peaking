import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { VideoMenuProvider, useVideoMenu } from "./components/VideoMenu"
import VideoFeed from "./components/VideoFeed"
import { FeedType } from "./types/FeedType"

function App() {
  const [feed, setFeed] = useState<FeedType>(FeedType.NONE)
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Need checks for file type and successful upload
    if (file) {
      setVideoFile(file);
      setFeed(FeedType.UPLOAD);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      { feed == FeedType.NONE &&
        <div className="flex flex-col items-center justify-center w-50">
          <Button className="w-50 mb-2 cursor-pointer" variant="secondary"><Camera /> Use Your Webcam</Button>
          <p className="text-white mb-2">OR</p>
          <Input onInput={handleFileUpload} accept="video/*" className="bg-white border-none text-black hover:bg-white/70 cursor-pointer transition-all" type="file"/>
        </div>
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
