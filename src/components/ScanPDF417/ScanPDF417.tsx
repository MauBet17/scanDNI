import { useState } from "react";
import { useZxing } from "react-zxing";

import "./ScanPDF417.css"

export const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false); 

  const startScanning = () => {
    setResult(""); 
    setScanning(true); 
  };

  
  const resetScanning = () => {
    setResult(""); 
    setScanning(true); 
  };

  const stopScanning = () => {
    setResult(""); 
    setScanning(false);
  };
  
  const { ref } = useZxing({
    
    onDecodeResult(result) {
      setResult(result.getText());
    },
    
    paused: !scanning,
  });

  return (
    <>
      <div className="scanContent">
        <video className="scanVideo" ref={ref} />

        {!scanning ? (
          <button onClick={startScanning}>Iniciar escaneo</button>
        ) : (
          <button onClick={resetScanning}>Reiniciar escaneo</button>
        )}

        <div className="results">
          <h5>
            Last result:
          </h5>

          <p>
            {result}
          </p>

          <button onClick={stopScanning}>Cerrar Scan</button>
        </div>
      </div>
    </>
  );
};
