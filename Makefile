PROJECT_NAME := ai-ml-core-notes

.PHONY: help docs-serve docs-build check

help:
	@printf "$(PROJECT_NAME) commands\n"
	@printf "  make docs-serve  - run docs locally\n"
	@printf "  make docs-build  - build static docs site\n"
	@printf "  make check       - run docs build validation\n"

docs-serve:
	mkdocs serve

docs-build:
	mkdocs build

check: docs-build
