/*
# main coffea structure

Elements:
 * core
 * protocols
 * plugins/middleware

Overview (pseudocode):
 * Core: Config -> [Info]
 * Core: for each Info, do:
   * Core: call protocol
   * Protocol: Info -> Handle (Handle = Connection socket + event handler)
 * Core: listen to events from socket and pipe them to event handler
 * Plugin (before handler): Event -> Event
 * Protocol (event handler): Event -> [Event]
 * Plugin (after handler): [Event] -> [Event]
 * Core: for each Event, do:
   * Core: dispatch event

Core: processes config, handles sockets/event handlers, dispatches events
Protocol: processes connection config to socket, sets event handler
Protocol (event handler): processes events
Plugin: processes events (before and/or after protocol)


## notes
 * use `visionmedia/debug` for debugging


## problems
 * maybe protocols should listen for and then emit events to core which will
   process it further and dispatch to clients
 * how do we deal with standardization of protocols? do they just use certain
   common names?


## core

Logic (in pseudocode):
 * Process config
   * get required protocols and plugins from config)
   * load required protocols (try to load `coffea-PROTOCOLNAME`)
     ? what should happen when loading fails? defaults? I'd prefer crashes.
     * it's better to crash than to silently fail and then cause frustration +1
 * Connect to networks
   * load config for each network and forward to protocol
   * load required plugins (try to load `coffea-plugin-PLUGINNAME`)
     ? load them differently? different naming? full github repo names? or npm names?
       * i like the idea of npm names being loaded using coffea
   * emit `connect` event (or something like that to signal that the core has
     finished handling the connection and the protocol is taking over now)
     ? maybe protocol should emit that? pros/cons
     * protocol should read its part of the config and handle the connection to
       networks automatically. might not let us add different things at runtime
       though? (unless we add to the config or so)
 * Event dispatcher
   *

## protocol

Logic (in pseudocode):
 * connection function called with connection info
   * connect and return "socket" (can be any kind of handle for the connection,
     will be used later for any events)
     * socket is then saved by the core in a data structure
   ? register event handler here or in core? I'd prefer core, but not too sure how.
 * event handler function called with "socket"/connection handle + event info
   * can do anything and returns an array of events that happened which get
     dispatched by the core


## plugin

Logic (in pseudocode):
 * plugins can register before/after event handler functions are called
 * get all input data and return a modified version of that data
 * new input data gets:
    * either: passed to the protocol
    * or: passed to the dispatcher (core)
*/
