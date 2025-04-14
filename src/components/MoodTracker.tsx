import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Calendar } from "lucide-react";
import { toast } from "sonner";
import generateCalmingContent from "@/pages/api/genai";
import { motion } from "framer-motion";

type MoodEntry = {
  id: string;
  date: Date;
  mood: "great" | "good" | "okay" | "bad" | "terrible";
  intensity: number;
  notes: string;
};

const MoodTracker = () => {
  const [mood, setMood] = useState<"great" | "good" | "okay" | "bad" | "terrible" | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [aiInsight, setAiInsight] = useState(""); // Full AI response

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "great": return "😄";
      case "good": return "🙂";
      case "okay": return "😐";
      case "bad": return "😔";
      case "terrible": return "😢";
      default: return "😐";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async () => {
    if (!mood) {
      toast.error("Please select a mood");
      return;
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: mood,
      intensity: intensity[0],
      notes: notes,
    };

    // Generate AI prompt with clear instruction for the exact message
    const aiPrompt = `
      You are Bloom, a therapeutic assistant focused on mental wellness. Based on the user's latest mood entry and their notes,
      decide if the notes are relevant to their mood. If the notes seem unrelated to the mood (e.g., talking about hobbies, external events, or other topics),
      respond with the exact message: "Please focus on your feelings in the notes, not unrelated topics!" (try to be as flexible as possible and not use the message too often)
      If the notes are relevant, provide a compassionate and brief advice. No more than 100 words.
      **** PLEASE Do not ask questions or request more details, as this is a one-time input, not a conversation.****
      
      Latest Entry:
      - Mood: ${mood}
      - Intensity: ${intensity[0]}/10
      - Notes: ${notes || "None"}
  
      Recent History (last 2 entries):
      ${moodHistory.slice(0, 2).map(entry => `- ${entry.mood} (${entry.intensity}/10) on ${entry.date.toLocaleDateString()}`).join("\n") || "No recent history yet."}
  
      Response: (answer directly and try including some emojis
    `;

    try {
      const aiResponse = await generateCalmingContent(aiPrompt);

      // Check if the response exactly matches the required message
      const expectedMessage = "Please focus on your feelings in the notes, not unrelated topics!";
      
      if (aiResponse.trim() === expectedMessage) {
        toast.error(expectedMessage); // Trigger error if the AI generated the message
        return; // Stop here, don’t save the entry
      } else {
        // Only update history and insight if notes are relevant
        setMoodHistory((prev) => [newEntry, ...prev]);
        setAiInsight(aiResponse);
        toast.success("Mood tracked successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again.");
      console.error("Failed to generate AI insight:", error);
      return; // Stop here on error
    }

    // Reset form only after successful save
    setMood(null);
    setIntensity([5]);
    setNotes("");
  };

  // Animation variants for Framer Motion
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.02, // 20ms delay per character
      },
    }),
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="bloom-card w-full md:w-[700px]">
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
          <CardDescription>Track your mood to discover patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Select your mood</Label>
              <RadioGroup
                value={mood || ""}
                onValueChange={(value) => setMood(value as any)}
                className="flex justify-between"
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      mood === "great" ? "bg-green-100 border-green-500" : "border-muted bg-background"
                    }`}
                  >
                    <RadioGroupItem value="great" id="great" className="sr-only" />
                    <label htmlFor="great" className="cursor-pointer flex items-center justify-center w-full h-full">
                      <Smile
                        className={`h-6 w-6 ${mood === "great" ? "text-green-500" : "text-muted-foreground"}`}
                      />
                    </label>
                  </div>
                  <span className="text-xs">Great</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      mood === "good" ? "bg-teal-100 border-teal-500" : "border-muted bg-background"
                    }`}
                  >
                    <RadioGroupItem value="good" id="good" className="sr-only" />
                    <label htmlFor="good" className="cursor-pointer flex items-center justify-center w-full h-full">
                      <Smile className={`h-6 w-6 ${mood === "good" ? "text-teal-500" : "text-muted-foreground"}`} />
                    </label>
                  </div>
                  <span className="text-xs">Good</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      mood === "okay" ? "bg-blue-100 border-blue-500" : "border-muted bg-background"
                    }`}
                  >
                    <RadioGroupItem value="okay" id="okay" className="sr-only" />
                    <label htmlFor="okay" className="cursor-pointer flex items-center justify-center w-full h-full">
                      <Meh className={`h-6 w-6 ${mood === "okay" ? "text-blue-500" : "text-muted-foreground"}`} />
                    </label>
                  </div>
                  <span className="text-xs">Okay</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      mood === "bad" ? "bg-amber-100 border-amber-500" : "border-muted bg-background"
                    }`}
                  >
                    <RadioGroupItem value="bad" id="bad" className="sr-only" />
                    <label htmlFor="bad" className="cursor-pointer flex items-center justify-center w-full h-full">
                      <Frown className={`h-6 w-6 ${mood === "bad" ? "text-amber-500" : "text-muted-foreground"}`} />
                    </label>
                  </div>
                  <span className="text-xs">Bad</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      mood === "terrible" ? "bg-red-100 border-red-500" : "border-muted bg-background"
                    }`}
                  >
                    <RadioGroupItem value="terrible" id="terrible" className="sr-only" />
                    <label
                      htmlFor="terrible"
                      className="cursor-pointer flex items-center justify-center w-full h-full"
                    >
                      <Frown
                        className={`h-6 w-6 ${mood === "terrible" ? "text-red-500" : "text-muted-foreground"}`}
                      />
                    </label>
                  </div>
                  <span className="text-xs">Terrible</span>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Intensity</Label>
                <span className="text-sm text-muted-foreground">{intensity[0]}/10</span>
              </div>
              <Slider value={intensity} onValueChange={setIntensity} max={10} step={1} min={1} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="What's affecting your mood today?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full bg-wellness-500 hover:bg-wellness-600">
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bloom-card w-full md:w-3/4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Mood History</CardTitle>
            <CardDescription>Track your emotional patterns over time</CardDescription>
          </div>

        </CardHeader>
        <CardContent className="flex flex-col max-h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {moodHistory.length > 0 ? (
              moodHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-wellness-100 bg-gradient-to-r from-wellness-50/50 to-transparent"
                >
                  <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <h4 className="font-medium capitalize">{entry.mood}</h4>
                      <span className="text-xs text-muted-foreground">Intensity: {entry.intensity}/10</span>
                    </div>
                    {entry.notes && <p className="text-sm mt-1">{entry.notes}</p>}
                    <time className="text-xs text-muted-foreground mt-2 block">{formatDate(entry.date)}</time>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No mood entries yet. Start tracking to see your history.</p>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-wellness-50 border border-wellness-100">
            <h4 className="font-medium mb-2">AI Wellness Insight</h4>
            <motion.div key={aiInsight}>
              <p className="text-sm">
                {aiInsight.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                  >
                    {char}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;