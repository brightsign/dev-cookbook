#!/bin/bash

# get script directory
script_dir=$(dirname "$(realpath "$0")")

# shift to target directory to squash
cd $1

${script_dir}/make-extension-$2

zip -r ../hello_world-$(date +%s).zip ext_hello_world*

rm -rf ext_hello_world*
