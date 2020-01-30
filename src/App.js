import React from 'react';
import './App.css';
import Selector from "./Components/Selector";

function App() {

    let getValue = (bookTitle) => {
        alert(bookTitle)
    }

    return (
        <div className="App">
            <Selector getValue={getValue}/>
        </div>
    );
}

export default App;
