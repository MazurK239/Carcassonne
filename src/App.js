import './App.css';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import AddPlayersModal from './components/AddPlayersModal/AddPlayersModal';
import Controls from './components/Controls/Controls';
import { RecoilRoot } from 'recoil';
import GameLoop from './GameLoop'

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <GameLoop />
        <AddPlayersModal />
        <Header />
        <Controls />
        <Board />
      </RecoilRoot>
    </div>
  );
}

export default App;
