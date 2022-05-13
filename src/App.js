import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import showRandomFace from './diceFaces'

export default function App() {
    //dice state takes in the allNewDice function = random array of numbers
    const [dice, setDice] = React.useState(allNewDice())
    //tenzies state initializes as false prior to starting and clicking "Roll"
    const [tenzies, setTenzies] = React.useState(false)
    //rolls state counts the number of times the user clicks roll 
    const [rolls, setRolls] = React.useState(0)
    //startTime takes a new date timestamp
    const [startTime, setStartTime] = React.useState(new Date())
    const [minutes, setMinutes] = React.useState(0)
    const [seconds, setSeconds] = React.useState(0)
    //store bestTime in local storage
    const [bestTime, setBestTime] = React.useState(
        JSON.parse(localStorage.getItem('bestTime')) || 'new'
    )
    const [newRecord, setNewRecord] = React.useState(false)
    const [time, setTime] = React.useState(0)
    const [timerOn, setTimerOn] = React.useState(false)

    React.useEffect(() => {
      let interval = null;

      if(timerOn) {
        interval = setInterval(() => {
          setTime(prevTime => prevTime + 10)
        }, 10)
      } else {
        clearInterval(interval)
      }

      return () => clearInterval(interval)
    },[timerOn])  


    //game completion effect to update tenzies state to true
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].face.value
        const allSameValue = dice.every(die => die.face.value === firstValue)
        
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    //effect to update minutes and seconds when game is completed
    React.useEffect(() => {
        if (tenzies) {
            const spendedTime = new Date() - startTime
            setMinutes(Math.floor(spendedTime / 60000))
            setSeconds(Math.floor((spendedTime % 60000) / 1000))
        }
    },[tenzies, startTime])
    
    
    React.useEffect(() => {
        if (tenzies) {
            const bestSeconds = bestTime.min * 60 + bestTime.sec;
            const newSeconds = minutes * 60 + seconds;
            if (newSeconds < bestSeconds || bestTime === 'new') {
                localStorage.setItem('bestTime',
                JSON.stringify({min: minutes, sec: seconds}))
                setBestTime({min: minutes, sec: seconds})
                setNewRecord(true)
            }
         }
    },[minutes, seconds, bestTime, tenzies])

    function generateNewDie() {
        return {
            face: showRandomFace(),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(rolls === 0) {
            setStartTime(new Date())
        }
        if(!tenzies) {
            setRolls(prevRolls => prevRolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setTimerOn(true)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setNewRecord(false)
        }
        
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            face={die.face.face()} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
            value={die.face.value}
        />
    ))
    
    let timerMinutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    let timerMiliseconds = ("0" + ((time / 10) % 100)).slice(-2)
    let timerSeconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2)

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">{
                newRecord ?
                'Congratulations! You have set new record!' :
                'Roll until all dice are the same. Click each die to freeze it at its current value between rolls.'
            }</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <h2>{rolls === 0 ? "Let's Roll!" : `Roll count: ${rolls}`}</h2>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="time">
            {!tenzies && `Timer ${timerMinutes}:${timerSeconds}:${timerMiliseconds}`}
            </div>
            <div className="time">
                
                {tenzies && <span>New time: </span>}
                {tenzies && minutes !== 0 && <span>{`${minutes} min `}</span>}
                {tenzies && seconds !== 0 && <span>{`${seconds} sec`}</span>}
            </div>
            {bestTime !== 'new' && <h2 className='record'>{`Record: ${bestTime.min} min ${bestTime.sec} sec`}</h2>}
        </main>
    )
}
