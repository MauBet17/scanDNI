import React, { useState } from 'react';
import CodeScanner from 'react-code-scanner';

const ReactCodeScanner = () => {
  const [result, setResult] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

  return (
    <div className="App">
      <h1>Code Scanner</h1>
      <div>Result: {result}</div>
      <div>
        <button onClick={() => setResult('')}>reset</button>
      </div>
      <div>
        <button
          onClick={() =>
            setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
          }
        >
          Current camera: {facingMode} switch camera
        </button>
      </div>
      <CodeScanner
        onResult={res => setResult(res.map(({ value }) => value).join(', '))}
        onError={setResult}
        facingMode={facingMode}
      />
    </div>
  );
};

export default ReactCodeScanner;
