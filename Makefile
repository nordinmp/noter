.DEFAULT_GOAL := serve

MAKEFLAGS += -j4
NPM := npm
NPX := npx
ESBUILD_FLAGS := --bundle --platform=node

help: ## Show all Makefile targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

deps: ## Install dependencies
	$(NPM) i

build-prod: ESBUILD_FLAGS += --minify
build-prod: types build

build: build-lib build-plugins build-cli ## Builds entirety of Quartz

types: types-lib types-plugins ## Typecheck and emit types for all components of Quartz

## -- LIB --
build-lib: $(LIB_SOURCES) ## Build only shared library
	cd ./packages/lib; $(NPX) esbuild index.ts --outfile=./build/index.js $(ESBUILD_FLAGS)

types-lib: $(LIB_SOURCES)
	$(NPX) tsc -p ./packages/lib/tsconfig.json

## -- PLUGINS --
build-plugins: $(PLUGIN_SOURCES) ## Build plugin library
	cd ./packages/plugins; $(NPX) esbuild index.ts --outfile=./build/index.js $(ESBUILD_FLAGS)

types-plugins: $(LIB_SOURCES)
	$(NPX) tsc -p ./packages/plugins/tsconfig.json

## -- CLI --
build-cli: $(CLI_SOURCES) ## Build CLI
	cd ./packages/cli; $(NPX) esbuild index.ts --outfile=./build/cli.js --banner:js="#!/usr/bin/env node" --external:esbuild $(ESBUILD_FLAGS)
	cp -r ./packages/cli/template ./packages/cli/build/
	cd ./packages/cli; $(NPM) link --no-audit

