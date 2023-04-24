
class Countdown extends HTMLElement {
    static countdownTemplate;

    static createTemplate() {
        const countdownTemplate = document.createElement("template");
        countdownTemplate.innerHTML = `
            <style>
				.circular-timer {
				    display: flex;
                    justify-content: center;
                    align-items: center;
					overflow: hidden;
					position: relative;
                    padding-bottom: 10px;
					margin-top: 10px;				
				}
                svg {
					margin: 10px 0;
					border-radius: 50%;
				}
				.gauge-indicator {
					transform-origin: 50% 50%;
					transform: rotate(90deg) scale(-1,1);
				}
				.value-percentage-container {
				    font-family: Arial, sans-serif;
					font-size: 140%;
				}
				.value-percentage {
					font-size: 100%;
				}
            </style>
            <div class="circular-timer" >
                <svg viewbox="0 0 35 35" width="100" height="100">
                    <circle class="gauge-indicator" cx="50%" cy="50%" r="15.91549431"
                        stroke="#00acc1" stroke-width="2"
                        stroke-dasharray="25,100"
                        stroke-linecap="round"
                        fill="none"
                     />
                    <g class="value-container"> 
                        <text class="value-percentage-container" 
                            x="50%" y="55%"
                            alignment-baseline="central" 
                            text-anchor="middle" 
                            dominant-baseline="middle"
                        >
                            <tspan class="value-percentage" id="countdown"></tspan>
                        </text>
                    </g>
                </svg>
            </div>
        `;
        Countdown.countdownTemplate = countdownTemplate;
    }

    constructor() {
        super();
        
        const defaultColor= '#4D4D4D';
        const shadow = this.attachShadow({mode: 'open'});
        
        if (Countdown.countdownTemplate === undefined) {
            Countdown.createTemplate();
        }
        
        shadow.appendChild(Countdown.countdownTemplate.content.cloneNode(true));

        this.countdown = this.shadowRoot.getElementById('countdown');
        this.counterHtmlElm = this.shadowRoot.querySelector('.value-container');
        
        this.timerId = null;
        this.loaderTimerId = null;
        this.clock = {
            duration: 0,
            durationCounter: 0,
            startTime: null
        };
        this.displaySettings = {
            gaugeDiameter: '100%',
            gaugeColor: defaultColor,
            textColor: defaultColor,
        };
        this.loaderAnimation = {
            visibility: null,
            realDuration: 60,
            realDurationBkup: 60,
            duration: 0,
            speed: 10,
            active: false,
            invertAnimation:true
        }

        this.circles = this.shadowRoot.querySelector('circle');
    }

    get duration() {
        return this.clock.duration;
    }
    set duration(value) {
        if (value !== this.clock.duration) {
            this.durationCounter = this.clock.duration = parseInt(value, 10);
        }
    }
    
    get durationCounter(){
        return this.clock.durationCounter;
    }
    set durationCounter(value) {
        if (value !== this.clock.durationCounter) {
            this.clock.durationCounter = parseInt(value, 10);
            this.#updateCountdown();
        }
    }
    
    get initialtime() {
        return this.clock.startTime;
    }
    set initialtime(value) {
        if (value !== this.clock.startTime) {
            this.clock.startTime = parseInt(value);
            this.#updateCountdown(this.clock.startTime);
        }
    }

    get gaugediameter() {
        return this.displaySettings.gaugeDiameter;
    }
    set gaugediameter(value) {
        if (value !== this.displaySettings.gaugeDiameter) {
            this.displaySettings.gaugeDiameter = value;
        }
    }

    get gaugecolor() {
        return this.displaySettings.gaugeColor;
    }
    set gaugecolor(value) {
        if (value !== this.displaySettings.gaugeColor) {
            this.displaySettings.gaugeColor = value;
        }
    }
    
    get textcolor() {
        return this.displaySettings.textColor;
    }
    set textcolor(value) {
        if (value !== this.displaySettings.textColor) {
            this.displaySettings.textColor = value;
        }
    }
    
    get loader() {
        return this.loaderAnimation.visibility;
    }
    set loader(value) {
        if (typeof(value) === "boolean") {
            this.loaderAnimation.visibility = value;
        }
    }

    get loadertimer() {
        return this.loaderAnimation.realDuration;
    }
    set loadertimer(value) {
        if (value) {
            this.loaderAnimation.realDuration = parseInt(value);
        }
    }

    connectedCallback() {
        this.durationCounter = (!this.initialtime) ? this.duration: this.initialtime;
        this.countdown.textContent = this.durationCounter;

        const svg = this.shadowRoot.querySelector('svg');
        this.#updateSVGSize(svg);

        this.#applyColors(svg);
        this.#updateCountdown();
    }
    
    disconnectedCallback() {
        clearInterval(this.timerId);
        clearInterval(this.loaderTimerId);
    }
    
