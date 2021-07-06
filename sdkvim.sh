#!/bin/bash

export VIM_NO_FLUTTER=1
export VIM_USE_CUSTOM_CONFIG=1

SCRIPT_SRC_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $SCRIPT_SRC_DIR

nvim5
