// js/title-refresh.js

const titles = [
    "Ingenious Building",
    "Technical Ingenuity",
    "Technical Creativity",
    "Building Solutions",
    "Solutions Building",
    "Technical Solutions",
    "Creative Solutions",
    "Technically Creative",
    "Creatively Technical",
    "Ingenious Solutions",
];

function getRandomTitle() {
    return titles[Math.floor(Math.random() * titles.length)];
}

document.addEventListener("DOMContentLoaded", () => {
    const newTitle = getRandomTitle();
    document.title = newTitle;
});
