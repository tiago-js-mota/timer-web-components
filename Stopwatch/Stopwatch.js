
class Stopwatch extends HTMLElement {
    static stopwatchTemplate;

    static createTemplate() {
        const stopwatchTemplate = document.createElement("template");
        stopwatchTemplate.innerHTML = `
            <style>
				.stopwatch-container{
				    position: relative;
				    display:flex;
				    align-items: center;				    
                    justify-content: space-between;
				    
				    min-width: 17.3rem;
				    height: 2.2rem;
				}
				
				.box {
				    padding: 0 0.61rem;
				    border: .05rem solid white;				    				   				   
				    border-radius: 2px;
				}
				
				.label_clock{
				    display: flex;				   
				    font-family: Arial, sans-serif;
				    font-size: 1.375rem;
				}
                #label{
                    font-weight: bold;
                    /*color: #03C6FF*/
                }
                #timer{
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                    /*color: #FFFFFF;*/
                }
                .btn-container {
				    display: flex;
                }
				.play_pause_btn {
				    position: relative;
				    display: flex;
				}
				.btn-stack {
				    position: absolute;
				}
				.btn {				    
                    display: flex;
                    align-items: center;
                    justify-content: center;
				    				   
				    cursor: pointer;
				    padding: .3rem;
				    border-radius: .125rem;
				    				   
				    margin: .2rem;				   
				}
				#play{
				    /*position: relative;*/
				    /*color: #FFFFFF;*/
				    /*background-color: #4981C2;*/
				}
				#pause{
				    /*position: relative;*/
				    /*background-color: #4981C2;*/
				}
				#stop{
				    /*position: relative;*/
				    /*background-color: #F5A622;*/
				    margin-right: 0;
				}
            </style>
            <div class="stopwatch-container box">
                <div class="label_clock">
                    <div id="label"></div>
                    <div id="timer">00:00:00</div>               
                </div>
                <div class="btn-container">
                    <div id="play_pause_btn">
                        <div id="play" class="btn btn-stack">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#fff" width="16" height="16"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                        </div>
                        <div id="pause" class="btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="#fff" width="16" height="16"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
                        </div>
                    </div>
                    <div id="stop" class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#fff" width="16" height="16"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
                    </div>
                </div>                
            </div>
        `;
        Stopwatch.stopwatchTemplate = stopwatchTemplate;
    }

    constructor() {
        super();
        
        const shadow = this.attachShadow({mode: 'open'});
        
        if (Stopwatch.stopwatchTemplate === undefined) {
            Stopwatch.createTemplate();
        }
        
        shadow.appendChild(Stopwatch.stopwatchTemplate.content.cloneNode(true));

        this.timer = this.shadowRoot.getElementById('timer');
        
        this.clockSettings = {
            autostart: false,
            initialTime: '00:00:00',
            
            startTime: 0,
            elapsedTime: 0,
            timerIntervalId: null,
            paused: true
        };
        this.displaySettings = {
            label: null,
            labelColor: '#03C6FF',
            timerColor: '#FFFFFF',
            playBtnColor: '#4981C2',
            pauseBtnColor: '#4981C2',
            stopBtnColor: '#F5A622',
            darkMode: true
        };
        
        this.playBtn = this.shadowRoot.querySelector('#play')
        this.pauseBtn = this.shadowRoot.querySelector('#pause')
        this.stopBtn = this.shadowRoot.querySelector('#stop')
    }
    
    get initialtime() {
        return this.clockSettings.initialTime;
    }
    set initialtime(value) {
        if (value) {
            this.clockSettings.initialTime = value;
            this.#updateTimerDisplayBasedOnInitialTime();
        }
    }

    get label() {
        return this.displaySettings.label;
    }
    set label(value) {
        if (value !== this.displaySettings.label) {
            this.displaySettings.label = value;
            this.#updateLabel()
        }
    }
    get labelcolor() {
        return this.displaySettings.labelColor;
    }
    set labelcolor(value) {
        if (value !== this.displaySettings.labelColor && this.#isValidHexColor(value)) {
            this.displaySettings.labelColor = this.#hexColor(value);
            this.#changeLabelColor();
        }
    }
    get timercolor() {
        return this.displaySettings.timerColor;
    }
    set timercolor(value) {
        if (value !== this.displaySettings.timerColor && this.#isValidHexColor(value)) {
            this.displaySettings.timerColor = this.#hexColor(value);
            this.#changeTimerColor();
        }
    }
    get playbtncolor() {
        return this.displaySettings.playBtnColor;
    }
    set playbtncolor(value) {
        if (value !== this.displaySettings.playBtnColor && this.#isValidHexColor(value)) {
            this.displaySettings.playBtnColor = this.#hexColor(value);
            this.#changePlayButtonColor();
        }
    }
    get pausebtncolor() {
        return this.displaySettings.pauseBtnColor;
    }
    set pausebtncolor(value) {
        if (value !== this.displaySettings.pauseBtnColor && this.#isValidHexColor(value)) {
            this.displaySettings.pauseBtnColor = this.#hexColor(value);
            this.#changePauseButtonColor();
        }
    }
    get stopbtncolor() {
        return this.displaySettings.stopBtnColor;
    }
    set stopbtncolor(value) {
        if (value !== this.displaySettings.stopBtnColor) {
            this.displaySettings.stopBtnColor = this.#hexColor(value);
            this.#changeStopButtonColor()
        }
    }
    get darkmode() {
        return this.displaySettings.darkMode;
    }
    set darkmode(value) {
        if (typeof value === "boolean" && value !== this.displaySettings.darkMode) {
            this.displaySettings.darkMode = value;
            this.#changeToDarkmodeColors();
        }
    }

