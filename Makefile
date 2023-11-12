dev:
	pnpm tauri dev

lint:
	pnpm exec eslint . --fix

pretty:
	pnpm exec prettier . --write

check:
	make lint
	make pretty
