# How to extract checks from debug log

(This note is outdated)

Source: https://github.com/kachick/wait-other-jobs/actions/runs/9281068681

This file recorded snapshot checks for GH-820 in the debug log

How to use in testing code

1. Create 2 arrays for each checks in first and last polling. In first, mandatory check is not yet appeared.
2. Extract JSON with trimming the timestamp and debug prefix
3. (optional) Extract checks related to GH-820 for readability

```bash
mkdir -p tmp
cat ./snapshots/run-9281068681/1_wait-success.txt | sd '^(\S+ ##\[debug\])(.+)' '$2' > ./tmp/trimmed_prefix-wait-success.txt

# Manually extract JSON array with `"label": "rawdata"` as `./tmp/wait-success-polling1-rawdata.json`

cat ./tmp/wait-success-polling1-rawdata.json | jq '[.checks[] | select (.workflow.name | contains("GH-820"))]'
```
