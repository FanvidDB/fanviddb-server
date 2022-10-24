lint:
	status=0;\
! command -v mypy || make backend-lint || status=1;\
! command -v yarn || make frontend-lint || status=1;\
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
BABEL_ENV=development yarn lint || status=1;\
yarn prettier --check . || status=1;\
exit $$status

fmt:
	-command -v black && black .
	-command -v isort && isort .
	-command -v yarn && yarn prettier --write .
