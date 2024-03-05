import { useState, useEffect, useRef } from "react";
import { useZxing } from "react-zxing";
import "./ScanPDF417.css";

export const BarcodeScanner = () => {
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);
  const [maxResolution, setMaxResolution] = useState({ width: 0, height: 0 });
  const [maxResolutionDevice, setMaxResolutionDevice] = useState<MediaDeviceInfo | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        console.log('Devices:', devices);
        const cameras = devices.filter(function(device) {
          return device.kind === 'videoinput';
        });

        setAvailableCameras(cameras);

        cameras.forEach(function(camera) {
          navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: camera.deviceId } }
          })
            .then(function(stream) {
              console.log('Stream:', stream);
              const track = stream.getVideoTracks()[0];
              const capabilities = track.getCapabilities();

              if (capabilities.width && capabilities.height && capabilities.width.max && capabilities.height.max) {
                if (capabilities.width.max * capabilities.height.max > maxResolution.width * maxResolution.height) {
                  setMaxResolution({ width: capabilities.width.max, height: capabilities.height.max });
                  setMaxResolutionDevice(camera);
                }
              }
            });
        });
      })
      .catch(function(err) {
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
      .then(function(stream) {
        // Use the stream with the video ref
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(function(err) {
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
      if (dataArray.length !== 8) {
        setResult("Número incorrecto de datos");
        return;
      }

      if (!/^\d+$/.test(dataArray[0])) {
        setResult("El primer dato no es numérico");
        return;
      }

      if (!/^[a-zA-Z\s]+$/.test(dataArray[1])) {
        setResult("El segundo dato no es texto");
        return;
      }

      if (!/^[a-zA-Z\s]+$/.test(dataArray[2])) {
        setResult("El tercer dato no es texto");
        return;
      }

      if (!/^[a-zA-Z\s]+$/.test(dataArray[3])) {
        setResult("El cuarto dato no es texto");
        return;
      }

      if (!/^\d+$/.test(dataArray[4])) {
        setResult("El quinto dato no es numérico");
        return;
      }

      if (!/^[a-zA-Z\s]+$/.test(dataArray[5])) {
        setResult("El sexto dato no es texto");
        return;
      }

      if (!isValidDate(dataArray[6])) {
        setResult("El séptimo dato no es una fecha válida");
        return;
      }

      if (!isValidDate(dataArray[7])) {
        setResult("El octavo dato no es una fecha válida");
        return;
      }

      setResult(data);
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
          <h5>Last result:</h5>
          <p>{result}</p>
          <p>
            {availableCameras.length > 0 && (
              <>
                Available Cameras:
                <ul>
                  {availableCameras.map((camera, index) => (
                    <li key={index} onClick={() => {
                      setMaxResolutionDevice(camera);
                      // Retrieve resolution for selected camera
                      navigator.mediaDevices.getUserMedia({
                        video: { deviceId: { exact: camera.deviceId } }
                      })
                        .then(function(stream) {
                          const track = stream.getVideoTracks()[0];
                          const capabilities = track.getCapabilities();
                          if (capabilities.width && capabilities.height && capabilities.width.max && capabilities.height.max) {
                            setMaxResolution({ width: capabilities.width.max, height: capabilities.height.max });
                          }
                        });
                    }}>{camera.label}</li>
                  ))}
                </ul>
              </>
            )}
          </p>
          <p>
            {maxResolutionDevice && (
              <>
                Max Resolution: {maxResolution.width}x{maxResolution.height}
              </>
            )}
          </p>
          <button onClick={stopScanning}>Cerrar Scan</button>
        </div>
      </div>
    </>
  );
};
