import {generate} from './model/serieGenerator'
import * as PIXI from 'pixi.js'
import {Graphics} from 'pixi.js'
/*
const c: HTMLCanvasElement = document.getElementById("myCanvas") as any as HTMLCanvasElement;
const ctx = c.getContext("2d");

const redraw = () => {
    const data = generate(100000, 300, 1000)
    let i = 0
    const l = data.length
    console.time('render')
    ctx.clearRect(0, 0, 300, 1000)
    ctx.moveTo(0, 0);
    ctx.beginPath()
    for (i; i < l; i++) {
        ctx.lineTo(data[i].x, data[i].y)
    }
    ctx.stroke();
    ctx.closePath()
    console.timeEnd('render')
}*/


const redraw = () => {
    const data = generate(100000, 300, 1000)
    let i = 0
    const l = data.length
    console.time('render')
    line.clear()
    line.lineStyle(1, 0x000000, 1)
    line.moveTo(0, 0)
    for (i; i < l; i++) {
        line.lineTo(data[i].x, data[i].y)
    }
    console.timeEnd('render')
}

document.body.addEventListener('click', redraw, false)

const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight})
app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.backgroundColor = 0xffffff
app.renderer.autoResize = true
document.body.appendChild(app.view)


const line = new Graphics()


app.stage.addChild(line);
