import React, { useState } from "react";
import axios from "axios";
import './Gpt.css'; // Importing the updated CSS file

const StoryCreator = () => {
  const [prompt, setPrompt] = useState(""); // User input for story idea
  const [story, setStory] = useState(""); // Generated story content
  const [loading, setLoading] = useState(false); // Loader state
  const [currentPage, setCurrentPage] = useState(0); // Track current page to display

  const handleGenerateStory = async () => {
    if (!prompt.trim()) return alert("దయచేసి కథ కోసం ఒక ఆలోచన లేదా పంచం ఎంటర్ చేయండి!");

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a Telugu story writer. Write a complete, meaningful children's story in Telugu with a clear title, summary, story, and moral." },
            { role: "user", content: `Generate a complete Telugu story with title, summary, and moral based on this idea: ${prompt}.` },
          ],
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const generatedStory = response.data.choices[0].message.content;
      setStory(generatedStory);
    } catch (error) {
      console.error("Error generating story:", error);
      alert("ఏదో తప్పు జరిగింది. దయచేసి తిరిగి ప్రయత్నించండి.");
    }
    setLoading(false);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, 3)); // Limits to 4 pages
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const splitStory = story.split("\n");

  return (
    <div className="container">
      <div className="chat-box">
        <h1 className="title">తెలుగు కథ సృష్టికర్త</h1>

        <textarea
          className="textarea"
          rows="5"
          placeholder="తెలుగులో కథ కోసం ఆలోచన లేదా పంచం ఎంటర్ చేయండి..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        <button
          className={`generate-button ${loading ? "loading" : ""}`}
          onClick={handleGenerateStory}
          disabled={loading}
        >
          {loading ? "సృష్టించబడుతోంది..." : "కథ సృష్టించండి"}
        </button>
      </div>

      {story && (
        <div className="story-container">
          <div className="story-section">
            {currentPage === 0 && (
              <div>
                <h2 className="story-heading">📝 శీర్షిక</h2>
                <p>{splitStory[0]}</p>
              </div>
            )}
            {currentPage === 1 && (
              <div>
                <h2 className="story-heading">📜 కథ - భాగం 1</h2>
                <p>{splitStory.slice(1, 2).join("\n")}</p>
              </div>
            )}
            {currentPage === 2 && (
              <div>
                <h2 className="story-heading">📜 కథ - భాగం 2</h2>
                <p>{splitStory.slice(2, 3).join("\n")}</p>
              </div>
            )}
            {currentPage === 3 && (
              <div>
                <h2 className="story-heading">📖 పాఠం</h2>
                <p>{splitStory[splitStory.length - 1]}</p>
              </div>
            )}
          </div>

          <div className="navigation">
            {currentPage > 0 && (
              <button className="nav-button" onClick={handlePrevPage}>ముందు</button>
            )}
            {currentPage < 3 && (
              <button className="nav-button" onClick={handleNextPage}>తరువాత</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCreator;
