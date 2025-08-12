import { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

const VideoPlayer = ({ src, title, thumbnail, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // This is a placeholder component for video functionality
  // In a real implementation, you would integrate with a video player library
  
  return (
    <div className="bg-black rounded-lg overflow-hidden relative group">
      <div className="aspect-video relative">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Play className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">{title}</p>
              {duration && <p className="text-sm">Duration: {duration}</p>}
            </div>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </button>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              
              <span className="text-sm">{duration || '00:00'}</span>
            </div>
            
            <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {title && (
        <div className="p-4 bg-gray-900">
          <h3 className="text-white font-medium">{title}</h3>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer