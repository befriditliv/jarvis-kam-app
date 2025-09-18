import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, Play, Pause, Download, Share, Trash2 } from "lucide-react";

interface VoiceRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recording: VoiceRecording) => void;
}

interface VoiceRecording {
  id: string;
  title: string;
  duration: number;
  transcription: string;
  timestamp: Date;
  tags: string[];
}

export const VoiceRecorder = ({ isOpen, onClose, onSave }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState("");

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setCurrentTranscription("");
    
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Simulate real-time transcription
    setTimeout(() => {
      setCurrentTranscription("Meeting with Dr. Johnson went very well today...");
    }, 3000);

    setTimeout(() => {
      setCurrentTranscription("Meeting with Dr. Johnson went very well today. She showed strong interest in the new cardiovascular protocol and asked detailed questions about implementation timeline...");
    }, 6000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    if (recordingTime > 0) {
      const newRecording: VoiceRecording = {
        id: Date.now().toString(),
        title: `Recording ${recordings.length + 1}`,
        duration: recordingTime,
        transcription: currentTranscription || "Voice recording completed. Transcription processing...",
        timestamp: new Date(),
        tags: ["meeting", "debrief"]
      };
      
      setRecordings(prev => [newRecording, ...prev]);
      onSave(newRecording);
    }
    
    setRecordingTime(0);
    setCurrentTranscription("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed bottom-0 left-0 right-0 bg-card shadow-xl border-t border-border rounded-t-3xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Voice Recorder</h2>
              <p className="text-sm text-muted-foreground">Capture insights with AI transcription</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              ×
            </Button>
          </div>

          {/* Recording Interface */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary-soft/30 to-accent-soft/20 border-0">
            <div className="text-center">
              {/* Recording Visualizer */}
              <div className="mb-6">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? "bg-gradient-primary animate-pulse-glow shadow-floating" 
                    : "bg-secondary/50"
                }`}>
                  {isRecording ? (
                    <MicOff className="h-12 w-12 text-primary-foreground" />
                  ) : (
                    <Mic className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                
                {isRecording && (
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 bg-primary rounded-full animate-bounce-gentle"
                        style={{ 
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="text-3xl font-mono font-bold text-card-foreground mb-4">
                {formatTime(recordingTime)}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-gradient-primary hover:shadow-lg transition-all duration-300 rounded-2xl px-8 py-3"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="hover:shadow-lg transition-all duration-300 rounded-2xl px-8 py-3"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>

            {/* Real-time Transcription */}
            {currentTranscription && (
              <div className="mt-6 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce-gentle" />
                  <span className="text-sm font-medium text-primary">Live Transcription</span>
                </div>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {currentTranscription}
                </p>
              </div>
            )}
          </Card>

          {/* Recent Recordings */}
          {recordings.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-3">Recent Recordings</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recordings.slice(0, 3).map((recording) => (
                  <Card key={recording.id} className="p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-card-foreground">{recording.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {formatTime(recording.duration)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {recording.transcription}
                        </p>
                        <div className="flex gap-1">
                          {recording.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" className="rounded-full p-2">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-2">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-2">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};