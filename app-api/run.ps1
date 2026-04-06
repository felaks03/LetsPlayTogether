param(
  [ValidateSet("dev","build","start","seed","clean")]
  [string]$modo = "dev"
)

Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
  npm install
}

if ($modo -eq "clean") {
  npm run clean
  exit $LASTEXITCODE
}

if ($modo -eq "build") {
  npm run build
  exit $LASTEXITCODE
}

if ($modo -eq "start") {
  npm run build
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  npm run start
  exit $LASTEXITCODE
}

if ($modo -eq "seed") {
  npm run seed
  exit $LASTEXITCODE
}

npm run dev
