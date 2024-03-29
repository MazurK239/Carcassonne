import './App.css';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import AddPlayersModal from './components/AddPlayersModal/AddPlayersModal';
import WinnersModal from './components/WinnersModal/WinnersModal';
import Controls from './components/Controls/Controls';
import { RecoilRoot } from 'recoil';
import GameLoop from './GameLoop'
import {enableMapSet} from "immer"

function App() {
  enableMapSet();
  return (
    <div className="App">
      <RecoilRoot>
        <GameLoop />
        <AddPlayersModal />
        <Header />
        <Controls />
        <Board />
        <WinnersModal />
      </RecoilRoot>
    </div>
  );
}

export default App;
