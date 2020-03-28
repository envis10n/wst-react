import React from "react";

export const ColorMap: { [key: string]: { color: string } | { color: string; fontWeight: string } } = {
           "[31m": { color: "red" },
           "[30m": { color: "black" },
           "[32m": { color: "lime" },
           "[33m": { color: "yellow" },
           "[34m": { color: "blue" },
           "[35m": { color: "magenta" },
           "[36m": { color: "cyan" },
           "[37m": { color: "white" },
           "[31;1m": { color: "red", fontWeight: "bold" },
           "[30;1m": { color: "black", fontWeight: "bold" },
           "[32;1m": { color: "lime", fontWeight: "bold" },
           "[33;1m": { color: "yellow", fontWeight: "bold" },
           "[34;1m": { color: "blue", fontWeight: "bold" },
           "[35;1m": { color: "magenta", fontWeight: "bold" },
           "[36;1m": { color: "cyan", fontWeight: "bold" },
           "[37;1m": { color: "white", fontWeight: "bold" },
           "[0m": { color: "inherit" },
       };
export function parseANSI(data: string, len: number): React.ReactElement[] {
    let te: React.ReactElement[] = [];
    let l = len;
    if (data.includes("\u001b")) {
        const blocks = data.split("\u001b");
        blocks.forEach((b) => {
            const offset = b.indexOf("m", 0);
            if (offset !== -1) {
                const code = b.substring(0, offset + 1);
                const temp = b.substring(offset + 1);
                if (ColorMap[code] !== undefined) {
                    const color = ColorMap[code];
                    te.push(React.createElement("span", { key: l, style: color }, temp));
                } else {
                    te.push(React.createElement("span", { key: l, style: ColorMap["[0m"] }, temp));
                }
            } else {
                te.push(React.createElement("span", { key: l, style: ColorMap["[0m"] }, b));
            }
            l++;
        });
    } else {
        te.push(React.createElement("span", { key: l, style: ColorMap["[0m"] }, data));
    }
    return te;
}