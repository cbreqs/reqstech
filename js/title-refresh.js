document.addEventListener("DOMContentLoaded", () => {
    const refreshButton = document.getElementById('refreshTitle');
    if (!refreshButton) return;

    const titles = [
        "Ingenious Building",
        "Technically Creative",
        "Creatively Technical",
        "Precision Building",
        "Building Solutions",
        "Designed Precision",
        "Innovative Ingenuity",
    ];

    function getRandomTitle() {
        return titles[Math.floor(Math.random() * titles.length)];
    }

    refreshButton.addEventListener('click', () => {
        const newTitle = getRandomTitle();
        document.title = newTitle;
        localStorage.setItem('randomTitle', newTitle);
    });
});

