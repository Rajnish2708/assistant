import React, { useState, useRef } from "react";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";

const VoiceAssistant = ({
  onSpeakStart = () => {},
  onSpeakEnd = () => {},
  onCaptionUpdate = () => {},
}) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef(null);

  const { speak, voices } = useSpeechSynthesis();
  const { listen, stop } = useSpeechRecognition({
    onResult: async (result) => {
      setText(result);
      stop();
      setIsListening(false);
      await handleHuggingFaceReply(result);
    },
  });

  const handleHuggingFaceReply = async (userInput) => {
    try {
      const response = await fetch("http://localhost:5000/huggingface", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();

      console.log("data------>",data)

      let botReply = "";

      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        botReply = data[0].generated_text;
      } else if (data.generated_text) {
        botReply = data.generated_text;
      } else {
        botReply = `Sorry, I couldn't understand that.`;
      }

      console.log("Bot:", botReply);

      onCaptionUpdate(botReply);
      onSpeakStart();

      const selectedVoice = voices.find((v) =>
        v.lang.toLowerCase().includes("en")
      );

      speak({
        text: botReply,
        voice: selectedVoice || voices[0],
        onEnd: () => {
          onSpeakEnd();
          setTimeout(() => onCaptionUpdate(""), 3000);
        },
      });
    } catch (error) {
      console.error("Hugging Face Error:", error);
      speak({
        text: "I'm having trouble connecting to my brain right now.",
        onEnd: () => onSpeakEnd(),
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stop();
      setIsListening(false);
    } else {
      setText("");
      listen({ interimResults: false });
      setIsListening(true);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>🎤 Voice Assistant</h2>
      <p>Say something in English, and the bot will respond.</p>

      <button
        onClick={toggleListening}
        style={{
          padding: "12px 24px",
          backgroundColor: "#4A90E2",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s, transform 0.2s",
        }}
      >
        {isListening ? "🛑 Stop Listening" : "🎙 Start Listening"}
      </button>

      <p style={{ marginTop: "20px" }}>
        <strong>You said:</strong> {text}
      </p>
    </div>
  );
};

export default VoiceAssistant;
