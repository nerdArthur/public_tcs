import Routes from "./routes";
import "./styles/global";
import { BrowserRouter } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);

export default App;
