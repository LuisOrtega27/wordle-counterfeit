'use strict'

	// ni pta idea de como hacer funcionar esto xD

	// const gameRow = document.querySelectorAll('gameRow')

	const sliding = document.querySelector('.sliding')

	const wrapper = document.querySelector('.wrapper')


	let gameConfig = {
		wordList: [], // se hace fetch a un json con la lista de palabras y se guarda aqui.		
		currentWord: '', // la palabra actual :v.
		currentHint: '', // lo guardo aca solo porque me da lala, tener que buscarlo.
		currentRow: 0, // en que fila se encuantra (son 4, 4 intentos para formar la palabra)
		currentColumn: -1, // para saber en que cuadro debo insertar la letra.
		// letterLength: 0, // numero de letras de la plabra? o yo que se
		usedWords: [], // lista de palabras usadas.
		showWord: false, // cuando pierdes cambia a true y muestra la palabra debajo de la pista.
		winsNumber: 0, // no solo para saber el numero de victorias. Tambien es para seleccionar el tablero d juego en curso.
		correctKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ' '], // pos la letras que se pueden ingresar en el juego.
		trys: [[],[],[],[]]
	}



	const createNewGameDisplay = ()=>{

		getRandomWord(gameConfig.wordList)

		console.log(gameConfig.currentHint)
		// no se si es mejor hacer esto con tamplate string
		// esta parte es escencialmente meter unas cosas dentro de otras.

		console.log('Palabra actual: ' + gameConfig.currentWord)
		// console.log('Numero de letras: ' + wordLength)

		let gameSection = document.createElement('DIV') // es el contenedor al cual se le hace slide para pasar a la siguiente palabra. (se crea uno nuevo por palabra)
		gameSection.className = 'gameSection'

		let gameHint = document.createElement('P')
		gameHint.className= 'hint'
		gameHint.textContent = gameConfig.currentHint
		
		let response = document.createElement('P')
		response.className = 'response'
		
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
		gameSection.appendChild(response)

		sliding.appendChild(gameSection)

		console.log('Creando nuevo tablero de juego')

	}



	const getRandomWord = ()=>{

		let randomNumber = Math.floor(Math.random() * gameConfig.wordList.length) // numero random.

		gameConfig.currentWord = gameConfig.wordList[randomNumber].palabra // guardar la palabra actual.
		gameConfig.currentHint = gameConfig.wordList[randomNumber].pista // guardar la pista actual.
		gameConfig.usedWords.push(gameConfig.currentWord) // añadir la plabra actual a la lista de palabras usadas. (PS no se si use esta lista).


		let position = gameConfig.wordList.findIndex(w=> w.palabra == gameConfig.randomWord) // obtener la posicion de la palabra actual.
		gameConfig.wordList.splice(position, 1) // y quitarlo de la lista de palabras.

	}



	window.addEventListener('load', async(e)=>{ // lo primero que se ejecuta es esto, el fetch a la lista de palabras.
		gameConfig.wordList = await fetch('./words.json') // obtener info blah blah blah.
		.then(res => res.json())
		.then(res => res )

		 // la primera vez se ejecuta aqui.
		createNewGameDisplay() // esta funcion crea todo el tablero de juego. se envia la palabra actual
	})



	let screenWidth = 0
	const moveSlidingRigth = ()=>{

		screenWidth += sliding.children[gameConfig.winsNumber].clientWidth
		sliding.style.transform = `translateX(-${screenWidth}px)`

	}



	const winAnimation = (bool)=>{
		
		let msg_bg = document.createElement('DIV')
		msg_bg.className= 'winAnimation-bg'

		msg_bg.innerHTML= `
			<div class="winAnimation ${bool? 'win': 'lose'}">
				<h2>${bool? 'GANASTE! :D': 'PERDISTE! :P'}</h2>
			</div>
		`;

		
		wrapper.appendChild(msg_bg)
		
		msg_bg.addEventListener('animationend', ()=> wrapper.removeChild(msg_bg) )

		
		// console.log(bool)
		
		// <div class="winAnimation-bg">
		// 	<div class="winAnimation">
		// 		<h2>GANASTE!</h2>
		// 	</div>
		// </div>
	}



	const userWins = ()=>{

		gameConfig.currentRow= 0
		gameConfig.currentColumn= -1
		gameConfig.winsNumber+= 1
		gameConfig.trys= [[],[],[],[]]

		console.log('User Wins!!')


		createNewGameDisplay() // esta funcion crea todo el tablero de juego. se envia la palabra actual


		moveSlidingRigth()

		// console.log(gameConfig)


		winAnimation(true)
		
	}



	const userLose = ()=>{
		gameConfig.currentRow= 0
		gameConfig.currentColumn= -1
		gameConfig.winsNumber= 0
		gameConfig.trys= [[],[],[],[]]


		winAnimation(false)
		document.querySelector('.response').textContent = `La respuesta era: ${gameConfig.currentWord}`
	}



	const verifyWin = (bool)=>{
		
		gameConfig.trys[gameConfig.currentRow][gameConfig.currentColumn] = bool


		if(gameConfig.trys[gameConfig.currentRow].length == gameConfig.currentWord.length){

			let win= gameConfig.trys[gameConfig.currentRow].find(b=> b == false) // si encuentra un 'false' en la lista, lo retorna. si no lo encuenta  retorna 'undefined'.

			// si 'undefined', ganas.
			if(win == undefined) userWins()

		}

		if(gameConfig.trys[3].length == gameConfig.currentWord.length){

			let win= gameConfig.trys[gameConfig.currentRow].find(b=> b == false)

			// si 'false', pierdes.
			if(win == false) userLose()

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

		verifyWin(bool)

	}



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

	}



	window.addEventListener('keyup', (e)=>{
		
		let key = e.key

		gameConfig.correctKeys.map(w=> { // esto filtra que letras activan la insercion de letra.
			if(key == w) insertLetter(key.toUpperCase())
		})

	})

