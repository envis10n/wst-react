import React from "react";
import "./App.css";
import Terminal from "./components/Terminal/Terminal";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/">
                        Example paths
                        <br />
                        Insecure: <code>/ws/localhost:80</code>
                        <br />
                        Secure: <code>/wss/localhost:443</code>
                    </Route>
                    <Route path="/ws/:host">
                        <RouInsecure />
                    </Route>
                    <Route path="/wss/:host">
                        <RouSecure />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function RouInsecure() {
    let { host } = useParams();
    return <Terminal uri={`ws://${host}`} />;
}
function RouSecure() {
    let { host } = useParams();
    return <Terminal uri={`wss://${host}`} />;
}

export default App;
