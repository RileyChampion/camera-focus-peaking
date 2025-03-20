import { Button } from "@/components/ui/button"
import { Input } from "./components/ui/input"
import { Camera } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import FocusPeakingWebcam from "./components/FocusPeakingWebcam"

function App() {
  const [feed, setFeed] = useState("NONE")
  const [videoFile, setVideoFile] = useState(null);

  return (
    <div className="flex items-center justify-center min-h-svh bg-gray-900">
      { feed == 'NONE' &&
        <div className="flex flex-col items-center justify-center w-50">
          <Button className="w-50 mb-2 cursor-pointer" variant="secondary"><Camera /> Use Your Webcam</Button>
          <p className="text-white mb-2">OR</p>
          <Input className="bg-white border-none text-black hover:bg-white/70 cursor-pointer transition-all" type="file"/>
        </div>
      }
      { feed == 'WEBCAM' && 
        <div>

        </div>
      }
      { feed == 'UPLOAD' &&
        <div>

        </div>
      }
    </div>
  )
}

export default App
