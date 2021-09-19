

export async function fetchDocs() {
    const docsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpoXKebiY2RHl1HpQdHOIvd6gqsKXKLKqE7S-sVkP79nqsyx_ODXx6f9Uilf9WFBOGHSiV6oTBQnQr/pub?gid=0&single=true&output=csv";
    const csv = await fetch(docsUrl).then(res => res.text());
    const lines = csv.split("\r\n");
    const first = lines[0].split(",");
    const objs = [];

    const data = lines.slice(1).map(l => l.split(/(?!\B"[^"]*),(?![^"]*"\B)/gm));
    data.forEach(line => {
        const obj = {};
        line.forEach((el, i) => obj[first[i]] = el);
        objs.push(obj);
    })
    return objs;
}


export function getCoords(url: string) {
    const regex = /(?<lat>[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),(?<long>\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))/g;
    const { groups: { lat, long } } = regex.exec(url);
    return { lat: parseFloat(lat), long: parseFloat(long) }
}