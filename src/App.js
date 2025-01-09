import React from 'react';
import Timer from './Timer';
import './App.css';

function App() {
  return (
    <div className="App" style={{ 
      width: '350px', 
      height: '500px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000'
    }}>
      <Timer />
    </div>
  );
}

export default App;