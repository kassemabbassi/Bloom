import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import EmotionsDisplay from './EmotionsDisplay';
import { generateVoice } from "@/lib/generateVoice";
import generateContent from "@/lib/generateContent";

interface Detection {
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  landmarks?: faceapi.FaceLandmarks68;
}

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [showLandmarksOnly, setShowLandmarksOnly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = './models';
        if (!faceapi.nets.tinyFaceDetector.isLoaded) {
          toast.info("Loading facial detection models...");
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          ]);
          toast.success("Models loaded successfully");
          setIsModelLoaded(true);
        } else {
          setIsModelLoaded(true);
        }
      } catch (error) {
        console.error('Error loading models:', error);
        toast.error("Error loading models");
      }
    };
    loadModels();
  }, []);

  // Start the webcam
  const startWebcam = async () => {
    if (!isModelLoaded) {
      toast.error("Detection models are not yet loaded");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          toast.success("Camera activated");
        };
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast.error("Unable to access the camera");
    }
  };

  // Cleanup on unmount (handles navigation)
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        console.log('Video stream stopped');
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Detect face in real-time
  useEffect(() => {
    if (!isModelLoaded || !isCameraReady || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const adjustCanvas = () => {
      if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    const resizeObserver = new ResizeObserver(adjustCanvas);
    resizeObserver.observe(video);
    adjustCanvas();

    if (showLandmarksOnly) return;

    let animationFrameId: number;
    const detectFace = async () => {
      if (video.paused || video.ended || !canvas) return;
      animationFrameId = requestAnimationFrame(detectFace);
    };
    detectFace();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isModelLoaded, isCameraReady, showLandmarksOnly]);

  // Auto-play audio only when appropriate
  useEffect(() => {
    if (audioUrl && audioRef.current && showLandmarksOnly) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error("Auto-play error:", error);
          toast.info("Click to listen to the analysis");
        });
    }
  }, [audioUrl, showLandmarksOnly]);

  // Capture and analyze expressions
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error("The camera is not ready");
      return;
    }

    setIsProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          const resizedDetections = faceapi.resizeResults(detections, {
            width: canvas.width,
            height: canvas.height,
          });
          setShowLandmarksOnly(true);
          setShowVideo(false);

          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
          }

          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          const firstFace = resizedDetections[0];
          if (firstFace) {
            setDetection({
              expressions: firstFace.expressions,
              landmarks: firstFace.landmarks,
            });
            toast.success("Expression analysis completed");

            const dominantEmotion = Object.keys(firstFace.expressions).reduce(
              (a, b) => (firstFace.expressions[a] > firstFace.expressions[b] ? a : b)
            );
            const intensity = Math.round(firstFace.expressions[dominantEmotion] * 10);
            const calmingContent = await generateContent(dominantEmotion, intensity.toString());
            const url = await generateVoice(calmingContent);
            setAudioUrl(url);
          }
        } else {
          toast.error("No face detected");
          setShowLandmarksOnly(false);
        }
      }
    } catch (error) {
      console.error('Error during capture and analysis:', error);
      toast.error("Error during analysis");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset state and stop audio
  const resetDetection = async () => {
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioUrl(null); // Clear audio URL

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    setShowLandmarksOnly(false);
    setDetection(null);
    setShowVideo(true);
    await startWebcam();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full p-4">
        <div className="camera-container">
          {showVideo && (
            <video ref={videoRef} className="video-element" autoPlay muted playsInline />
          )}
          <canvas ref={canvasRef} className="canvas-overlay" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {!isCameraReady ? (
            <Button
              onClick={startWebcam}
              disabled={!isModelLoaded}
              className="bg-wellness-500 hover:bg-wellness-600"
            >
              {isModelLoaded ? "Activate the camera" : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading models...
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={captureAndAnalyze}
                disabled={showLandmarksOnly || isProcessing}
                className="bg-wellness-500 hover:bg-wellness-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analysis in progress...
                  </>
                ) : "Take a photo"}
              </Button>
              {showLandmarksOnly && (
                <Button
                  onClick={resetDetection}
                  variant="outline"
                  className="border-wellness-200 hover:bg-wellness-100 hover:text-black"
                >
                  Reset
                </Button>
              )}
            </>
          )}
        </div>
      </Card>

      {detection && showLandmarksOnly && <EmotionsDisplay expressions={detection.expressions} />}
      <audio
        ref={audioRef}
        src={audioUrl}
        hidden
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default FaceDetection;