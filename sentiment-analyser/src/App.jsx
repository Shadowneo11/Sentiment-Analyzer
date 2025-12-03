import React, { useState, useEffect, useRef } from 'react';
import { pipeline } from '@huggingface/transformers';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  
  const classifierRef = useRef(null);

  const MODEL_NAME = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';

  // --- 1. MODEL INITIALIZATION
  useEffect(() => {
    setIsLoading(true);

    async function initializeModel() {
      try {
        const classifier = await pipeline('sentiment-analysis', MODEL_NAME);

        classifierRef.current = classifier;
        
        console.log('Model initialized successfully.');
      } catch (error) {
        console.error('Failed to load the model:', error);
      } finally {
        setIsLoading(false);
      }
    }
    initializeModel();
  }, []);
  
  // --- 2. ASYNCHRONOUS ANALYSIS FUNCTION
  const handleAnalyzeSentiment = async () => {
    if (!inputText.trim() || !classifierRef.current) {
      alert('Please enter text and wait for the model to finish loading.');
      return;
    }

    setSentimentResult(null); 
    setIsLoading(true);

    try {
      const output = await classifierRef.current(inputText);
      setSentimentResult(output[0]); 
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      setSentimentResult({ label: 'ANALYSIS FAILED', score: 0 }); 
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. CLEAR FUNCTION
  const handleClear = () => {
    setInputText('');
    setSentimentResult(null);
  };

  // --- 4. CREATIVE SCORE VISUALIZATION
 const renderVisualization = (result) => {
    if (!result) return null;
    
    const { label, score } = result;

    let icon;
    let iconClass;
    
    if (label === 'POSITIVE') {
      icon = '😎';
      iconClass = 'positive-icon';
    } else if (label === 'NEGATIVE') {
      icon = '🌶️';
      iconClass = 'negative-icon';
    } else {
      icon = '🤷‍♂️'; 
      iconClass = 'neutral-icon';
    }

    const count = Math.ceil(score * 5); 

    return (
      <div className={`visualization ${iconClass}`} style={{ fontSize: '2.5em' }}>
        {Array(count).fill(icon).map((i, index) => <span key={index}>{i}</span>)}
      </div>
    );
  };

  // --- 5. RENDERED UI ---
  return (
    <div className="container">
      <h1>Sentiment Analysis</h1>
      <label htmlFor="text-input">Enter text</label>
      <textarea
        id="text-input"
        placeholder="Type a passage of text here, like one of the test passages in the specification..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows="8"
      />

      <div className="button-group">
        <button 
          onClick={handleAnalyzeSentiment} 
          disabled={isLoading || !classifierRef.current}
          className="analyze-button"
        >
          {isLoading ? 'Loading Model...' : 'ANALYZE SENTIMENT'}
        </button>

        <button onClick={handleClear} className="clear-button">
          CLEAR
        </button>
      </div>

      <div className="results-area">
        {sentimentResult && (
          <>
            <h3>Score: {sentimentResult.score.toFixed(3)} ({sentimentResult.label})</h3>
            {renderVisualization(sentimentResult)} 
          </>
        )}
      </div>
    </div>
  );
}

export default App;