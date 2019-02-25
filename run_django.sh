#!/bin/sh
python3 manage.py test --pattern="test_*.py" && python3 manage.py migrate && python3 manage.py loaddata courses/fixtures/initial.json && python3 manage.py runserver 0.0.0.0:8000
