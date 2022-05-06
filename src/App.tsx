import React, { useState } from 'react';
import './css/app.css'
import Controls from './components/Controls';
import Gallery from './components/Gallery';


function App() {


  return (
    <div className="app-container">
      <Controls />
      <Gallery />
    </div>
  );
}

export default App;
