# COUNTDOWN TIMER v.1
this web component was developed to only work with seconds

## ACCEPTED ATTRIBUTES:
* **duration**: duration in seconds to start the countdown  
* **initialtime**: intermediate value to start the countdown. If defined it will overlap the value defined for
    the duration attribute on the first render.
* **gaugediamete**r: diameter of the circle can be defined here. If not defined it will automaticaly adjust to the
    available area. If value bigger than available space it'll only occupy the available area.
* **gaugecolo**r: by default the color for the gauge is #4D4D4D but can be changed. Examples of colors accepted:
    rgb(255, 99, 71); red; #c4c400
* **textcolor**: by default the color for the numbers is #4D4D4D but can be changed. Examples of colors accepted:
    rgb(255, 99, 71); red; #c4c400
* **loader**: the attribute, if present, it will mimic a loader animation after the countdown ends. The numbers are hidden and will circle through
    the animation indefinitely.
* **loadertimer**: duration in seconds of the loader animation. If not defined a default duration of 60 seconds is used

## HOW TO USE IT:
### EXAMPLES:
* **Countdown with default colors with a defined duration of 60 seconds**

`<countdown-timer duration="60"></countdown-timer>`

  * **Countdown with custom colors, with a defined duration of 60 seconds but the component will be loaded with 30
seconds defined by the attribute initialtime.**

`<countdown-timer
  duration="60"
  initialtime="30"
  gaugediameter="150"
  gaugecolor="#c4c400"
  textcolor="#fff"></countdown-timer>`

* **Countdown with a defined duration of 10 seconds    **  

`<countdown-timer duration="10"></countdown-timer>`

* **Countdown with the loader animation active and with a defined duration of 10 seconds. The duration will not be
          used unless the loader attribute is deleted or changed to false**

`<countdown-timer
   duration="10"
   loader></countdown-timer>`

### AVAILABLE FUNCTIONS:
* **start()**: start countdown
* **pause()**: pause countdown
* **stop()**: countdown ends, number of seconds left will change to zero
* **reset()**: resets the countdown to the initial duration, the value defined in the attribute duration
* **startLoader()**: activate the loader animation
* **stopLoader()**: deactivate the loader animation.

# WARNING: DON'T USE THIS ELEMENT LIKE THIS:
      <countdown-timer ATTRIBUTES />
      THIS CUSTOM ELEMENT SHOULD ALWAYS BE USED WITH THE CLOSED TAG, LIKE IN THE EXAMPLE
