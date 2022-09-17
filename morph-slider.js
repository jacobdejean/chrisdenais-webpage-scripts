const testimonialUrl = 'https://uploads-ssl.webflow.com/62b632a343e2852836af0565/62d4f6ac727756947b8f3c98_testimonials.txt';
let testimonials = {};
let currentSlideIndex = 0;
let nextQuote = document.getElementById('next-quote');
let nextAuthor = document.getElementById('next-author');
let testimonialContainer = document.getElementById('testimonial-container');
let mobileDetector = document.getElementById('mobile-detector');
let sliderSection = document.getElementById('slider-section');
let threshholdMatrix = document.getElementById('threshholdMatrix');
let gaussianBlur = document.getElementById('gaussianBlur');
let controlIndicatorDiv = document.getElementById('control-indicator-div');
let maxBlur = 7;
let blurIndex = 1;
let blurIntensity = 0;
let blurDirection = 0.02;
let transitionDone = false;
let swappedStates = false;
let blurIncreasing = true;
let onMobile = false;
let autoslideCooldown = 5000;
let autoslideTimeoutID = 0;
fetch(testimonialUrl).then((res) => {
    res.json().then((json) => {
        testimonials = json.testimonials;
        onLoad();
    });
});
function onLoad() {
    currentSlideIndex = testimonials.length - 1;
    nextQuote.innerText = testimonials[currentSlideIndex].quote;
    nextAuthor.innerText = testimonials[currentSlideIndex].author;
    for (let i = 0; i < testimonials.length; i++) {
        let indicator = document.createElement('div');
        indicator.className = 'control-indicator' + ((i == testimonials.length - 1) ? ' last-indicator' : '');
        indicator.id = 'indicator-' + i;
        controlIndicatorDiv.appendChild(indicator);
    }
    onMobile = $('#mobile-detector').css('display') === 'none';
    setActiveIndicatorColor('white');
    tryAutoslide();
    startAnimation();
}
function goNext(fromAutoslide) {
    setActiveIndicatorColor('#3A3645');
    if (currentSlideIndex >= testimonials.length - 1)
        currentSlideIndex = 0;
    else
        currentSlideIndex++;
    setActiveIndicatorColor('white');
    if (fromAutoslide) {
        tryAutoslide(1);
    } else {
        cancelAutoslide();
    }
    startAnimation();
}
function goPrevious() {
    setActiveIndicatorColor('#3A3645');
    if (currentSlideIndex <= 0)
        currentSlideIndex = testimonials.length - 1;
    else
        currentSlideIndex--;
    setActiveIndicatorColor('white');
    cancelAutoslide();
    startAnimation();
}
function startAnimation() {
    transitionDone = false;
    blurIntesity = 0;
    blurDirection = 0.02;
    swappedStates = false;
    if (!onMobile)
        testimonialContainer.classList.add('desktop-filter');
    animate();
}
function animate() {
    if (!transitionDone) {
        requestAnimationFrame(animate);
        //gaussianBlur.setAttribute('stdDeviation', "" + easeInOutQuad(blurIntensity / maxBlur) * maxBlur);
        //gaussianBlur.setAttribute('stdDeviation', "" + easeInOutQuad(0.7 / maxBlur) * maxBlur);
        blurIndex += 2;
        //blurIntensity = easeInQuart(Math.sin(blurIndex) / 100);
        blurIntensity = easeInQuart(Math.sin(blurIndex / 50));
        if (!swappedStates && blurIntensity >= 0.99) {
            swapState();
        }
        if (swappedStates && blurIntensity <= 0.016) {
            stopTransition();
            blurIndex = 1;
        }
        if (!onMobile)
            gaussianBlur.setAttribute('stdDeviation', "" + (blurIntensity * maxBlur));
        else
            testimonialContainer.style.opacity = ((-blurIntensity + 1) * 100) + '%';
    }
}
function swapState() {
    swappedStates = true;
    nextQuote.innerText = testimonials[currentSlideIndex].quote;
    nextAuthor.innerText = testimonials[currentSlideIndex].author;
}
function tryAutoslide(multiplier) {
    autoslideTimeoutID = setTimeout(() => { goNext(true); }, autoslideCooldown * multiplier);
}
function cancelAutoslide() {
    if (autoslideTimeoutID != -1) {
        clearTimeout(autoslideTimeoutID);
    }
    tryAutoslide(2);
}
function stopTransition() {
    transitionDone = true;
    if (!onMobile)
        testimonialContainer.classList.remove('desktop-filter');
}
function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
function easeInQuart(x) {
    return x * x * x * x;
}
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function setActiveIndicatorColor(color) {
    document.getElementById('indicator-' + currentSlideIndex).style.backgroundColor = color;
}