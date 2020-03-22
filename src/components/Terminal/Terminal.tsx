import React from "react";
import WST from "ws-telnet-client";
import "./Terminal.css";
import { throws } from "assert";

interface ITerminalSettings {
    uri: string;
    prompt?: string;
}

interface ITerminalState {
    uri: string;
    socket: WST | null;
    buffer: string;
    prompt: string;
    inputEnabled: boolean;
}

class Terminal extends React.Component<ITerminalSettings, ITerminalState> {
    inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    constructor(props: Readonly<ITerminalSettings>) {
        super(props);
        this.state = {
            socket: null,
            uri: this.props.uri,
            buffer: "",
            prompt: this.props.prompt || "> ",
            inputEnabled: false,
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
                    socket.sendGMCP("Core.Hello", { client: "WST React", version: "0.1.0" });
                    this.setPrompt("GMCP> ");
                    break;
            }
        };
        socket.ongmcp = (namespace, data) => {
            switch (namespace) {
                case "Server.Hello":
                    this.printLine(
                        `\nServer.Hello\nServer Node Version: ${data.node_version}\nClient UUID: ${data.client_uuid}\n`,
                    );
                    break;
            }
        };
    }
    print(...data: string[]) {
        const fin = data.join(" ");
        const buffer = this.state.buffer + fin;
        this.setState({ ...this.state, buffer });
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
    onKeyPress(ev: React.KeyboardEvent) {
        if (!this.state.inputEnabled) return;
        if (ev.key === "Enter") {
            // Input submit
            const input = this.inputRef.current;
            if (input !== null) {
                if (input.value.trim().length > 0) {
                    const t = input.value;
                    input.value = "";
                    this.printLine(`${this.state.prompt}${t}`);
                    const state = this.state;
                    if (state.socket !== null) state.socket.send(t);
                }
                ev.preventDefault();
            }
        }
    }
    render() {
        return (
            <div className="Terminal" onClick={this.onClick.bind(this)}>
                {this.state.buffer}
                <div>
                    <span className="Terminal-Prompt">{this.state.prompt}</span>
                    <input
                        ref={this.inputRef}
                        onKeyPress={this.onKeyPress.bind(this)}
                        className="Terminal-Input"
                        type="text"
                        disabled={!this.state.inputEnabled}
                    />
                </div>
            </div>
        );
    }
}

export default Terminal;