    get starttime() {
        return this.clockSettings.startTime
    }
    set starttime(value) {
        if(value){
            this.clockSettings.elapsedTime = value
        }
    }
    
    connectedCallback() {
        this.#applyColors();
        this.playBtn.addEventListener('click', () => this.#handleStartPause())
        this.pauseBtn.addEventListener('click', () => this.#handleStartPause())
        this.stopBtn.addEventListener('click', () => this.stop())

        this.pauseBtn.style.visibility = 'hidden';

        this.#updateLabel();
        this.#autoStart();
    }
    
    disconnectedCallback() {
        this.playBtn.removeEventListener('click', () => this.#handleStartPause())
        this.pauseBtn.removeEventListener('click', () => this.#handleStartPause())
        this.stopBtn.removeEventListener('click', () => this.stop())

        clearInterval(this.timerId);
    }
    
    static get observedAttributes() {
        return ['autostart', 'initialtime', 'label', 'labelcolor', 'timercolor', 'playbtncolor', 'pausebtncolor', 'stopbtncolor', 'darkmode'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'autostart':
                this.clockSettings.autostart = (newValue !== null);
                break;
            case 'initialtime':
                this.initialtime = newValue;
                break;
                
            case 'label':
                if (newValue !== oldValue) {
                    this.label = newValue;
                }
                break;
            case 'labelcolor':
                if (newValue !== oldValue) {
                    this.labelcolor = newValue;
                }
                break; 
            case 'timercolor':
                if (newValue !== oldValue) {
                    this.timercolor = newValue;
                }
                break;                
            case 'playbtncolor':
                if (newValue !== oldValue ) {
                    this.playbtncolor = newValue;
                }
                break;            
            case 'pausebtncolor':
                if (newValue !== oldValue) {
                    this.pausebtncolor = newValue;
                }
                break;            
            case 'stopbtncolor':
                if (newValue !== oldValue) {
                    this.stopbtncolor = newValue;
                }
                break;
            
            case 'darkmode':
                this.darkmode = (newValue==="")? true: (newValue !== 'false');
                break;
        }
    }

    start() {
        this.clockSettings.startTime = Date.now() - this.clockSettings.elapsedTime;
        this.clockSettings.timerIntervalId = setInterval(() => {
            this.#updateElapsedTime();
        }, 1000);
        this.clockSettings.paused = false;
    }
    pause(){
        clearInterval(this.clockSettings.timerIntervalId);
        this.clockSettings.timerIntervalId = null;
        this.clockSettings.paused = true;
        this.dispatchEvent(new CustomEvent('stopWatchPaused'))
    }
    
    #showPlayBtn(){
        this.playBtn.style.visibility = 'visible';
        this.pauseBtn.style.visibility = 'hidden';
    }
    #showPauseBtn(){
        this.playBtn.style.visibility = 'hidden';
        this.pauseBtn.style.visibility = 'visible';
    }
    
    #handleStartPause() {
        if(this.clockSettings.paused) {
            this.start()
            this.#showPauseBtn();
        } else {
            this.pause();
            this.#showPlayBtn();
        }
    }

    stop() {
        clearInterval(this.clockSettings.timerIntervalId);
        this.clockSettings.timerIntervalId = null;
        this.clockSettings.paused = true;
        if(this.clockSettings.paused) {
            this.#showPlayBtn();
        } else {
            this.#showPauseBtn();
        }
        this.clockSettings.startTime = 0;
        this.clockSettings.elapsedTime = 0;
        this.#updateTimerDisplay();
        this.dispatchEvent(new CustomEvent('stopWatchEnd'))
    }
    
    #updateElapsedTime() {
        this.clockSettings.elapsedTime = Date.now() - this.clockSettings.startTime;
        this.#updateTimerDisplay();
    }
    #updateTimerDisplay() {
        const time = new Date(this.clockSettings.elapsedTime);
        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        const seconds = time.getUTCSeconds().toString().padStart(2, '0');
        this.timer.innerText = `${hours}:${minutes}:${seconds}`;
    }

    #autoStart() {
        if(this.clockSettings.autostart){
            this.start();
            this.#showPauseBtn();
        } else {
            clearInterval(this.clockSettings.timerIntervalId);
            this.clockSettings.timerIntervalId = null;

            this.#showPlayBtn();
            this.clockSettings.paused = true;
        }
    }
    
    #updateLabel() {
        const label = this.shadowRoot.querySelector('#label')
        label.textContent = this.label
    }
    #updateTimerDisplayBasedOnInitialTime() {
        const invalidTime = (time = this.clockSettings.initialTime) => {
            console.error(`This time ${time} is not a valid time.\nPlease use the correct format: HH:mm:ss`)
        }
        
        const clockTime = this.initialtime.split(':');
        switch (clockTime.length) {
            case 3: // FORMAT: HH:mm:ss
                if(/^\d+$/.test(clockTime[0].trim()) && /^\d+$/.test(clockTime[1].trim()) && /^\d+$/.test(clockTime[2].trim())){
                    this.clockSettings.elapsedTime = new Date(1970, 0, 1, parseInt(clockTime[0].trim()), parseInt(clockTime[1].trim()), parseInt(clockTime[2].trim())) - new Date(1970, 0, 1)
                    this.#updateTimerDisplay();
                    this.#autoStart();
                } else {
                    invalidTime()
                }
                break;
            case 2: // FORMAT: HH:mm
                if(/^\d+$/.test(clockTime[0].trim()) && /^\d+$/.test(clockTime[1].trim())){
                    this.clockSettings.elapsedTime = new Date(1970, 0, 1, parseInt(clockTime[0].trim()), parseInt(clockTime[1].trim())) - new Date(1970, 0, 1)
                    this.#updateTimerDisplay();
                    this.#autoStart();
                } else {
                    invalidTime()
                }
                break;
            case 1: // FORMAT: HH
                if(/^\d+$/.test(clockTime[0].trim())){
                    this.clockSettings.elapsedTime = new Date(1970, 0, 1, parseInt(clockTime[0].trim())) - new Date(1970, 0, 1)
                    this.#updateTimerDisplay();
                    this.#autoStart();
                } else {
                    invalidTime()
                }
                break;
            default:
                invalidTime();
                this.clockSettings.initialTime = "00:00:00"
        }
    }

    #applyColors() {
        this.#changeLabelColor();
        this.#changeTimerColor();
        this.#changePlayButtonColor();
        this.#changePauseButtonColor();
        this.#changeStopButtonColor();
    }
    #changeToDarkmodeColors() {
        this.timercolor = this.darkmode ? "#FFFFFF" : "#000000";
    }
    #changePlayButtonColor(){
        const hex = this.displaySettings.playBtnColor;
        const rgb = this.#hexTorgb(hex);
        this.playBtn.style.backgroundColor = hex;
        (this.playBtn.querySelector('svg')).setAttribute('fill', this.#isDark(...rgb) ? "#FFFFFF" : "#000000");
    }
    #changePauseButtonColor(){
        const hex = this.displaySettings.pauseBtnColor;
        const rgb = this.#hexTorgb(hex);
        this.pauseBtn.style.backgroundColor = hex;
        (this.pauseBtn.querySelector('svg')).setAttribute('fill', this.#isDark(...rgb) ? "#FFFFFF" : "#000000");
    }
    #changeStopButtonColor(){
        const hex = this.displaySettings.stopBtnColor;
        const rgb = this.#hexTorgb(hex);
        this.stopBtn.style.backgroundColor = hex;
        (this.stopBtn.querySelector('svg')).setAttribute('fill', this.#isDark(...rgb) ? "#FFFFFF" : "#000000");
    }
    #changeLabelColor() {
        const labelElm = this.shadowRoot.getElementById('label');
        labelElm.style.color = this.labelcolor;
    }
    #changeTimerColor() {
        this.timer.style.color = this.timercolor;
    }
    
    #getLightness(r, g, b) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    }
    #isDark(r, g, b) {
        return this.#getLightness(r, g, b) < 180;
    }
    #isLight(r, g, b) {
        return this.#getLightness(r, g, b) > 150;
    }
    #hexTorgb(hex) {
        return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
    }
    #isValidHexColor(color) {
        const isValid = /^#((?:[0-9A-F]{3}){1,2})$/i.test(color)
        if(!isValid){
            console.warn('The inserted color is not a valid hexadecimal color.\nExamples of valid colors: #FFF or #ffffff')
        }
        return isValid;
    }
    // If a hexadecimal color don't have 6 characters it adds a 0 until it does
    #hexColor(color) {
        let result = color[0];
        if(color.length !== 7) {
            for (let i = 1; i < color.length; i++) {
                result += color[i] + color[i];
            }
            return result;
        }
        return color;
    }
}

customElements.define('stopwatch-timer', Stopwatch);