    static get observedAttributes() {
        return ['duration', 'initialtime','gaugediameter','gaugecolor', 'textcolor', 'loader', 'loadertimer'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'duration':
                if (newValue !== oldValue) {
                    this.clock.duration = parseInt(newValue);
                    this.#updateCountdown();
                }
                break;
                
            case 'initialtime':
                if (newValue !== oldValue) {
                    this.initialtime = newValue
                }
                break;
                
            case 'gaugediameter':
                this.gaugediameter = newValue;
                break;
                
            case 'gaugecolor':
                this.gaugecolor = newValue;
                break;
                
            case 'textcolor':
                this.textcolor = newValue;
                break;
            case 'loader':
                this.loader = (newValue !== null);
                break; 
            case 'loadertimer':
                if (newValue !== oldValue) {
                    this.loadertimer = newValue;
                }
                break;
        }
    }

    start() {
        this.loaderAnimation.active=false
        clearInterval(this.timerId);
        this.circles.style.transform = 'rotate(90deg) scale(-1,1)';
        this.clock.durationCounter = (!this.initialtime) ? this.durationCounter: this.initialtime;

        if (this.clock.durationCounter > 0){
            this.#updateCountdown();
            this.timerId = setInterval(() => {
                --this.clock.durationCounter;
                if (this.durationCounter <= 0) {
                    this.stop();
                    if (this.loader) {
                        this.loaderAnimation.active = true;
                        this.#activateLoader()
                    }
                } else {
                    this.#updateCountdown();
                }
            }, 1000);
        }
    }

    pause() {
        this.loaderAnimation.active=false
        this.initialtime = this.durationCounter;
        clearInterval(this.timerId);
        this.#updateCountdown();
    }

    stop() {
        this.loaderAnimation.active=false
        clearInterval(this.timerId);
        this.timerId = null;
        this.durationCounter = 0;
        this.#updateCountdown();
        this.dispatchEvent(new CustomEvent('countdownEnd'));
        this.clock.startTime = this.clock.duration;
    }

    reset() {
        this.loaderAnimation.active=false
        this.clock.durationCounter = this.initialtime = this.duration;
        clearInterval(this.timerId);
        this.timerId = null;
        this.#updateCountdown();
    }

    #applyColors(svg) {
        this.circles.setAttribute('stroke', this.gaugecolor);
        this.countdown.setAttribute('fill', this.textcolor);
        
    }
    
    #updateCountdown(duration = this.clock.durationCounter) {
        this.counterHtmlElm.style.visibility = (!this.loaderAnimation.active) ? "visible": "hidden";
        
        const percentageValue = this.clock.durationCounter;
        const referenceValue =(!this.loaderAnimation.active) ? this.clock.duration: this.loaderAnimation.duration;

        const val = (Number(percentageValue) / Number(referenceValue) * 100);
        this.circles.setAttribute('stroke-dasharray', `${val}, 100`);
        this.countdown.textContent = `${duration}`;
    }

    #updateSVGSize(svg) {
        if (this.gaugediameter) {
            svg.setAttribute('width', `${this.gaugediameter}`);
            svg.setAttribute('height', `${this.gaugediameter}`);
        }
    }

    startLoader(){
        this.loader = true
        this.loaderAnimation.active = true;
        this.#activateLoader()
    }
    stopLoader() {
        this.#deactivateLoader();
        this.loader=false
        this.loaderAnimation.active = false;
    }
    
    #activateLoader() {
        clearInterval(this.timerId);
        this.loaderAnimation.duration = 240;
        this.clock.durationCounter = 0;

        this.#updateCountdown();
        this.loaderAnimation.invertAnimation = true;
        this.timerId = setInterval(() => {
            this.durationCounter = this.loaderAnimation.invertAnimation ? this.durationCounter + 1 : this.durationCounter - 1;

            if (this.durationCounter === 0 && !this.loaderAnimation.invertAnimation) {
                this.loaderAnimation.invertAnimation = true;
            }
            if (this.clock.durationCounter === this.loaderAnimation.duration && this.loaderAnimation.invertAnimation) {
                this.loaderAnimation.invertAnimation = false;
            }

            if (this.clock.durationCounter <= this.loaderAnimation.duration && this.loaderAnimation.invertAnimation) {
                this.circles.style.transform = 'rotate(-90deg)';
                this.#updateCountdown();
            }
            if (this.clock.durationCounter >= 0 && !this.loaderAnimation.invertAnimation) {
                this.circles.style.transform = 'rotate(90deg) scale(-1,1)';
                this.#updateCountdown();
            }
        }, this.loaderAnimation.speed);

        this.loaderAnimation.realDurationBkup =  this.loaderAnimation.realDuration
        this.loaderTimerId = setInterval(() => {
            --this.loaderAnimation.realDuration;
            if (this.loadertimer <= 0) {
                this.#deactivateLoader();
            }
        }, 1000);
    }
    #deactivateLoader() {
        this.loaderAnimation.realDuration = this.loaderAnimation.realDurationBkup;

        this.dispatchEvent(new CustomEvent('loaderEnded'));
        clearInterval(this.loaderTimerId);
        this.durationCounter = 0;
        this.loaderAnimation.active=true
        this.clock.durationCounter = this.loaderAnimation.duration;
        clearInterval(this.timerId);
        this.#updateCountdown();
    }
}

customElements.define('countdown-timer', Countdown);