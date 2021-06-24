#!/bin/bash

SCRIPT_SRC_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $SCRIPT_SRC_DIR

cd examples

dartdevc sample.dart --modules amd --out sample.amd.js
dartdevc sample.dart --modules common --out sample.common.js
dartdevc sample.dart --modules es6 --out sample.es6.js
