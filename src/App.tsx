import { useEffect, useState } from 'react';
import './App.css';
import Holdable from './Holdable';
import soundsFormated from './soundsFormated.json';

function App() {
	const [ random, setRandom ] = useState(Math.floor(Math.random() * soundsFormated.length));
	const [ indexPlaying, setIndexPlaying ] = useState<number>();
	const [ favs, setFavs ] = useState<any[]>([]);
	const [ isFavsOnly, setIsFavsOnly ] = useState(false);

	const [ audios, setAudios ] = useState(
		soundsFormated.map((sound) => {
			return { audio: new Audio(`/DAVAsound/${sound.name}`), isPlaying: false, id: sound.id };
		})
	);

	useEffect(() => {
		if (localStorage.getItem('favoris')) {
			const f = localStorage.getItem('favoris');
			setFavs(JSON.parse(f as string));
		} else {
			localStorage.setItem('favoris', JSON.stringify([]));
		}
	}, []);

	const clearFavs = () => {
		localStorage.setItem('favoris', JSON.stringify([]));
		setFavs([])
	}
	

	const showFavs = () => {
		if (!isFavsOnly) {
			const favsAudios = soundsFormated.filter((a, index) => favs?.includes(a.id))		
			setAudios(	favsAudios.map((sound) => {
				return { audio: new Audio(`/DAVAsound/${sound.name}`), isPlaying: false, id: sound.id };
			}))
		} else {
			setAudios(	soundsFormated.map((sound) => {
				return { audio: new Audio(`/DAVAsound/${sound.name}`), isPlaying: false, id: sound.id };
			}))
		}
		setIsFavsOnly(!isFavsOnly)
	}

	const start = (index: number) => {
		setRandom(Math.floor(Math.random() * soundsFormated.length));
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
			if (indexPlaying) {
				audios[indexPlaying]?.audio.addEventListener('ended', () => {
					const newAudios = [ ...audios ];
					newAudios[indexPlaying].isPlaying = false;
					setAudios(newAudios);
				});
			}
			return () => {
				if (indexPlaying) {
					audios[indexPlaying]?.audio.removeEventListener('ended', () => {
						const newAudios = [ ...audios ];
						newAudios[indexPlaying].isPlaying = false;
						setAudios(newAudios);
					});
				}
			};
		},
		[ indexPlaying, audios ]
	);

	function onHold(id: number) {
		const f = localStorage.getItem('favoris');
		const localFav = JSON.parse(f as string);
		if (!localFav) {
			localStorage.setItem('favoris', JSON.stringify([ id ]));
		}
		if (localFav && !localFav?.includes(id)) {
			const newFavs = [...localFav, id]			
			localStorage.setItem('favoris', JSON.stringify(newFavs));
			setFavs(newFavs)
		} else {
			const newFavs = localFav?.filter((x: number) => x !== id);
			localStorage.setItem('favoris', JSON.stringify(newFavs));
			setFavs(newFavs)
		}
	}
useEffect(() => {
	if (isFavsOnly) {
		const favsAudios = soundsFormated.filter(a => favs?.includes(a.id))		
		setAudios(	favsAudios.map((sound) => {
			return { audio: new Audio(`/DAVAsound/${sound.name}`), isPlaying: false, id: sound.id };
		}))
	} 
}, [favs, isFavsOnly])

	return (
		<>
		<div className="bg">
		</div>
		<div className="app">
				<h2>DAVA soundboard</h2>
				<div className="first-buttons-container">
					<button className={isFavsOnly ?"btn-fav": "btn"} onClick={() => showFavs()}>
						Favoris
					</button>
					<button className="btn" onClick={() => start(random)}>
						RANDOM
					</button>
					<Holdable onHold={() => clearFavs()} onClick={isFavsOnly ? () => console.log("C'est vraiment un site de merde") :
					() => start(100)} id={100}>
					<button className="btn">
						Clear favoris
					</button>
					</Holdable>
				</div>
				<div className="btn-container">
					{audios.map((audio, index) => {
						return (
							<Holdable onClick={() => start(index)} onHold={() => onHold(audio.id)} id={index} key={index}>
								<button className={favs.includes(audio.id) ? 'btn-fav':'btn'}>
									{audio.id + 1}
									{audio.audio.paused ? <i className="fa fa-play" /> : <i className="fa fa-stop" />}
								</button>
							</Holdable>
						);
					})}
				</div>
			</div>

			</>
	);
}

export default App;
