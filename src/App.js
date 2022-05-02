import './App.css';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import AddPlayersModal from './components/AddPlayersModal/AddPlayersModal';
import NextTile from './components/NextTile/NextTile';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <AddPlayersModal />
        <Header />
        <NextTile />
        <Board />
      </RecoilRoot>
    </div>
  );
}

export default App;
