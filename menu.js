let menuLinkBlock1 = document.getElementById('menu-link-block-1');
let menuLinkBlock2 = document.getElementById('menu-link-block-2');
let menuLinkBlock3 = document.getElementById('menu-link-block-3');
let menuLinkBlock4 = document.getElementById('menu-link-block-4');
let menuWrapper = document.getElementById('menu-clickout-wrapper');
let clickoutItems = [menuLinkBlock1, menuLinkBlock2, menuLinkBlock3, menuLinkBlock4, menuWrapper];
let menuButton = document.getElementById('menu-button');
function clickoutOfMenu(evt) {
    evt.preventDefault();
    menuButton.click();
}
clickoutItems.forEach(item => {
    item.addEventListener('click', clickoutOfMenu);
    item.addEventListener('touchstart', clickoutOfMenu);
});
menuLinkBlock1.addEventListener('click', (evt) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});