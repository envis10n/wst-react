import React from "react";

interface IStyle {
    color?: string;
    backgroundColor?: string;
    fontWeight?: string;
}

let cCount = 1;

export const ColorMap: { [key: string]: IStyle } = {
    "[31m": { color: "red", backgroundColor: "inherit" },
    "[30m": { color: "black", backgroundColor: "inherit" },
    "[32m": { color: "lime", backgroundColor: "inherit" },
    "[33m": { color: "yellow", backgroundColor: "inherit" },
    "[34m": { color: "blue", backgroundColor: "inherit" },
    "[35m": { color: "magenta", backgroundColor: "inherit" },
    "[36m": { color: "cyan", backgroundColor: "inherit" },
    "[37m": { color: "white", backgroundColor: "inherit" },
    "[31;1m": { color: "red", backgroundColor: "inherit", fontWeight: "bold" },
    "[30;1m": { color: "gray", backgroundColor: "inherit", fontWeight: "bold" },
    "[32;1m": { color: "lime", backgroundColor: "inherit", fontWeight: "bold" },
    "[33;1m": { color: "yellow", backgroundColor: "inherit", fontWeight: "bold" },
    "[34;1m": { color: "blue", backgroundColor: "inherit", fontWeight: "bold" },
    "[35;1m": { color: "magenta", backgroundColor: "inherit", fontWeight: "bold" },
    "[36;1m": { color: "cyan", backgroundColor: "inherit", fontWeight: "bold" },
    "[37;1m": { color: "white", backgroundColor: "inherit", fontWeight: "bold" },
    "[41m": { backgroundColor: "red", color: "inherit" },
    "[40m": { backgroundColor: "black", color: "inherit" },
    "[42m": { backgroundColor: "lime", color: "inherit" },
    "[43m": { backgroundColor: "yellow", color: "inherit" },
    "[44m": { backgroundColor: "blue", color: "inherit" },
    "[45m": { backgroundColor: "magenta", color: "inherit" },
    "[46m": { backgroundColor: "cyan", color: "inherit" },
    "[47m": { backgroundColor: "white", color: "inherit" },
    "[41;1m": { backgroundColor: "red", color: "inherit", fontWeight: "bold" },
    "[40;1m": { backgroundColor: "gray", color: "inherit", fontWeight: "bold" },
    "[42;1m": { backgroundColor: "lime", color: "inherit", fontWeight: "bold" },
    "[43;1m": { backgroundColor: "yellow", color: "inherit", fontWeight: "bold" },
    "[44;1m": { backgroundColor: "blue", color: "inherit", fontWeight: "bold" },
    "[45;1m": { backgroundColor: "magenta", color: "inherit", fontWeight: "bold" },
    "[46;1m": { backgroundColor: "cyan", color: "inherit", fontWeight: "bold" },
    "[47;1m": { backgroundColor: "white", color: "inherit", fontWeight: "bold" },
    "[49m": { backgroundColor: "inherit", color: "inherit" },
    "[0m": { backgroundColor: "inherit", color: "inherit" },
};
export function parseANSI(data: string): React.ReactElement[] {
    let te: React.ReactElement[] = [];
    let lastEl: React.ReactElement | undefined = undefined;
    if (data.includes("\u001b")) {
        const blocks = data.split("\u001b");
        blocks.forEach((b) => {
            const offset = b.indexOf("m", 0);
            if (offset !== -1) {
                const code = b.substring(0, offset + 1);
                const temp = b.substring(offset + 1);
                if (ColorMap[code] !== undefined) {
                    const color = ColorMap[code];
                    if (code !== "[0m") {
                        const lel = lastEl || te[te.length - 1];
                        const el: React.ReactElement = React.createElement("span", { key: cCount, style: color }, [
                            temp,
                        ]);
                        cCount++;
                        lel.props.children.push(el);
                        console.log(lel);
                        lastEl = el;
                    } else {
                        te.push(React.createElement("span", { key: cCount, style: color }, [temp]));
                        lastEl = te[te.length - 1];
                        cCount++;
                    }
                } else {
                    te.push(React.createElement("span", { key: cCount, style: ColorMap["[0m"] }, [b]));
                    lastEl = te[te.length - 1];
                    cCount++;
                }
            } else {
                te.push(React.createElement("span", { key: cCount, style: ColorMap["[0m"] }, [b]));
                cCount++;
            }
        });
    } else {
        te.push(React.createElement("span", { key: cCount, style: ColorMap["[0m"] }, [data]));
        cCount++;
    }
    return te;
}
