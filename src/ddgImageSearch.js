const { createCuimpHttp } = require("cuimp");
const cuimpClient = createCuimpHttp({
    cookieJar: true,
    extraCurlArgs: {
        baseURL: "https://duckduckgo.com/"
    },
});

const DDG_HEADERS = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Referer": "https://duckduckgo.com/",
    "Sec-GPC": "1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Priority": "u=4",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
};

function extractVQD(html) {
    const patterns = [
        /vqd="([^"]+)"/,
        /vqd=([^&]+)/,
        /vqd='([^']+)'/,
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
    }

    throw new Error("Failed to extract vqd");
}

async function getVQD(query) {
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;

    const res = await cuimpClient.request({
        url: url,
        method: "GET",
        headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        },
    });

    return extractVQD(res.data.toString());
}

function buildFilters({
    timelimit,
    size,
    color,
    type,
    layout,
    license,
} = {}) {
    const filters = [];

    if (timelimit) {
        const map = {
            d: "Day",
            w: "Week",
            m: "Month",
            y: "Year",
        };

        filters.push(`time:${map[timelimit]}`);
    }

    if (size) filters.push(`size:${size}`);
    if (color) filters.push(`color:${color}`);
    if (type) filters.push(`type:${type}`);
    if (layout) filters.push(`layout:${layout}`);
    if (license) filters.push(`license:${license}`);

    return filters.join(",");
}

async function searchImages(
    query,
    {
        region = "us-en",
        safesearch = "moderate",
        page = 1,

        timelimit,
        size,
        color,
        type,
        layout,
        license,
    } = {}
) {
    const vqd = await getVQD(query);

    const safeMap = {
        on: "1",
        moderate: "1",
        off: "-1",
    };

    const params = new URLSearchParams({
        o: "json",
        q: query,
        l: region,
        vqd,
        p: safeMap[safesearch],
        ct: "AT",
    });

    const f = buildFilters({
        timelimit,
        size,
        color,
        type,
        layout,
        license,
    });

    if (f) {
        params.set("f", f);
    }

    if (page > 1) {
        params.set("s", String((page - 1) * 100));
    }

    const res = await cuimpClient.request(
        {
            url: `https://duckduckgo.com/i.js?${params}`,
            method: "GET",
            headers: DDG_HEADERS
        }
    );

    if (res.status !== 200) {
        console.log(res);
        throw new Error(`HTTP ${res.status}`);
    }

    const data = JSON.parse(res.data.toString());

    return data.results.map((item) => ({
        title: item.title,
        image: item.image,
        thumbnail: item.thumbnail,
        url: item.url,
        width: item.width,
        height: item.height,
        source: item.source,
    }));
}

module.exports = searchImages;