#!/bin/bash

START_TIME=$(date +%s.%N)

python3 -m utils.compile
EXIT_CODE=$?

END_TIME=$(date +%s.%N)
ELAPSED=$(awk "BEGIN {printf \"%.2f\", $END_TIME - $START_TIME}")
echo "[TIME] Compilation took ${ELAPSED}s"

exit $EXIT_CODE
