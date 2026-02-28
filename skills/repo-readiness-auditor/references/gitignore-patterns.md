# Gitignore Patterns Reference

This file contains recommended `.gitignore` patterns organized by tech stack.
The repo-readiness-auditor skill uses this as a reference when generating or
validating `.gitignore` files.

Source: [github/gitignore](https://github.com/github/gitignore) via Context7, 2026.

---

## Universal (Always Include)

```gitignore
# OS files
.DS_Store
Thumbs.db
desktop.ini
*.swp
*~

# IDE / Editor
.vscode/
.idea/
*.sublime-project
*.sublime-workspace
*.code-workspace

# Agent / AI IDE state & local configs (GITIGNORE these)
# Note: AGENTS.md, CLAUDE.md, .cursorrules, .windsurfrules, .roomodes
#       and .github/copilot-instructions.md are SHARED and should be COMMITTED.
.agents/skills/
.agent/
_agents/
_agent/
.gemini/
.cursor/
.windsurf/
.claude/*.local.md
skills-lock.json
mcp_config.json

# Secrets & Environment
.env
.env.*
!.env.example
*.pem
*.key
*.cert
*.p12
*.pfx
credentials.json
service-account*.json
secrets.json
```

---

## Python

```gitignore
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
*.egg
MANIFEST
*.manifest
*.spec
pip-log.txt
pip-delete-this-directory.txt
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/
cover/
.venv/
venv/
env/
ENV/
.uv/
.pdm-build/
.ruff_cache/
pyrightconfig.json
```

---

## Django (extends Python)

```gitignore
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
media/
staticfiles/
*.pot
*.mo
celerybeat-schedule
celerybeat.pid
```

---

## Flask (extends Python)

```gitignore
instance/
.webassets-cache
```

---

## Node.js / JavaScript / TypeScript

```gitignore
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*
.pnpm-store/
dist/
.next/
out/
.nuxt/
.output/
.cache/
.parcel-cache/
.turbo/
*.tsbuildinfo
.env.local
.env.development.local
.env.test.local
.env.production.local
.vercel/
.netlify/
coverage/
*.lcov
bower_components/
jspm_packages/
web_modules/
```

---

## C# / .NET

```gitignore
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/
*.rsuser
*.suo
*.user
*.userosscache
*.sln.docstates
*.userprefs
[Tt]est[Rr]esult*/
[Dd]ebugPS/
*.ncrunch*
_ReSharper*/
*.Publish.xml
PublishScripts/
*.azurePubxml
*.pubxml
*.pubxml.user
*.nupkg
*.snupkg
packages/
project.lock.json
project.fragment.lock.json
artifacts/
Generated\ Files/
```

---

## Rust

```gitignore
/target/
Cargo.lock  # For libraries only; keep for binaries
**/*.rs.bk
*.pdb
```

---

## Go

```gitignore
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
vendor/
```

---

## Java

```gitignore
*.class
*.log
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar
.idea/
*.iml
out/
.classpath
.project
.settings/
```

---

## Ruby

```gitignore
*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
*.bundle
*.so
*.o
*.a
mkmf.log
/.bundle/
/vendor/bundle
/lib/bundler/man/
Gemfile.lock  # For libraries only
```

---

## Docker

```gitignore
.docker/
docker-compose.override.yml
```

---

## Terraform

```gitignore
.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraformrc
terraform.rc
```

---

## Flutter / Dart

```gitignore
.dart_tool/
.packages
build/
.flutter-plugins
.flutter-plugins-dependencies
*.iml
```
