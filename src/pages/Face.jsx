import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import "./face.css";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom"; // Import useHistory for routing

function Face() {
  const videoRef = useRef();
  const canvasRef = useRef();
  //   const history = useHistory(); // Create history object for routing
  const navigate = useNavigate();
  const [isPositionedCorrectly, setIsPositionedCorrectly] = useState(false);

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);
    faceMyDetect();
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      if (detections.length == 0) {
        alert("Face is not visible");
        return; // Exit the function if no faces are detected
      }
      if (detections.length > 0) {
        // Validate if the person is sitting properly (add your validation logic here)
        const isSittingProperly = true; // Placeholder for validation logic
        setIsPositionedCorrectly(isSittingProperly);

        if (isSittingProperly) {
          // Route the user to the home page if positioned correctly
          navigate("/homepage");
        }
      }

      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      const canvas = canvasRef.current.children[0];
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 1000);
  };

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay />
      </div>
      <div ref={canvasRef} className="appcanvas" />
    </div>
  );
}

export default Face;
