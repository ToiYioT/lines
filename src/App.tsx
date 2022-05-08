import React, { useState } from 'react';
import './css/app.css'
import Controls from './components/Controls';
import Gallery from './components/Gallery';
import { LineworksProvider } from './contexts/LineworksContext';


function App() {


  return (
    <LineworksProvider>
      <div className="app-container">
        <Controls />
        <Gallery />
      </div>

    </LineworksProvider>
  );
}

export default App;
