import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Graphics, Stage} from './pixiFiber'
import * as PIXI from 'pixi.js'
import {generate} from './model/serieGenerator'


class TestLine extends React.Component<any, any> {

    redraw = () => {

        const data = generate(100000, 300, 1000)
        let i = 0
        const l = data.length
        const line = this.graphics
        console.time('render')
        line.clear()
        line.lineStyle(1, 0x000000, 1)
        line.moveTo(0, 0)
        for (i; i < l; i++) {
            line.lineTo(data[i].x, data[i].y)
        }
        console.timeEnd('render')
    }
    graphics: PIXI.Graphics

    componentDidMount() {
        setInterval(this.redraw, 20)
    }

    render() {
        return <Graphics ref={ref => {

            this.graphics = ref
        }}/>
    }
}

// Setup PIXI.js Application

export default () => {
    /*const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight})
    app.renderer.view.style.position = 'absolute'
    app.renderer.view.style.display = 'block'
    app.renderer.backgroundColor = 0xffffff
    app.renderer.autoResize = true
    document.body.appendChild(app.view)*/

    ReactDOM.render(
        <div>
            hi
            <Stage width={800} height={600} backgroundColor={0x1099bb}>
                <TestLine/>
            </Stage>
        </div>,
        document.getElementById('app')
    )
}