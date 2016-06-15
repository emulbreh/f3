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
    A function that maps an object to a string
component factory
    A function that maps an object to a component.
action
    A user interface `command`_


.. _command: https://en.wikipedia.org/wiki/Command_pattern
