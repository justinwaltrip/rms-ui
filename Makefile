dev:
	# rm -rf ./src-tauri/target
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

dev-mobile:
	rm -rf ./src-tauri/target
	pnpm tauri ios dev 'iPad Pro 13-inch (M4)'
