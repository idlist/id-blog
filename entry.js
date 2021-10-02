import { rm } from 'fs/promises'
import process, { argv } from 'process'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'
import { isAsyncFunction } from 'util/types'

import esbuild from 'esbuild'
import glob from 'fast-glob'
import chokidar from 'chokidar'

import config from './.blogconfig.js'
import c from './utils/colors.js'

const startTs = Date.now()

const options = {
  watch: argv.includes('--watch') || argv.includes('-w') ? true : false
}

/**
 * @returns {esbuild.BuildOptions}
 */
const esbuildConfig = () => {
  return {
    entryPoints: [
      ...glob.sync(`${config.compiler.src}/**/*.ts`)
    ],
    outbase: config.compiler.src,
    outdir: config.compiler.dist,
    platform: 'node',
    target: ['node16'],
    incremental: true
  }
}

const exec = promisify(execCallback)

const cleanDist = async () => {
  try {
    await rm(`${config.root}/${config.compiler.dist}`, { recursive: true })
  } catch { /* Do nothing */ }
}

const scriptsBuilder = async () => {
  const watcher = await esbuild.build(esbuildConfig())
  return watcher
}

const blogBuilder = async () => {
  try {
    const { stdout, stderr } = await exec(`node ${config.compiler.dist}/scripts/build.js --color`)
    if (stdout) {
      const output = stdout.split('\n').filter(line => line).join('\n')
      console.log(output)
    }
    if (stderr) console.error(stderr)
  } catch (err) {
    console.error(err)
  }
}

const main = async () => {
  await cleanDist()
  let scriptsWatcher = await scriptsBuilder()
  if (!options.watch) scriptsWatcher.rebuild.dispose()
  await blogBuilder()

  const initDuration = (Date.now() - startTs) / 1000
  console.log(`${c.green('[S]')} ${c.cyan(`${initDuration}s`)} Blog was built.`)

  if (options.watch) {
    const watcher = chokidar.watch([
      `${config.compiler.src}/**/*.ts`,
      `${config.blog.posts}/**/*.md`,
      '.blogconfig.js'
    ], {
      ignoreInitial: true
    })

    /**
     * @param {string} path
     * @param {string} desc
     * @param {() => Promise<void> | () => void} callback
     */
    const processTimer = async (path, desc, callback) => {
      const startTimer = Date.now()

      if (isAsyncFunction(callback)) await callback()
      else callback()

      const duration = ((Date.now() - startTimer) / 1000).toFixed(3)
      console.log(`${c.blue('[I]')} ${c.cyan(`${duration}s`)}`
        + ` ${c.yellow(path)} ${desc}. Blog was rebuilt.`)
    }

    watcher.on('add', async (path) => {
      processTimer(path, 'added', async () => {
        scriptsWatcher.rebuild.dispose()
        scriptsWatcher = await scriptsBuilder()
        await blogBuilder()
      })
    })

    watcher.on('unlink', async (path) => {
      processTimer(path, 'deleted', async () => {
        await cleanDist()
        scriptsWatcher.rebuild.dispose()
        scriptsWatcher = await scriptsBuilder()
        await blogBuilder()
      })
    })

    watcher.on('change', async (path) => {
      processTimer(path, 'changed', async () => {
        await scriptsWatcher.rebuild()
        await blogBuilder()
      })
    })

    process.on('SIGINT', async () => {
      scriptsWatcher.rebuild.dispose()
      await watcher.close()
      console.log(`${c.orange('[U]')} Ended by SIGINT.`)
    })

    process.on('uncaughtException', err => {
      console.log(err)
    })
  }
}

main()
