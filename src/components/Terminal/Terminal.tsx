import React from "react";
import WST from "ws-telnet-client";
import "./Terminal.css";
import * as ANSI from "./ANSI";

interface ITerminalSettings {
    uri: string;
    prompt?: string;
}

interface ITerminalState {
    uri: string;
    socket: WST | null;
    prompt: string;
    inputEnabled: boolean;
    multiline: string[];
    output: React.ReactElement[];
}

class Terminal extends React.Component<ITerminalSettings, ITerminalState> {
    inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    termRef: React.RefObject<HTMLDivElement> = React.createRef();
    endRef: React.RefObject<HTMLSpanElement> = React.createRef();
    constructor(props: Readonly<ITerminalSettings>) {
        super(props);
        this.state = {
            socket: null,
            uri: this.props.uri,
            prompt: this.props.prompt || "> ",
            inputEnabled: false,
            multiline: [],
            output: [],
        };
    }
    enableInput() {
        this.setState({ ...this.state, inputEnabled: true });
    }
    disableInput() {
        this.setState({ ...this.state, inputEnabled: false });
    }
    componentDidMount() {
        const socket = new WST(this.props.uri);
        this.setState({ ...this.state, socket });
        socket.onopen = () => {
            this.printLine("Connection established.");
            this.enableInput();
            this.inputRef.current?.focus();
        };
        socket.onclose = (ev) => {
            this.printLine("Disconnected.");
            this.disableInput();
        };
        socket.onmessage = (data) => {
            this.printLine(data);
        };
        socket.onwill = (option) => {
            switch (option) {
                case WST.TelnetOption.GMCP:
                    socket.do(option);
                    socket.sendGMCP("Core.Hello", { client: "WST React", version: React.version });
                    break;
                case WST.TelnetOption.SUPPRESS_GO_AHEAD:
                    socket.do(option);
                    break;
                default:
                    socket.dont(option);
                    break;
            }
        };
        socket.ongmcp = (namespace, data) => {
            switch (namespace) {
            }
        };
    }
    setScrollBottom() {
        this.endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    print(...data: string[]) {
        const fin = data.join(" ");
        this.setState(
            {
                ...this.state,
                output: [...this.state.output, ...ANSI.parseANSI(fin)],
            },
            () => {
                this.setScrollBottom();
            },
        );
    }
    printLine(...data: string[]) {
        data.push("\n");
        this.print(...data);
    }
    setPrompt(prompt: string) {
        const state = this.state;
        this.setState({ ...state, prompt });
    }
    onClick(ev: React.MouseEvent) {
        if (this.state.inputEnabled) this.inputRef.current?.focus();
    }
    onKeyPress(ev: React.KeyboardEvent<HTMLInputElement>) {
        if (!this.state.inputEnabled) return;
        const input = this.inputRef.current;
        switch (ev.key) {
            case "Enter":
                if (ev.shiftKey) {
                    // Multiline
                    if (input !== null) {
                        const t = input.value;
                        this.state.multiline.push(t);
                        input.value = "";
                        input.placeholder = "";
                        this.printLine(t + " ...");
                        ev.preventDefault();
                    }
                } else {
                    // Input submit
                    if (input !== null) {
                        let t = input.value;
                        let multi: boolean = false;
                        if (this.state.multiline.length > 0) {
                            multi = true;
                            this.state.multiline.push(input.value);
                            t = this.state.multiline.join("\n");
                        }
                        if (t === "" && input.placeholder.length > 0) t = input.placeholder;
                        input.value = "";
                        input.placeholder = multi ? "" : t;
                        this.setState({ ...this.state, multiline: [] as string[] }, () => {
                            this.printLine((multi ? "\n[Multiline Input]\n" : "") + t);
                            const state = this.state;
                            if (state.socket !== null) state.socket.send(t);
                        });
                        ev.preventDefault();
                    }
                }
                break;
            case "Tab":
                if (input !== null) {
                    input.value += "    ";
                    ev.preventDefault();
                }
                break;
        }
    }
    render() {
        return (
            <div ref={this.termRef} className="Terminal" onClick={this.onClick.bind(this)}>
                <div className="Terminal-Output">
                    {this.state.output.map((el, i) => el)}
                    <span ref={this.endRef} />
                </div>
                <input
                    ref={this.inputRef}
                    onKeyDown={this.onKeyPress.bind(this)}
                    className="Terminal-Input"
                    type="text"
                    disabled={!this.state.inputEnabled}
                />
            </div>
        );
    }
}

export default Terminal;
