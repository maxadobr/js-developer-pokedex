const toggleTheme = document.getElementById("toggleTheme");
const rootHtml = document.documentElement;
const themeIcons = document.querySelectorAll(".theme-icon");

function updateIcons(theme) {
    themeIcons.forEach(icon => {
        const newSrc = icon.getAttribute(`data-src-${theme}`);
        if (newSrc) {
            icon.setAttribute('src', newSrc);
        }
    });
}

function changeTheme() {
    const currentTheme = rootHtml.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    rootHtml.setAttribute("data-theme", newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcons(newTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        rootHtml.setAttribute('data-theme', savedTheme);
    }

    const currentTheme = rootHtml.getAttribute("data-theme");
    updateIcons(currentTheme);
}

toggleTheme.addEventListener("click", changeTheme);

initializeTheme();