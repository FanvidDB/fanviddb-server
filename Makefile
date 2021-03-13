lint:
	-mypy .
	-flake8
	-black . --check
	-isort . --check
	-vulture .
