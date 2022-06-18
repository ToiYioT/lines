import React, { useState } from 'react';
import './css/app.css'
import Controls from './components/Controls';
import Gallery from './components/Gallery';
import { LineworksProvider } from './contexts/LineworksContext';
import { Button, MantineProvider } from '@mantine/core';


function App() {


  return (
    <LineworksProvider>

      <MantineProvider
        theme={{
          fontFamily: 'Courier New, Courier, monospace',
        }}
      >
        <div className="app-container">
          <Controls />
          <Gallery />
        </div>
      </MantineProvider>

    </LineworksProvider>
  );
}

export default App;
