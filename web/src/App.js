import React, { useContext } from "react";
import './App.css';
import Route from "./components/Navbar/Router";

import {GlobalStateProvider} from './context/globalContext'


function App() {
  return (
    <div>
      <GlobalStateProvider>
      <Route/>
      </GlobalStateProvider>
    </div>
  );
}

export default App;
