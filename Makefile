dev:
	pnpm tauri dev

lint:
	pnpm exec eslint src --fix

pretty:
	pnpm exec prettier . --write

check:
	make lint
	make pretty

build:
	pnpm tauri build
