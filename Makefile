lint:
	flake8
	black . --check
	isort . --check
