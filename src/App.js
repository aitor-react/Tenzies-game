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
    //const [startTime, setStartTime] = React.useState(new Date())
    const [seconds, setSeconds] = React.useState(0)
    const [timerOn, setTimerOn] = React.useState(false)
    const [intervalId, setIntervalId] = React.useState(null)
    //store bestTime in local storage
    const [bestTime, setBestTime] = React.useState(
        JSON.parse(localStorage.getItem('bestTime')) || 'new'
    )
    //const [newRecord, setNewRecord] = React.useState(false)
    //const [time, setTime] = React.useState(0)

    const increment = ()=>setSeconds(prevSeconds=>prevSeconds+1)  

    React.useEffect(() => {
      let interval = () =>setInterval(increment,1000);

      if(timerOn) {
        let answer = interval()
        setIntervalId(answer)
      } else if (!timerOn) {
        clearInterval(intervalId)
        setIntervalId(null)
      }

      //return () => clearInterval(interval)
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
    
    //effect to update timer, set best time and store when game is completed
    React.useEffect(() => {
        if (tenzies) {
            setTimerOn(false)
            if(!bestTime && tenzies) {
            setBestTime(seconds)
            localStorage.setItem('bestTime',seconds)
            }
            else if (bestTime && seconds < bestTime){
              setBestTime(seconds)
              localStorage.setItem('bestTime',seconds)
            }
        }
    },[tenzies])
    
    //not needed
    /* React.useEffect(() => {
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
    },[minutes, seconds, bestTime, tenzies]) */

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
    
    /* function rollDice() {
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
        
    } */

    //updated rollDice func
    function rollDice() {
      if(!tenzies) {
          if(!timerOn){
              setTimerOn(true)
              }
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
          setRolls(prevRolls => prevRolls+1)
      } 
      else if (tenzies) {
          setTenzies(false)
          setDice(allNewDice())
          setRolls(0)
          setSeconds(0)
      }
  }
    
    function holdDice(id) {
      //timer state
      if (!tenzies){
        if(!timerOn){
            setTimerOn(true)
            }
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
      }  
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
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at its current value between rolls
            </p>
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
            Timer: {seconds} seconds
            </div>
            <div className="time">
                
                {tenzies && <span>New time: </span>}
                {tenzies && seconds !== 0 && <span>{`${seconds} sec`}</span>}
            </div>
            {bestTime !== 'new' && <h2 className='record'>{`Record: ${seconds} sec`}</h2>}
        </main>
    )
}
