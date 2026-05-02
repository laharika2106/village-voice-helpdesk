import { Mic, Square, Wand2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const languageOptions = [
  { label: "Hindi", value: "hi-IN" },
  { label: "Telugu", value: "te-IN" },
  { label: "Tamil", value: "ta-IN" },
  { label: "Kannada", value: "kn-IN" },
  { label: "Malayalam", value: "ml-IN" },
  { label: "Marathi", value: "mr-IN" },
  { label: "Bengali", value: "bn-IN" },
  { label: "English", value: "en-IN" }
];

export default function VoiceRecorder({ value, onChange, onTranslate, translating }) {
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("hi-IN");
  const [message, setMessage] = useState("");
  const recognitionRef = useRef(null);

  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition,
    []
  );

  function startListening() {
    if (!SpeechRecognition) {
      setMessage("Voice typing is not available in this browser. Please use Chrome or type the complaint.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      onChange(transcript.trim());
    };
    recognition.onerror = () => setMessage("Microphone access failed. Please allow microphone permission.");
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setMessage("");
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  return (
    <section className="voice-panel" aria-label="Voice complaint recorder">
      <div className="voice-actions">
        <label>
          Speaking language
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        {listening ? (
          <button type="button" className="danger-button big-button" onClick={stopListening}>
            <Square size={22} /> Stop
          </button>
        ) : (
          <button type="button" className="primary-button big-button" onClick={startListening}>
            <Mic size={24} /> Speak Your Problem
          </button>
        )}
        <button type="button" className="secondary-button big-button" onClick={onTranslate} disabled={!value || translating}>
          <Wand2 size={22} /> {translating ? "Translating..." : "Translate"}
        </button>
      </div>
      {message && <p className="form-hint">{message}</p>}
    </section>
  );
}
