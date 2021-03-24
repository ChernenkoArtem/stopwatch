import {interval, fromEvent} from "rxjs";
import { debounceTime, map, buffer, filter} from "rxjs/operators";

const btnStart = document.getElementById('start')
const btnReset = document.getElementById('reset')
const btnWait = document.getElementById('wait')
const display = document.getElementById('display')

let timesInterval = null
let isWait = true
const formatTime = {
    sec: 0,
    min: 0,
    hour:0
}


const start$ = fromEvent(btnStart, 'click')
const reset$ = fromEvent(btnReset, 'click')
const wait$ = fromEvent(btnWait, 'click')


start$.subscribe(data => {
    toggleStartReset()
    isWait = false
})

wait$.pipe(
    buffer(
        wait$.pipe(debounceTime(300))
    ),
    map(list => {
        return list.length;
    }),
    filter(x => x === 2),
).subscribe(()=>{
  wait()
})

reset$.subscribe(data => {
    reset(start)
})

function timer(formatTime){
    formatTime.sec++
    if (formatTime.sec > 60){
        formatTime.min++
        formatTime.sec = 0
    }
    if (formatTime.min === 60){
        formatTime.hour++
        formatTime.min = 0
        formatTime.sec = 0
    }
    toDisplay()
}

function wait(){
    clearInterval(timesInterval)
    isWait = true
}

function start(){
    timesInterval = setInterval(timer,1000,formatTime)
    isWait = false
}
function reset(cb = null){
    clearInterval(timesInterval)
    formatTime.sec = 0
    formatTime.min = 0
    formatTime.hour = 0
    isWait = false
    if(cb){
        cb()
    }
}
function toggleStartReset(){
    if (isWait === true){
        start()
    }else {
        reset(start)
    }
}
function toDisplay(){
    display.value = `${formatTime.hour < 10 ? '0' + formatTime.hour : formatTime.hour}
        :${formatTime.min < 10 ? '0'+ formatTime.min : formatTime.min}
        :${formatTime.sec < 10 ? '0'+ formatTime.sec : formatTime.sec}`
}





