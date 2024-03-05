
import { useState, useEffect, useRef } from "react";
import { useZxing } from "react-zxing";


import "./ScanPDF417.css"



export const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [maxResolution, setMaxResolution] = useState({ width: 0, height: 0 });
  const [maxResolutionDevice, setMaxResolutionDevice] = useState<MediaDeviceInfo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        console.log('Devices:', devices);
        var videoDevices = devices.filter(function (device) {
          return device.kind === 'videoinput';
        });

        videoDevices.forEach(function (device) {
          navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: device.deviceId },
              // width: { ideal: 1920 }, // Intenta establecer una resolución más baja
              // height: { ideal: 1080 },  // Intenta establecer una resolución más baja
              facingMode: 'environment', // Utilizar cámara trasera si está disponible
              zoom: 2, // Aplicar un zoom de factor 2

              focusMode: 'continuous', // Enfoque continuo para mantener la imagen nítida
              whiteBalanceMode: 'continuous', // Balance de blancos continuo para ajustar automáticamente el color
              exposureMode: 'continuous' // Modo de exposición continuo para ajustar automáticamente la exposición


            }
          })
            .then(function (stream) {
              console.log('Stream:', stream);
              var track = stream.getVideoTracks()[0];
              var capabilities = track.getCapabilities();

              if (capabilities.width && capabilities.height && capabilities.width.max && capabilities.height.max) {
                if (capabilities.width.max * capabilities.height.max > maxResolution.width * maxResolution.height) {
                  setMaxResolution({ width: capabilities.width.max, height: capabilities.height.max });
                  setMaxResolutionDevice(device);
                }
              }
            });
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }, []);


  const startScanning = () => {
    setResult("");
    setScanning(true);

    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: maxResolutionDevice ? maxResolutionDevice.deviceId : undefined },
        width: { exact: maxResolution.width },
        height: { exact: maxResolution.height }
      }
    })
      .then(function (stream) {
        // Use the stream with the video ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  };


  const resetScanning = () => {
    setResult("");
    setScanning(true);
  };

  const stopScanning = () => {
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
        console.log("El 8vo dato no es una fecha válida");
      }

    },
    paused: !scanning,
  });

  // Función para validar el formato de fecha
  function isValidDate(dateString: string) {
    // Expresión regular para validar el formato "dd/mm/aaaa"
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(dateString);
  }

  return (
    <>
      <div className="scanContent">
        <div className="videoWrapper">
          <video className={window.innerWidth <= 600 ? 'scanVideo smallScreen' : 'scanVideo'} ref={ref} />
          <div className="border"></div>
        </div>
        {!scanning ? (
          <button className="btnScan" onClick={startScanning}>Iniciar escaneo</button>
        ) : (
          <button className="btnScan" onClick={resetScanning}>Reiniciar escaneo</button>
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



