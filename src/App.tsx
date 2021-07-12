import { useState } from 'react';
import './App.css';
import sounds from './sounds.json';

function App() {
	const [ random, setRandom ] = useState(Math.floor(Math.random() * sounds.length));

	let audio = new Audio(`/DAVAsound/${sounds[random]}`);
	console.log(sounds[random], random, sounds.length);

	const start = () => {
		setRandom(Math.floor(Math.random() * sounds.length));
		audio.play();
	};

	return (
		<div className="app" onClick={start}>
			{/* <button className="btn" onClick={start}>
				DAVA
			</button> */}
		</div>
	);
}

export default App;
