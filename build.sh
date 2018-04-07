#!/bin/bash

mv /var/www/maintenance/festigeek.ch/maintenance_off.html /var/www/maintenance/festigeek.ch/maintenance_on.html

grunt build

mv /var/www/maintenance/festigeek.ch/maintenance_on.html /var/www/maintenance/festigeek.ch/maintenance_off.html