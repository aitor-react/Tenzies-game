import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import showRandomFace from './diceFaces'

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [finished, setFinished] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [minutes, setMinutes] = React.useState(0)
    const [seconds, setSeconds] = React.useState(0)
    const [bestTime, setBestTime] = React.useState(
        JSON.parse(localStorage.getItem('bestTime')) || 'new'
    )
    const [startTime, setStartTime] = React.useState(new Date())
    const [newRecord, setNewRecord] = React.useState(false)


    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].face.value
        const allSameValue = dice.every(die => die.face.value === firstValue)
        
        if (allHeld && allSameValue) {
            setFinished(true)
        }
    }, [dice])
    
    React.useEffect(() => {
      if (finished) {
          const spendedTime = new Date() - startTime
          setMinutes(Math.floor(spendedTime / 60000))
          setSeconds(Math.floor((spendedTime % 60000) / 1000))
      }
  },[finished])

    
    //not needed
    /* React.useEffect(() => {
        if (finished) {
            const bestSeconds = bestTime.min * 60 + bestTime.sec;
            const newSeconds = minutes * 60 + seconds;
            if (newSeconds < bestSeconds || bestTime === 'new') {
                localStorage.setItem('bestTime',
                JSON.stringify({min: minutes, sec: seconds}))
                setBestTime({min: minutes, sec: seconds})
                setNewRecord(true)
            }
         }
    },[minutes, seconds, bestTime, finished]) */


    React.useEffect(() => {
      if (finished) {
          const bestSeconds = bestTime.min * 60 + bestTime.sec;
          const newSeconds = minutes * 60 + seconds;
          if (newSeconds < bestSeconds /* && bestTime === 'new' */) {
              setBestTime({min: minutes, sec: seconds})
              setNewRecord(true)
          } else if (newSeconds > bestSeconds /* || bestTime === 'bestTime' */) {
              setNewRecord(false)
          }
      }
  },[minutes, seconds])

/*   React.useEffect(() => {
    if (finished) {
        const bestSeconds = bestTime.min * 60 + bestTime.sec;
        const newSeconds = minutes * 60 + seconds;
        if (newSeconds < bestSeconds || bestTime === 'new') {
            localStorage.setItem('bestTime',
            JSON.stringify({min: minutes, sec: seconds})).setBestTime({min: minutes, sec: seconds})
            setNewRecord(true)
            
        }
     }
},[minutes, seconds])
 */
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
        if(!finished) {
            setRolls(prevRolls => prevRolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setTimerOn(true)
        } else {
            setFinished(false)
            setDice(allNewDice())
            setRolls(0)
            setNewRecord(false)
        }
        
    } */

    //updated rollDice func
    function rollDice() {
      if(rolls === 0) {
          setStartTime(new Date())
      }
      if(!finished) {
          setRolls(prevRolls => prevRolls + 1)
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
      } else {
          setFinished(false)
          setDice(allNewDice())
          setRolls(0)
          setNewRecord(false)
          setMinutes(0)
          setSeconds(0)
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
    
console.log({finished, minutes, seconds, bestTime,newRecord})

    return (
        <main>
            {finished && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">{
                newRecord ?
                'Congratulations! You have set new record!' :
                'Roll until all dice are the same. Click each die to freeze it at its current value between rolls.'
            }
            </p>
            <div className="dice-container">
                {diceElements}
            </div>
            <h2>{rolls === 0 ? "Let's Roll!" : `Roll count: ${rolls}`}</h2>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {finished ? "New Game" : "Roll"}
            </button>
            <div className="time">
                {finished && <span>Your time: </span>}
                {finished && minutes !== 0 && <span>{`${minutes} m `}</span>}
                {finished && seconds !== 0 && <span>{`${seconds} s`}</span>}
            </div>
            {/* in record I had besTime.min and bestTime.sec before */}
            {bestTime !== 'new' && <h2 className='record'>{`Record: ${minutes} m 
            ${seconds} s`}</h2>}
        </main>
    )
}
