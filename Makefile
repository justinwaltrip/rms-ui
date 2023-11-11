dev:
	pnpm tauri dev

lint:
	pnpm exec eslint .

pretty:
	pnpm exec prettier . --write

check:
	make lint
	make pretty
