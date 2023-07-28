import { useState, useEffect, useRef } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5002";

interface SketchProps {
  output: string;
}

const InitSketch: string = `<div style="height:200px;width:200px;background-color:purple;border-radius:50%;background:radial-gradient(#f0ceff,#b042ff)"></div>`;

const LoadingDots = () => {
  return (
    <div className="loading-container">
      <div className="snippet" data-title="dot-flashing">
        <div className="stage">
          <div className="dot-flashing"></div>
        </div>
      </div>
    </div>
  );
};

const SketchComponent: React.FC<SketchProps> = ({ output }) => {
  console.log(output);
  return (
    <div className="output-container">
      <div dangerouslySetInnerHTML={{ __html: output }}></div>
    </div>
  );
};

function App() {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [sketch, setSketch] = useState(InitSketch);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      submitPrompt();
    }
  };

  const submitPrompt = async () => {
    if (prompt.trim() !== "") {
      try {
        setLoading(true);
        setSketch("");
        const response = await fetch(`${API_BASE_URL}/sketch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        setSketch(data.content.trim());
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching response:", error);
      }
    }
  };

  const handleCopyHTML = async () => {
    await navigator.clipboard.writeText(JSON.stringify(sketch));
    alert("HTML copied to clipboard");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <>
      <h1>sketch</h1>
      <div className="container">
        <input
          className="prompt-input"
          type="text"
          ref={inputRef}
          name="prompt"
          value={prompt}
          placeholder="purple gradient circle"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          text-overflow="ellipsis"
        ></input>
        <div className="sketch-container">
          <div>{loading ? <LoadingDots /> : null}</div>
          {<SketchComponent output={sketch} />}
        </div>
      </div>
      <button onClick={handleCopyHTML}>copy HTML</button>
    </>
  );
}

export default App;
