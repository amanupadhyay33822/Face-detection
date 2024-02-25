/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import FaceDetectionPage from "./pages/Face";
import Error from "./pages/Error";
// import Error from "./pages/Error";

const App = () => {
  return (
    <Routes>
      <Route  path="/homepage" element={<HomePage />} />
      {/* <Route path="/" element={<h2>helolo</h2>} /> */}
      <Route path="/" element={<FaceDetectionPage/>} />
      <Route  path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
