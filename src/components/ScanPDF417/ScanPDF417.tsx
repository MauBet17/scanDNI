

import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import "./ScanPDF417.css";
// import { useMediaDevices } from "react-media-devices";

export const BarcodeScanner = () => {
    const [result, setResult] = useState("");
    const [scanning, setScanning] = useState(false);
    const [resolutions, setResolutions] = useState<{ width: number, height: number }[]>([]);

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(deviceInfos => {
                const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
            })
            .catch(error => console.error(error));
    }, []);

    const deviceId = devices[0]?.deviceId;

    useEffect(() => {
        const resolutionsPromises = devices.map(async device => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: device.deviceId,
                    width: { ideal: 4096 }, // Ajusta a la resolución ideal de tu cámara
                    height: { ideal: 2160 }, // Ajusta a la resolución ideal de tu cámara
                }
            });
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            track.stop(); // Importante: detén la pista después de obtener los ajustes
            return { width: settings.width, height: settings.height };
        });
        Promise.all(resolutionsPromises).then((resolutions: { width: number | undefined; height: number | undefined; }[]) => {
            const filteredResolutions = resolutions.map(resolution => ({
              width: resolution.width ?? 0,
              height: resolution.height ?? 0
            }));
            setResolutions(filteredResolutions);
          });
    }, [devices]);

    const { ref } = useZxing({
        onDecodeResult(result) {
            console.log("Resultado decodificado:", result.getText());

            const data = result.getText();
            const dataArray = data.split("@");
            if (dataArray.length !== 9) {
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
        deviceId: deviceId
    });

    // Función para validar el formato de fecha
    function isValidDate(dateString: string) {
        // Expresión regular para validar el formato "dd/mm/aaaa"
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateRegex.test(dateString);
    }
    const stopScanning = () => {
        console.log("Deteniendo escaneo...");
        setScanning(false);
        setResult("");
    };

    const startScanning = () => {
        console.log("Iniciando escaneo...");
        setResult("");
        setScanning(true);
    };

    return (
        <>
            <div className="scanContent">
                <div className="videWrapper">
                    <video ref={ref} />
                </div>
                {!scanning && (
                    <button className="btnScan" onClick={startScanning}>Iniciar escaneo</button>
                )}

                <div className="results">
                    <h3>Last result:</h3>
                    <p>{result}</p>
        
                </div>
                <button onClick={stopScanning}>Cerrar Scan</button>
                {devices.map((device, index) => (
                    <p key={index}>Dispositivo: {device.label}, Resolución: {resolutions[index]?.width}x{resolutions[index]?.height}</p>
                ))}
            </div>
        
        </>
    );
}
