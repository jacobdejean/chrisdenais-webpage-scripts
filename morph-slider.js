const states = {
    current_text: document.getElementById("current_text"),
    next_text: document.getElementById("next_text")
};

let controlIndicatorDiv = document.getElementById('control-indicator-div');
let currentSlideAuthorElement = document.getElementById('testimonial-author');
let filters = document.getElementById('filters');
let testimonialArea = document.getElementById('testimonial-area');

const testimonials = [
            ['"Chris\' quality of work and commitment to the Figma design deliverables, the project timeline, and the satisfaction of the end users was top notch. He\'s a talented and highly capable designer."', "Mason Shewman\nFounder, Anvil Digital"],
            ['"Suspendisse quis accumsan ex, sed convallis nulla. Donec placerat nisl vitae justo volutpat finibus vitae ut lectus. Nullam ornare, metus et."', "Mason Shewman\nFounder, Anvil Digital"],
            ['"Vivamus quis aliquet turpis. Curabitur et vestibulum massa. Ut consequat mauris non eros finibus, viverra sagittis nisl auctor. Sed quis felis."', "Mason Shewman\nFounder, Anvil Digital"],
            ['"Mauris sed neque tellus. Phasellus tristique eget erat sed dignissim. Cras ut ligula aliquet mauris faucibus tristique. Proin commodo aliquet ipsum."', "Mason Shewman\nFounder, Anvil Digital"],
            ['"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vestibulum ullamcorper leo sed tristique. Suspendisse molestie erat in venenatis maximus. Proin."', "Mason Shewman\nFounder, Anvil Digital"]
];

const morphTime = 2;

let currentSlideIndex = 0;
let time = new Date();
let morph = 0;
let pause = false;

states.current_text.textContent = testimonials[currentSlideIndex % testimonials.length][0];
states.next_text.textContent = testimonials[currentSlideIndex % testimonials.length][0];
currentSlideAuthorElement.innerText = testimonials[currentSlideIndex % testimonials.length][1];

function doMorph() {
    morph += 0.02;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        //cooldown = cooldownTime;
        fraction = 1;
        currentSlideAuthorElement.style.transform = "translate(0rem)";
        currentSlideAuthorElement.style.opacity = '100%';
        testimonialArea.classList.remove('is-morphing');
    }

    setMorph(fraction);
}

function setMorph(fraction) {
    states.next_text.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    states.next_text.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    states.current_text.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    states.current_text.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
}

function animate() {
    requestAnimationFrame(animate);

    let newTime = new Date();
    let dt = (newTime - time) / 1000;
    time = newTime;

    if(morph < morphTime)
        doMorph();
}

function goNext() {
    setActiveIndicatorColor('#3A3645');

    states.current_text.textContent = testimonials[currentSlideIndex % testimonials.length][0];
    states.next_text.textContent = testimonials[(currentSlideIndex + 1) % testimonials.length][0];

    if (currentSlideIndex >= testimonials.length - 1)
        currentSlideIndex = 0;
    else
        currentSlideIndex++;

    
    setActiveIndicatorColor('white');
    skipMorph();
}

function goPrevious() {
    setActiveIndicatorColor('#3A3645');

    states.current_text.textContent = testimonials[currentSlideIndex % testimonials.length][0];
    states.next_text.textContent = testimonials[currentSlideIndex == 0 ? testimonials.length - 1 : (currentSlideIndex - 1) % testimonials.length][0];

    if (currentSlideIndex <= 0)
        currentSlideIndex = testimonials.length - 1;
    else
        currentSlideIndex--;

    setActiveIndicatorColor('white');
    skipMorph();
}

function skipMorph() {
    pause = false;
    morph = 0;

    filters.style.display = 'block';

    states.next_text.style.filter = "";
    states.next_text.style.opacity = "100%";

    states.current_text.style.filter = "";
    states.current_text.style.opacity = "0%";

    currentSlideAuthorElement.innerText = testimonials[currentSlideIndex % testimonials.length][1];
    currentSlideAuthorElement.style.transform = "translate(-20rem)";
    currentSlideAuthorElement.style.opacity = '0%';
    testimonialArea.classList.remove('is-morphing');
    testimonialArea.classList.add('is-morphing');
}


function setActiveIndicatorColor(color) {
    document.getElementById('indicator-' + currentSlideIndex).style.backgroundColor = color;
}

for (let i = 0; i < testimonials.length; i++) {
    let indicator = document.createElement('div');

    indicator.className = 'control-indicator';
    indicator.id = 'indicator-' + i;
    controlIndicatorDiv.appendChild(indicator);
}

animate();