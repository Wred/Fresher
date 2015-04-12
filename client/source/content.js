

module.exports = function (DOM) {
    DOM.className = "content";

    function showContent(str) {
        DOM.innerHTML = str;
    }

    return {
        showContent:showContent
    }
};