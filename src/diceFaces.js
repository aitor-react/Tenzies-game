import React from 'react'

function showFirstFace() {
    return (
        <div className='die-face'>
    
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span></span>
                <span></span>
        </div>
    )
}

function showSecondFace() {
    return (
        <div className='die-face'>
                <span></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span></span>
        </div>
    )
}

function showThirdFace() {
    return (
        <div className='die-face'>
                <span></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span></span>
        </div>
    )
}

function showFourthFace() {
    return (
        <div className='die-face'>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
        </div>
    )
}

function showFifthFace() {
    return (
        <div className='die-face'>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
        </div>
    )
}

function showSixthFace() {
    return (
        <div className='die-face'>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <span></span>
                <span className='dot'></span>
        </div>
    )
}

const facesArr = [
        {face: showFirstFace, value: 1},
        {face: showSecondFace, value:2},
        {face: showThirdFace, value: 3},
        {face: showFourthFace, value: 4},
        {face: showFifthFace, value: 5},
        {face: showSixthFace, value: 6}
     ]

export default function showRandomFace() {
    return facesArr[Math.floor(Math.random() * facesArr.length)]
}