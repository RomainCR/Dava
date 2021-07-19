import { useEffect, useState } from 'react';
import './App.css';
import sounds from './sounds.json';

function App() {
	const [ random, setRandom ] = useState(Math.floor(Math.random() * sounds.length));
	// const [ randomAudio, setRandomAudio ] = useState<HTMLAudioElement>(new Audio(`/DAVAsound/${sounds[random]}`));
	const [ indexPlaying, setIndexPlaying ] = useState<number>(0);
	const [ audios, setAudios ] = useState(
		sounds.map((sound) => {
			return { audio: new Audio(`/DAVAsound/${sound}`), isPlaying: false };
		})
	);

	const start = (index: number) => {
		setRandom(Math.floor(Math.random() * sounds.length));
		if (!audios[index].audio.paused) {
			const newAudios = [ ...audios ];
			newAudios[index].audio.pause();
			newAudios[index].isPlaying = false;
			setAudios(newAudios);
		} else {
			setIndexPlaying(index);
			const newAudios = [ ...audios ];
			newAudios.forEach((a) => {
				a.audio.pause();
				a.audio.currentTime = 0;
			});
			newAudios[index].audio.play();
			newAudios[index].isPlaying = true;
			setAudios(newAudios);
		}
	};

	useEffect(
		() => {
			audios[indexPlaying].audio.addEventListener('ended', () => {
				const newAudios = [ ...audios ];
				newAudios[indexPlaying].isPlaying = false;
				setAudios(newAudios);
			});
			return () => {
				audios[indexPlaying].audio.removeEventListener('ended', () => {
					const newAudios = [ ...audios ];
					newAudios[indexPlaying].isPlaying = false;
					setAudios(newAudios);
				});
			};
		},
		[ indexPlaying, audios ]
	);

	return (
		<div className="app">
			<h2>DAVA soundboard</h2>
			<button className="btn-random" onClick={() => start(random)}>
				RANDOM
			</button>
			<div className="btn-container">
				{audios.map((audio, index) => {
					return (
						<button className="btn" onClick={() => start(index)} key={index}>
							{index}
							{audio.audio.paused ? <i className="fa fa-play" /> : <i className="fa fa-stop" />}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default App;
