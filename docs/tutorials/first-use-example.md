# First use: a workshop from nothing

A safe rehearsal in a temporary directory:

```bash
export BOS_WORKSHOP=/tmp/demo/__WORKSHOP

bos workshop bootstrap --dry-run     # plan only; nothing exists yet
bos workshop open                    # the workshop appears
bos workshop status
```

```
/tmp/demo/__WORKSHOP                 workshop     ok
  .BOS                               system       ok
    .BOS/setup                       setup        ok
    .BOS/data                        data         ok
    .BOS/nests                       nestrelm     ok
    .BOS/storylines                  storylines   ok
      .BOS/storylines/ttystories     ttystories   ok
      .BOS/storylines/logs           logs         ok
      .BOS/storylines/manifests      manifests    ok
  devarmory                          devarmory    ok
  forge                              forge        ok
  craftbook                          craftbook    ok
    craftbook/scrapnotes             scrapnotes   ok
  archive                            archive      ok
```

Put work where it belongs:

```bash
mkdir -p $BOS_WORKSHOP/forge/my-scope && cd $BOS_WORKSHOP/forge/my-scope
git clone <repo> my-project && cd my-project
bos project install-hooks           # commits now leave a trace in storylines
echo "idea…" > $BOS_WORKSHOP/craftbook/scrapnotes/idea.md
```

End the session:

```bash
history -a && bos workshop close
cat $BOS_WORKSHOP/.BOS/storylines/logs/workshop.jsonl
```

```json
{"unixusat":1790736014288,"host":"setternet-H1","event":"open","user":"sarverott","from":"$BOS_WORKSHOP"}
{"unixusat":1790736014394,"host":"setternet-H1","event":"git-hook","hook":"post-commit","repo":".../forge/my-scope/my-project","place":{"area":"forge","scope":"my-scope","project":"my-project","inner":null},"commit":"83a15d1 first strike"}
{"unixusat":1790736014427,"host":"setternet-H1","event":"close","user":"sarverott","ttystory":".../ttystories/ttystory-setternet-H1-1790736014426.txt"}
```

For your real workshop, drop `BOS_WORKSHOP` and run `bos workshop open` from anywhere inside it.
