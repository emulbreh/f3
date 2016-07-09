f3 – the frontend framework
===========================

Demo:

.. code-block:: console

    $ npm install
    $ ./node_modules/.bin/webpack
    $ open -a "Google Chrome" demo/index.html

Concepts
--------

component
    A user interface unit; corresponds to an HTMLElement
renderer
    An object that can map an object to a string
component factory
    An object that can map an object to a component
action
    A user interface `command`_

Todo
----

* Autocomplete
* Collapsible
* ButtonGroup
* Dialog
* Fieldset
* IconSet
* Model IDs
* MultiComboBox
* TabPanel
* Overlay


.. _command: https://en.wikipedia.org/wiki/Command_pattern
