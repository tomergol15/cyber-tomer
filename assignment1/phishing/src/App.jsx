import { useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [fileContent, setFileContent] = useState(""); 
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setFileContent(reader.result);
    if (file) reader.readAsText(file);
  };

  const handleScan = async () => {
    try {
      const res = await axios.post("http://localhost:5000/scan", {
        content: fileContent,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error scanning email");
    }
  };

  return (
    <div>
      <h1>Email Phishing Scanner</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleScan}>Scan</button>
      {result && ( <div> <h2>Result:</h2>
          {result.phishing ? (
            <>
              <p>This email looks like phishing!</p>
              <ul>
                {result.indicators.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No phishing indicators found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
