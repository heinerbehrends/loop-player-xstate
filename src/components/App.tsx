import "../App.css";
import { Provider } from "./ContextProvider";
import { LoopPlayer } from "./LoopPlayer";

function App() {
  return (
    <Provider>
      <LoopPlayer />
    </Provider>
  );
}

export default App;
