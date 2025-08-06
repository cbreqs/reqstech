// js/title-refresh.js

const titles = [
    "reqs.tech | Ingenious Building",
    "reqs.tech | Technical Ingenuity",
    "reqs.tech | Technical Creativity",
    "reqs.tech | Building Solutions",
    "reqs.tech | Solutions Building",
    "reqs.tech | Technical Solutions",
    "reqs.tech | Creative Solutions",
    "reqs.tech | Technically Creative",
    "reqs.tech | Creatively Technical",
    "reqs.tech | Ingenious Solutions",
];

function getRandomTitle() {
    return titles[Math.floor(Math.random() * titles.length)];
}

document.addEventListener("DOMContentLoaded", () => {
    const newTitle = getRandomTitle();
    document.title = newTitle;
});
