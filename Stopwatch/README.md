# STOPWATCH TIMER v.1

## ACCEPTED ATTRIBUTES:
* **autostart**: if attribute is set it will automatically starts the timer;
* **initialtime**: it accepts the following time formats: HH:mm:ss or HH:mm or HH. If attribute is set the timer will be
    set to the given time;
* **label**: Optional text;
* **labelcolor**: if no color is set by default the color for the gauge is #03C6FF. The attribute only accepts hexadecimal
    colors;
* **timercolor**: if no color is set by default it will assume this color #FFFFFF. The attribute only accepts
    hexadecimal colors
* **playbtncolor**: if no color is set by default it will assume this color #4981C2 as background color, the color of the
    icon will automatically change to black or white depending on if the background color is lighter or
    darker. The attribute only accepts hexadecimal colors.
* **pausebtncolor**: if no color is set by default it will assume this color #4981C2 as background color, the color of the
    icon will automatically change to black or white depending on if the background color is lighter or
    darker. The attribute only accepts hexadecimal colors.
* **stopbtncolor**: if no color is set by default it will assume this color #F5A622 as background color, the color of the
    icon will automatically change to black or white depending on if the background color is lighter or
    darker. The attribute only accepts hexadecimal colors.
* **darkmode**: the attribute, if set to false, it will change the color of the timer from white to black.

## HOW TO USE IT:
### EXAMPLES:
    <stopwatch-timer 
        label="LABEL"
        labelcolor="#ccc"
        initialtime="00:01:00"
        autostart>
    </stopwatch-timer>



### AVAILABLE FUNCTIONS:
* **start()**: start timer from 00:00:00 or from the time in the attribute initialtime;
* **pause()**: pause timer
* **handleStartPause()**: facilitator for start and pause
* **stop()**: timer ends, the clock will be set to 00:00:00

### CUSTOME EVENTS
* **stopWatchStarted**: Triggered when the start button is pressed or the start() function is executed
* **stopWatchEnd**: Triggered when the stop button is pressed or the stop() function is executed
* **stopWatchPaused**: Triggered when the pause button is pressed or the pause() function is executed

# WARNING: DON'T USE THIS ELEMENT LIKE THIS:
      <stopwatch-timer ATTRIBUTES />
      THIS CUSTOM ELEMENT SHOULD ALWAYS BE USED WITH THE CLOSED TAG, LIKE IN THE EXAMPLE


