'use strict'



	let icon = document.querySelector('#icon')
	icon.addEventListener('click', ()=>{
		document.querySelector('#instructions-list').classList.toggle('open-list')
		document.querySelector('.arrow').classList.toggle('arrow-down')
	})





	// ni pta idea de como hacer funcionar esto xD

	// const gameRow = document.querySelectorAll('gameRow')

	const sliding = document.querySelector('.sliding')

	const wrapper = document.querySelector('.wrapper')

	let gameConfig = {
		wordList: [], // se hace fetch a un json con la lista de palabras y se guarda aqui.		
		currentWord: '', // la palabra actual :v.
		currentHint: '', // lo guardo aca solo porque me da lala, tener que buscarlo.
		currentRow: 0, // para saber en que fila se encuantra (son 4, 4 intentos para formar la palabra)
		currentColumn: -1, // para saber en que cuadro debo insertar la letra. (tiene que empezar en '-1' porque no se como hacerlo de otra manera xD)
		usedWords: [], // lista de palabras usadas.
		winsNumber: 0, // no solo para saber el numero de victorias. Tambien es para seleccionar el tablero d juego en curso.
		correctKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', 'z', 'x', 'c', 'v', 'b', 'n', 'm'], // pos la letras que se pueden ingresar en el juego.
		trys: [[],[],[],[]],
		frases: {
			wins: ['Muy bien!', 'Yay!!', 'Si se puede!', 'Una mas :D', 'No te rindas!'],
			Lose: ['Lastima...', 'Seguro la proxima', 'Solo pierdes si te rindes']
		}
	}

	const setRandomBgColor = ()=>{
		

		// Hue (color en 360deg) 
		let h= Math.floor(Math.random() * 360)
		
		// Saturation (la saturacion hasta 100%)
		// s= Math.floor(Math.random() * 100)

		// Lightness (el brillo hasta 100%)
		// l= Math.floor(Math.random() * 100)


		document.body.style.setProperty( '--bgColor', `hsl(${h}, 50%, 60%)` )

		// console.log(document.body.style.getPropertyValue('--bgColor'))
	}

	

	const createNewGameDisplay = ()=>{

		if(gameConfig.wordList.length == 0) return endGame()

		//este es el tablero de juego

		getRandomWord(gameConfig.wordList)

		// no se si es mejor hacer esto con tamplate string
		// esta parte es escencialmente meter unas cosas dentro de otras.

		console.log('Palabra actual: ' + gameConfig.currentWord)
		// console.log('Numero de letras: ' + wordLength)

		let gameSection = document.createElement('DIV') // es el contenedor al cual se le hace slide para pasar a la siguiente palabra. (se crea uno nuevo por palabra)
		gameSection.className = 'gameSection'

		let gameHint = document.createElement('P')
		gameHint.className= 'hint'
		gameHint.textContent = gameConfig.currentHint

		let correctAnswer = document.createElement('P')
		correctAnswer.className = 'correct-answer'
		
		let gameContainer = document.createElement('DIV') // pos el contenedor es solo uno por palabra.
		gameContainer.className = 'gameContainer'
		

		for (let i = 0; i < 4; i++) {// n * 4, son el numero de intentos para adivinar la palabra.
			
			let gameRow = document.createElement('DIV') 
			gameRow.className = 'gameRow'


			// Crear los cuadros donde van las letras.
			for (let i = 0; i < gameConfig.currentWord.length; i++) { // n * numero de letras en la palabra.
				
				let gameColumn = document.createElement('DIV') 
				gameColumn.className = 'gameColumn'

				gameRow.appendChild(gameColumn)
				
			}
	
				gameContainer.appendChild(gameRow)
		}

		gameSection.appendChild(gameContainer)
		gameSection.appendChild(gameHint)
		gameSection.appendChild(correctAnswer)

		sliding.appendChild(gameSection)

		// console.log('Creando nuevo tablero de juego')
		// console.log(gameConfig.wordList)

	}


	const endGame = ()=>{
		
		let endMsg = document.createElement('DIV')
		endMsg.className= 'winAnimation-bg'

		endMsg.innerHTML = `
			<div class="winAnimation win" style='animation: slide-down-center 1.5s linear forwards;'>
				<h2 style='animation: none;'>Completaste el juego</h2>
				<small>Pronto nuevas actualizaciones ;D</small>
			</div>
		`;

		wrapper.appendChild(endMsg)
	}

	const getRandomWord = ()=>{

		let randomNumber = Math.floor(Math.random() * gameConfig.wordList.length) // numero random.


		gameConfig.currentWord = gameConfig.wordList[randomNumber].palabra // guardar la palabra actual.
		gameConfig.currentHint = gameConfig.wordList[randomNumber].pista // guardar la pista actual.
		gameConfig.usedWords.push(gameConfig.currentWord) // añadir la plabra actual a la lista de palabras usadas. (PS no se si use esta lista).


		let position
		gameConfig.wordList.map(({palabra}, index)=>{ 	
			if(gameConfig.currentWord == palabra) position= index
		}) // obtener la posicion de la palabra actual.
		
		// console.log(position, gameConfig.currentWord)
		
		gameConfig.wordList.splice(position, 1) // y quitarlo de la lista de palabras.

	}



	window.addEventListener('load', async()=>{ // lo primero que se ejecuta es esto, el fetch a la lista de palabras.
		
		gameConfig.wordList = await fetch('./words.json') // obtener info blah blah blah.
		.then(res => res.json())
		.then(res => res )

		setRandomBgColor()

		 // la primera vez se ejecuta aqui.
		createNewGameDisplay() // esta funcion crea todo el tablero de juego. se envia la palabra actual

	})



	
	const moveSlidingLeft = ( screenWidth = 0 )=>{

		let timer = screenWidth==0? 0: 1000

		setTimeout(()=>{

			if(screenWidth == 0) sliding.style.transition = 'transform 0s ease'
			
			sliding.style.transform = `translateX(-${screenWidth}px)`

			
			setRandomBgColor()
			
		}, timer)
		
		sliding.style.transition = 'transform 0.6s ease'
		
	}



	const winAnimation = (bool)=>{

		
		let limit = bool? gameConfig.frases.wins.length : gameConfig.frases.Lose.length

		let randomNumber = Math.floor( Math.random() * limit )

		
		let frase = bool? gameConfig.frases.wins[randomNumber] : gameConfig.frases.Lose[randomNumber]

		
		// console.log(Math.floor( Math.random() * limit ))

		

		let msg_bg = document.createElement('DIV')
		msg_bg.className= 'winAnimation-bg'

		msg_bg.innerHTML= `
			<div class="winAnimation ${bool? 'win' : 'lose'}">
				<h2>${frase}</h2>
			</div>
		`;

		
		wrapper.appendChild(msg_bg)
		
		msg_bg.addEventListener('animationend', ()=> wrapper.removeChild(msg_bg) )

	}



	const resetGameDefaultValues = (bool) =>{
		gameConfig.currentRow= 0
		gameConfig.currentColumn= -1
		gameConfig.winsNumber= bool? 0: gameConfig.winsNumber+1
		gameConfig.trys= [[],[],[],[]]
	}



	const modifyUserPoints= (addNew)=>{

		if(addNew){

			// mostrar partidas ganadas
			document.querySelector('#userPoints').textContent = gameConfig.winsNumber
			
			let li = document.createElement('LI')
			li.textContent = gameConfig.currentWord
			
			document.querySelector('#answeredList').appendChild(li)
			
		}else{

			// Reseterar
			document.querySelector('#userPoints').textContent = gameConfig.winsNumber
			
			document.querySelector('#answeredList').innerHTML= null
			
		}
		
	}



	const userWins = ()=>{

		resetGameDefaultValues(false)
		
		
		modifyUserPoints(true)


		console.log('User Wins!!')


		createNewGameDisplay() // esta funcion crea todo el tablero de juego. se envia la palabra actual

		let screenWidth = wrapper.clientWidth * gameConfig.winsNumber
		moveSlidingLeft(screenWidth)

		// console.log(gameConfig)


		winAnimation(true)
		
	}


	
	const resetDefaultCoords = (e)=>{
		if(e.key == 'Enter') resetGame(resetDefaultCoords)
	}



	const resetGame = async(resetDefaultCoords)=>{

		modifyUserPoints(false)
		
		sliding.innerHTML= null
		console.log('borrando tablero de juego actual.')
		
		gameConfig.wordList = await fetch('./words.json')
		.then(res => res.json())
		.then(res => res )
		
		
		moveSlidingLeft()
		createNewGameDisplay()
		resetGameDefaultValues(true)


		window.removeEventListener('keydown', resetDefaultCoords)
	}
	
	const userLose = ()=>{
		
			let currentAnswer= document.querySelectorAll('.correct-answer')[gameConfig.winsNumber]
			currentAnswer.style.display = 'block'
			currentAnswer.classList.add('scale-down-animation')
			currentAnswer.innerHTML = `--> Respuesta: ${gameConfig.currentWord} <--`		

			
			resetGameDefaultValues(true)
			
			
			winAnimation(false)
			
			
			window.addEventListener('keydown', resetDefaultCoords)	
			
	}



	const verifyWin = (bool)=>{
		
		gameConfig.trys[gameConfig.currentRow][gameConfig.currentColumn] = bool

		// este es para confirmar cuarquier fila
		if(gameConfig.trys[gameConfig.currentRow].length == gameConfig.currentWord.length){

			let win= gameConfig.trys[gameConfig.currentRow].find(b=> b == false) // si encuentra un 'false' en la lista, lo retorna. si no lo encuenta  retorna 'undefined'.

			// si 'undefined', ganas.
			if(win == undefined) userWins()

		}

		

		// este es para comfirmar solo la ultima fila (con este pierdes)	
		if(gameConfig.trys[3].length == gameConfig.currentWord.length){

			let lose= gameConfig.trys[gameConfig.currentRow].find(b=> b == false)

			// si 'false', pierdes.
			if(lose == false) userLose()

		}

	}



	const verifyLetterMatch = (k, currentBox)=>{

		let currentWordArray = Array.from(gameConfig.currentWord)

		let bool = null

		// cuadro amarillo: la letra esta en la palabra pero no en la posicion correcta 
		if(currentWordArray.indexOf(k) != -1){
			currentBox.classList.add('letter-almost')
			// console.log("Casi ahi!")
			bool = false
		}


		// cuadro verde: la letra esta en la palabra y en la posicion correcta. 
		if(k == gameConfig.currentWord[gameConfig.currentColumn]){
			currentBox.classList.remove('letter-almost')
			currentBox.classList.add('letter-correct')
			// console.log("Correcto!!!")
			bool = true
		}


		// cuadro rojo: la letra no esta en la palabra. 
		if(currentWordArray.indexOf(k) == -1){
			currentBox.classList.add('letter-wrong')
			// console.log("Nop, esta no.")
			bool = false
		}

		currentBox.classList.add('scale-down-animation')


		
		
		verifyWin(bool)


	}


	// Esta funcionalidad todabia esta en proceso!!

	// De pana no se como implementar esto, bueno hasta aqui llego el primer intento de hacer un juego xD 05/21/2022
	

	// const lineJump = ()=>{

	// 		console.log(gameConfig.currentRow)

	// 		let currentGameContainer = document.querySelectorAll('.gameContainer')[gameConfig.winsNumber]
			
	// 		for (let i = 0; i < gameConfig.currentWord.length; i++){			
	// 			currentGameContainer.children[gameConfig.currentRow].children[i].classList.add('letter-wrong', 'scale-down-animation')

	// 			gameConfig.currentColumn += 1
				
	// 			verifyWin(false)

	// 		}


			
	// 		gameConfig.currentRow += 1

	// 		console.log(gameConfig.trys)
	// }



	const insertLetter = (k)=>{


			// esto selecciona en cual de las secciones de juego en el que escribir 
			let gameSections = document.querySelectorAll('.gameSection')
			let gameContainer = gameSections[gameConfig.winsNumber].children[0]
			let rows = gameContainer.children

			
			if(gameConfig.currentColumn < gameConfig.currentWord.length - 1){

				// cambiar de column

				gameConfig.currentColumn += 1
			
				// es solo recorrer un array de 2 dimenciones.
				rows[gameConfig.currentRow].children[gameConfig.currentColumn].textContent = k
				// console.log('row: ' + gameConfig.currentRow, 'Col: ' + gameConfig.currentColumn)

				let currentBox = rows[gameConfig.currentRow].children[gameConfig.currentColumn]

				verifyLetterMatch(k, currentBox)
				
			}else{

				// cambiar de row
				
				gameConfig.currentColumn = 0
				gameConfig.currentRow += 1 
				
				rows[gameConfig.currentRow].children[gameConfig.currentColumn].textContent = k
				// console.log('row: ' + gameConfig.currentRow, 'Col: ' + gameConfig.currentColumn)
				
				let currentBox = rows[gameConfig.currentRow].children[gameConfig.currentColumn]
				verifyLetterMatch(k, currentBox)
				
				
				
				
			}

			// esto esta en progreso
			// let theseRows = document.querySelectorAll('.gameContainer')[gameConfig.winsNumber]

			// console.log(theseRows.children.length)

			// for(let i = 0; i < theseRows.children.length; i++){

			// theseRows.children[i].classList.remove('currentRow')

			// }

			// theseRows.children[gameConfig.currentRow].classList.add('currentRow')

	}

	const keyUpHandler = (letter)=>{


		// if(letter=='Enter'){	
		// 	if(gameConfig.currentRow < 4)  lineJump()
		// }


		gameConfig.correctKeys.map(correct=> { // esto filtra que letras activan la insercion de letra.		
			if(letter == correct)insertLetter(letter.toUpperCase())
		})


	}


	window.addEventListener('keyup', (e)=>{
		
		keyUpHandler(e.key)

	})



