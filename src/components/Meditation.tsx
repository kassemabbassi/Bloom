import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AnimatedBreathingGuide from "@/components/AnimatedBreathingGuide";

type MeditationType = "calm" | "focus" | "sleep" | "anxiety" | "gratitude";

const meditationOptions = [
  { id: "calm", name: "Calm", description: "Find peace and tranquility", duration: 2 },
  { id: "focus", name: "Focus", description: "Enhance concentration and attention", duration: 7 },
  { id: "sleep", name: "Sleep", description: "Prepare your mind for rest", duration: 3 },
  { id: "anxiety", name: "Anxiety Relief", description: "Reduce worry and stress", duration: 8 },
  { id: "gratitude", name: "Gratitude", description: "Cultivate appreciation", duration: 10 },
] as const;

const meditationTracks: Record<MeditationType, string[]> = {
  calm: ["/tracks/calm/calm1.mp3"],
  focus: ["/tracks/focus/focus1.mp3", "/tracks/focus/focus2.mp3"],
  sleep: ["/tracks/sleep/sleep1.mp3"],
  anxiety: ["/tracks/anxiety/anxiety1.mp3", "/tracks/anxiety/anxiety2.mp3"],
  gratitude: [ "/tracks/gratitude/gratitude2.mp3"],
};

