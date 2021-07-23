import { useEffect, useState } from 'react';
import './App.css';
import sounds from './sounds.json';
import useLongPress from './useLongPress';

function App() {
	const [ random, setRandom ] = useState(Math.floor(Math.random() * sounds.length));
	// const [ randomAudio, setRandomAudio ] = useState<HTMLAudioElement>(new Audio(`/DAVAsound/${sounds[random]}`));
	const [ indexPlaying, setIndexPlaying ] = useState<number>(0);
	const [ indexFav, setIndexFav ] = useState<number>(0);
	const [ favs, setFavs ] = useState<any[]>([]);
	const [ audios, setAudios ] = useState(
		sounds.map((sound) => {
			return { audio: new Audio(`/DAVAsound/${sound}`), isPlaying: false };
		})
	);
	const onLongPress = () => {
		if (!favs.includes(indexFav)) {
			setFavs([ indexFav, ...favs ]);
			localStorage.setItem('favoris', JSON.stringify(favs));
		} else {
			const newFavs = favs.filter((x) => x !== indexFav);
			setFavs(newFavs);
			localStorage.setItem('favoris', JSON.stringify(favs));
		}
	};

	useEffect(() => {
		if (localStorage.getItem('favoris')) {
			const f = localStorage.getItem('favoris');
			setFavs(JSON.parse(f as string));
		}
	}, []);

	const defaultOptions = {
		shouldPreventDefault: true,
		delay: 500
	};
	const longPressEvent = useLongPress(onLongPress, defaultOptions);

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
	console.log({ ...longPressEvent });

	return (
		<div className="app">
			<h2>DAVA soundboard</h2>
			<button className="btn-random" onClick={() => start(random)}>
				RANDOM
			</button>
			<div className="btn-container">
				{audios.map((audio, index) => {
					return (
						<button
							className={favs.includes(index) ? 'btn-fav' : 'btn'}
							{...longPressEvent}
							onClick={() => {
								start(index);
								setIndexFav(index);
							}}
							key={index}>
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
