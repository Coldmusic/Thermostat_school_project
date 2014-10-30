Assignment #2: The Heat Is On: Node.js Internet Of Things
Author: Margarita Otochkina

Description:

This is a simulation of an "internet of things" smart home. We controll thermostat from browser
(via internet) and thermostat will controll furnace via internet.

This assignment consist of four components: Furnace - separate file, works as a client, Thermostat-
separate file, works as a server, interface - imported in thermostat as separate function 
getPage(), weather service: also part of thermostat.

To make the app fully work, you have to run both furnace and thermostat files. Hovewer, if
you just want to look at the interface, you can run only thermostat.js. The interface will work
and even apply every change you've made(turn thermostat on/off, change desired temp), but
the room temperture will not change.

When the program runs, in a thermostat console window you can see up-to-date room termperature,
changind every 3-4 seconds. In a furnace console window you can see up-to-date info about furnace
state: ON or OFF.

When furnace runs, it repeatedly sends request to server(thermostat), asking is furnace should turn on or off.

This assignment was made and tested on Mac OSX.

In folder:
This folder with assignment contains:
  1. This ReadMe.txt file
  2. thermostat.js - main file
  3. furnace.js
  4. servercert.crt, serverkey.pem and server.scr
  

How to run:
  1. First, you need two console windows to run the assignment. First window - for thermostat,
     second one - for furnace.
  2.Run thermostat first, using command:
      node thermostat.js
    Browser interface is already working. You can change desired temperature, thermostat state,
    look at current weather and time. But room temperature will not change until you will not run 
    furnace.

  3.Run furnace, using command:
      node furnace.js
      
      
How to use interface:
    1. Go to http://127.0.0.1:3000
    2. Interface divided into blocks: first block is ON/OFF option
       You can check/uncheck the checkbox in the middle. At the bottom you can see
       the current state of thermostat - on or off.
    3. Second block: Current time. Display current time.
    4. Third block: Temperature inside room. 
    5. Fourth block: Weather information in current city(Ottawa). Desplays temperature 
       and weather condition(Rain, Clouds..)
    6. Last block: Set desired room temperature and submit button. You can either enter or
       choose the desired temperature for your room. Submit button submits all the changes
       and refreshes the page. Every information in every block will update after refshesh.
       No changes will be applied until you hit submit button! Submit button also works as
       just refresh button. So if you want to get current time/temperature without changing
       anything - just refresh.
       
IMPORTANT NOTE: Thermostat.js can crash because of the problem with connecting to the weather
service(program cannot get response). This error is not handled.