const Meditation = () => {
  const [selectedType, setSelectedType] = useState<MeditationType>("calm");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(5);
  const [volume, setVolume] = useState<number[]>([80]);
  const [currentTimeElapsed, setCurrentTimeElapsed] = useState("0:00");
  const [currentTimeRemaining, setCurrentTimeRemaining] = useState("5:00");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getRandomTrack = (type: MeditationType): string => {
    const tracks = meditationTracks[type];
    const randomIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomIndex];
  };

  const initializeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("timeupdate", updateProgress);
      audioRef.current = null;
    }

    const track = getRandomTrack(selectedType);
    audioRef.current = new Audio(track);
    audioRef.current.volume = volume[0] / 100;

    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(Math.floor(audioRef.current!.duration / 60));
      setCurrentTimeRemaining(formatTime(audioRef.current!.duration));
      setCurrentTimeElapsed("0:00");
      setProgress(0);
    });
    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentTimeElapsed(formatTime(audioRef.current!.duration));
      setCurrentTimeRemaining("0:00");
    });
  };

  useEffect(() => {
    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current = null;
      }
    };
  }, [selectedType]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${remainder.toString().padStart(2, "0")}`;
  };

  const handleMeditationChange = (value: string) => {
    const meditationType = value as MeditationType;
    setSelectedType(meditationType);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progressPercent);
      setCurrentTimeElapsed(formatTime(audioRef.current.currentTime));
      setCurrentTimeRemaining(formatTime(audioRef.current.duration - audioRef.current.currentTime));
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTimeElapsed("0:00");
      setCurrentTimeRemaining(formatTime(audioRef.current.duration));
      if (isPlaying) audioRef.current.play();
    }
  };

  const skipForward = () => {
    initializeAudio();
    if (audioRef.current) {
      setProgress(0);
      setCurrentTimeElapsed("0:00");
      setCurrentTimeRemaining(formatTime(audioRef.current.duration));
      if (isPlaying) audioRef.current.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - progressBar.left;
      const progressWidth = progressBar.width;
      const newProgress = (clickPosition / progressWidth) * 100;
      const newTime = (newProgress / 100) * audioRef.current.duration;

      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTimeElapsed(formatTime(newTime));
      setCurrentTimeRemaining(formatTime(audioRef.current.duration - newTime));
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3">
        <Card className="bloom-card sticky top-24">
          <CardHeader>
            <CardTitle>Choose a Meditation</CardTitle>
            <CardDescription>Select a meditation type to begin</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedType} onValueChange={handleMeditationChange} className="space-y-2">
              {meditationOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 rounded-md border p-4 cursor-pointer transition-all ${
                    selectedType === option.id
                      ? "border-wellness-300 bg-wellness-50"
                      : "border-border hover:border-wellness-200"
                  }`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className={selectedType === option.id ? "text-wellness-500" : ""}
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </Label>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock size={14} />
                    <span>{option.duration} min</span>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>Volume</Label>
                    <span className="text-muted-foreground">{volume[0]}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-muted-foreground" />
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full md:w-2/3">
      
        <Card className="bloom-card overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-wellness-200 to-wellness-50 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center z-10">
                <h3 className="text-2xl font-bold mb-2 text-wellness-900">
                  {meditationOptions.find((o) => o.id === selectedType)?.name} Meditation
                </h3>
                <p className="text-sm font-semibold text-wellness-700 mb-6">
                  {meditationOptions.find((o) => o.id === selectedType)?.description}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={restart}
                    className="rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 border-wellness-200"
                  >
                    <SkipBack size={18} />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlay}
                    className={`h-16 w-16 rounded-full ${
                      isPlaying
                        ? "bg-wellness-50 text-wellness-700 hover:bg-wellness-100"
                        : "bg-wellness-600 text-white hover:bg-wellness-700"
                    }`}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={skipForward}
                    className="rounded-full bg-white/60 backdrop-blur-sm hover:bg-white/80 border-wellness-200"
                  >
                    <SkipForward size={18} />
                  </Button>
                </div>
              </div>

              {/* Enhanced crystal ball-like background with animation */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Main crystal ball glow */}
                <div className="absolute w-72 h-72 rounded-full bg-wellness-400/30 filter blur-3xl 
                  animate-float-slow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {/* Inner light effects */}
                  <div className="absolute w-48 h-48 rounded-full bg-wellness-300/40 blur-2xl 
                    animate-pulse-slow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute w-32 h-32 rounded-full bg-wellness-200/30 blur-xl 
                    animate-pulse delay-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Subtle orbiting particles */}
                <div className="absolute w-4 h-4 rounded-full bg-wellness-300/50 blur-sm 
                  animate-orbit top-1/2 left-1/2" style={{ animationDuration: '8s' }} />
                <div className="absolute w-3 h-3 rounded-full bg-wellness-200/50 blur-sm 
                  animate-orbit-delay top-1/2 left-1/2" style={{ animationDuration: '6s' }} />
                <div className="absolute w-2 h-2 rounded-full bg-wellness-400/40 blur-sm 
                  animate-orbit top-1/2 left-1/2" style={{ animationDuration: '10s', animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{currentTimeElapsed}</span>
              <span>{currentTimeRemaining}</span>
            </div>

            <div className="flex items-center gap-2">
              <div onClick={handleProgressClick} className="cursor-pointer flex-1">
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="mt-8">

              <div className="prose prose-sm max-w-none">
                <p>
                  This AI-generated meditation is designed to help you{" "}
                  {selectedType === "calm" && "find inner peace and tranquility"}
                  {selectedType === "focus" && "enhance your concentration and mental clarity"}
                  {selectedType === "sleep" && "prepare your mind and body for restful sleep"}
                  {selectedType === "anxiety" && "reduce feelings of anxiety and worry"}
                  {selectedType === "gratitude" && "cultivate appreciation and positive emotions"}.
                </p>
                <p className="mt-4 mb-8">
                  Find a comfortable position, either seated or lying down. Allow your body to relax and your mind to become
                  present. The guided session will begin when you press play.
                </p>
              </div>

              <div className=" w-full px-4 mb-4">
                <AnimatedBreathingGuide />
              </div>
              
            </div>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bloom-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Benefits of {meditationOptions.find((o) => o.id === selectedType)?.name} Meditation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                {selectedType === "calm" && (
                  <>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Reduces stress and anxiety</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Promotes emotional balance</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Enhances self-awareness</span>
                    </li>
                  </>
                )}
                {selectedType === "focus" && (
                  <>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Improves concentration</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Enhances cognitive performance</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Reduces mental fatigue</span>
                    </li>
                  </>
                )}
                {selectedType === "sleep" && (
                  <>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Improves sleep quality</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Reduces insomnia symptoms</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Calms an overactive mind</span>
                    </li>
                  </>
                )}
                {selectedType === "anxiety" && (
                  <>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Reduces symptoms of anxiety</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Helps manage stress responses</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Promotes emotional regulation</span>
                    </li>
                  </>
                )}
                {selectedType === "gratitude" && (
                  <>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Increases positive emotions</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Improves relationship satisfaction</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-wellness-500">•</span>
                      <span>Reduces comparison and envy</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="bloom-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Practice Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex gap-2">
                  <span className="text-wellness-500">•</span>
                  <span>Find a quiet, comfortable space</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-wellness-500">•</span>
                  <span>Try to maintain the same practice time each day</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-wellness-500">•</span>
                  <span>Be patient with yourself and your progress</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-wellness-500">•</span>
                  <span>Start with shorter sessions and gradually increase</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
};

export default Meditation;