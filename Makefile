lint:
	status=0;\
make backend-lint || status=1;\
make frontend-lint || status=1;\
exit $$status

backend-lint:
	status=0;\
mypy . || status=1;\
flake8 . || status=1;\
black . --check || status=1;\
isort . --check || status=1;\
vulture . || status=1;\
exit $$status

frontend-lint:
	status=0;\
yarn lint || status=1;\
exit $$status

fmt:
	-black .
	-isort .


# See https://github.com/python-babel/babel/issues/296 - setup.cfg doesn't work.
extract:
	pybabel extract --no-location --sort-output --omit-header --input-dirs=fanviddb --width=120 -o locale/base.pot
	pybabel update -i locale/base.pot -d locale --omit-header --ignore-obsolete

locale-init:
	pybabel init -l $(locale) -i locale/base.pot -d locale
	pybabel update -l $(locale) -i locale/base.pot -d locale --omit-header --ignore-obsolete
