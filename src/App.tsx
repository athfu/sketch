import { useState, useEffect, useRef } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5002";

interface SketchProps {
  output: string;
}

const InitSketch: string = `<div style="height:100px;width:100px;background-color:purple;border-radius:50%`;

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div
        className="loading-spinner"
        style={{ borderColor: "black", borderBottomColor: "transparent" }}
      ></div>
    </div>
  );
};

const SketchComponent: React.FC<SketchProps> = ({ output }) => {
  console.log(output);
  return (
    <div dangerouslySetInnerHTML={{ __html: output }} r>
      {/* {output} */}
      {/* <div dangerouslySetInnerHTML={test} />
      <div dangerouslySetInnerHTML={htmlObj} /> */}
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    <>
      <h1>sketch</h1>
      <input
        className="prompt-input"
        type="text"
        ref={inputRef}
        name="prompt"
        value={prompt}
        placeholder="a purple circle"
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck="false"
      ></input>
      <div>{loading ? <LoadingSpinner /> : null}</div>
      <br />
      <br />
      {<SketchComponent output={sketch} />}
    </>
  );
}

export default App;
