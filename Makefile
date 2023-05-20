.DEFAULT_GOAL := help

MAKEFLAGS += -j6
NPM := npm
NPX := npx
ESBUILD_FLAGS := --bundle --platform=node

help: ## Show all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

deps: ## Install dependencies
	$(NPM) i

build: types build-lib build-plugins build-cli ## Builds and links entirety of Quartz

build-prod: ESBUILD_FLAGS += --minify
build-prod: build ## Build Quartz for production and emit types

## -- LIB --
build-lib: ## Build only shared library
	cd ./packages/lib; $(NPX) esbuild index.ts --packages=external --outfile=./build/index.js $(ESBUILD_FLAGS)

types-lib:
	$(NPX) tsc -p ./packages/lib/tsconfig.json

## -- PLUGINS --
build-plugins: ## Build plugin library
	cd ./packages/plugins; $(NPX) esbuild index.ts --packages=external --outfile=./build/index.js $(ESBUILD_FLAGS)

types-plugins:
	$(NPX) tsc -p ./packages/plugins/tsconfig.json

## -- CLI --
build-cli: ## Build and link CLI 
	cd ./packages/cli; $(NPX) esbuild index.ts --outfile=./build/cli.js --external:esbuild $(ESBUILD_FLAGS)
	cp -r ./packages/cli/template ./packages/cli/build/
	cd ./packages/cli; $(NPM) link

types-cli:
	$(NPX) tsc -p ./packages/cli/tsconfig.json

types: types-lib types-plugins types-cli ## Typecheck and emit types for all components of Quartz
