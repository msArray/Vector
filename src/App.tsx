import { Component, createRef } from "preact";
import { Main } from "./main";

export class App extends Component {
    canv = createRef<HTMLCanvasElement>();

    componentDidMount() {
        Main(this.canv.current!);
    }

    render() {
        return <canvas ref={this.canv} />;
    }
}