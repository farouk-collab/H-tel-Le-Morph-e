import { spawn } from 'node:child_process'

const isWindows = process.platform === 'win32'
const processes = []
let shuttingDown = false

function start(name, script) {
  const command = isWindows ? 'cmd.exe' : 'npm'
  const args = isWindows ? ['/d', '/s', '/c', `npm run ${script}`] : ['run', script]

  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: false,
  })

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }

    if (code === 0) {
      stopAll(0)
      return
    }

    console.error(`${name} stopped unexpectedly.`, code !== null ? `Exit code: ${code}` : `Signal: ${signal}`)
    stopAll(code ?? 1)
  })

  processes.push(child)
  return child
}

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return
  }

  shuttingDown = true

  for (const child of processes) {
    if (!child.killed) {
      child.kill('SIGTERM')
    }
  }

  setTimeout(() => process.exit(exitCode), 150)
}

process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))

start('API server', 'dev:server')
start('Vite dev server', 'dev:client')
