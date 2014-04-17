ninja-state
===========

A Ninjablocks driver to create state devices


# Configuration

Add state devices from the module settings

Or edit `/opt/ninja/config/ninja-state/config.json` with any number of state devices you want to create

    {
      "config": {
        "devices": {
          "blind1": {
            "name": "living room blind"
          },
          "heater": {
            "name": "heater"
          }
        }
      }
    }
