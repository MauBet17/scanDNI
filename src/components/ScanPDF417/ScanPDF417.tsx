

import { useState } from "react";
import { useZxing } from "react-zxing";
// import { useMediaDevices } from "react-media-devices"; // Importa useMediaDevices
import "./ScanPDF417.css";

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
      const data = result.getText();
      const dataArray = data.split("@");
      if (dataArray.length > 0 && /^\d+$/.test(dataArray[0])) {
        setResult(data);
        console.log("Validación del 1er dato: correcta, es numérico - Indica N° de Tramite");
      } else {
        setResult("El primer dato no es numérico");
      }

      if (dataArray.length > 1 && /^[a-zA-Z\s]+$/.test(dataArray[1])) {
        console.log("Validación del 2do dato: correcta, es texto - Indica Apellido");
      } else {
        console.log("El 2do dato no es texto");
      }

      if (dataArray.length > 2 && /^[a-zA-Z\s]+$/.test(dataArray[2])) {
        console.log("Validación del 3er dato: correcta, es texto - Indica Nombre");
      } else {
        console.log("El 3er dato no es texto");
      }

      if (dataArray.length > 3 && /^[a-zA-Z\s]+$/.test(dataArray[3])) {
        console.log("Validación del 4to dato: correcta, es texto - Indica Sexo");
      } else {
        console.log("El 4to dato no es texto");
      }

      if (dataArray.length > 4 && /^\d+$/.test(dataArray[4])) {
        console.log("Validación del 5to dato: correcta, es numérico - Indica DNI");
      } else {
        setResult("El 5to dato no es numérico");
      }

      if (dataArray.length > 5 && /^[a-zA-Z\s]+$/.test(dataArray[5])) {
        console.log("Validación del 6to dato: correcta, es texto - Indica Ejemplar");
      } else {
        console.log("El 6to dato no es texto");
      }

      if (dataArray.length > 6 && isValidDate(dataArray[6])) {
        console.log("Validación del 7mo dato: correcta, es una fecha - Indica Fecha de Nacimiento");
      } else {
        console.log("El 7mo dato no es una fecha válida");
      }

      if (dataArray.length > 7 && isValidDate(dataArray[7])) {
        console.log("Validación del 8vo dato: correcta, es una fecha - Indica Fecha de Emisión");
      } else {
        console.log("El 7mo dato no es una fecha válida");
      }
    },
    paused: !scanning,
  });

  // Obtén la lista de dispositivos
  // const { devices } = useMediaDevices();

  // Función para validar el formato de fecha
  function isValidDate(dateString: string) {
    // Expresión regular para validar el formato "dd/mm/aaaa"
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(dateString);
  }

  return (
    <>
      <div className="scanContent">
        <video className="scanVideo" ref={ref} />

        {/* Mostrar la lista de dispositivos */}
        {/* <div className="devicesList">
          <h5>Dispositivos:</h5>
          <ul>
            {devices?.map((device) => (
              <li key={device.deviceId}>{device.label}</li>
            ))}
          </ul>
        </div> */}

        {!scanning ? (
          <button className="btnScan" onClick={startScanning}>
            Iniciar escaneo
          </button>
        ) : (
          <button className="btnScan" onClick={resetScanning}>
            Reiniciar escaneo
          </button>
        )}

        <div className="results">
          <h5>Last result:</h5>
          <p>{result}</p>
          <button onClick={stopScanning}>Cerrar Scan</button>
        </div>
      </div>
    </>
  );
};
