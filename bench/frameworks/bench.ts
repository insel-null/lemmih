/* eslint-disable ts/no-unsafe-function-type */
/* eslint-disable ts/no-unsafe-call */
/* eslint-disable antfu/no-top-level-await */
/* eslint-disable @masknet/no-top-level */
/* eslint-disable no-console */
/* eslint-disable @masknet/string-no-interpolation */
import process from 'node:process'

import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'

import killPort from 'kill-port'

const time = 10

const commands = [
  `bombardier --fasthttp -c 500 -d ${time}s http://127.0.0.1:3000/`,
  `bombardier --fasthttp -c 500 -d ${time}s http://127.0.0.1:3000/id/1?name=bun`,
  `bombardier --fasthttp -c 500 -d ${time}s -m POST -H 'Content-Type:application/json' -f ./bench/frameworks/body.json http://127.0.0.1:3000/json`,
] as const

const runtimeCommand = {
  bun: 'bun',
  deno: 'deno run --allow-net --allow-env',
  node: 'node',
} as const

const catchNumber = /Reqs\/sec\s+(\d+[.|,]\d+)/
const format = (value: number | string) =>
  Intl.NumberFormat('en-US').format(+value)
// eslint-disable-next-line @masknet/prefer-timer-id
const sleep = async (s = 1) => new Promise(resolve => setTimeout(resolve, s * 1000))

const toNumber = (a: string) => +a.replaceAll(',', '')

const secToMin = (seconds: number) =>
  `${Math.floor(seconds / 60)
  }:${
    seconds % 60 < 10 ? '0' : ''
  }${seconds % 60}`

// Fetch with retry
const retryFetch = async (
  url: string,
  options?: RequestInit,
  time = 0,
  resolveEnd?: Function,
  rejectEnd?: Function,
) => {
  return new Promise<Response>((resolve, reject) => {
    fetch(url, options)
      .then((a) => {
        if (resolveEnd)
          resolveEnd(a)

        resolve(a)
      })
      .catch((e) => {
        if (time > 7) {
          if (rejectEnd)
            rejectEnd(e)

          return reject(e)
        }
        // eslint-disable-next-line @masknet/prefer-timer-id
        setTimeout(
          // eslint-disable-next-line ts/no-misused-promises
          async () => retryFetch(url, options, time + 1, resolve, reject),
          200,
        )
      })
  })
}

const test = async () => {
  // try {
  const index = await retryFetch('http://127.0.0.1:3000/')

  if ((await index.text()) !== 'Hi')
    throw new Error('Index: Result not match')

  if (!index.headers.get('Content-Type')?.includes('text/plain'))
    throw new Error('Index: Content-Type not match')

  const query = await retryFetch('http://127.0.0.1:3000/id/1?name=bun')
  if ((await query.text()) !== '1 bun')
    throw new Error('Query: Result not match')

  if (!query.headers.get('Content-Type')?.includes('text/plain'))
    throw new Error('Query: Content-Type not match')

  if (!query.headers.get('X-Powered-By')?.includes('benchmark'))
    throw new Error('Query: X-Powered-By not match')

  const body = await retryFetch('http://127.0.0.1:3000/json', {
    body: JSON.stringify({
      hello: 'world',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if ((await body.text()) !== JSON.stringify({ hello: 'world' }))
    throw new Error('Body: Result not match')

  if (!body.headers.get('Content-Type')?.includes('application/json'))
    throw new Error('Body: Content-Type not match')
  // }
  // catch (error) {
  //   throw error
  // }
}

const spawn = (target: string, title = true) => {
  const [runtime, framework] = target.split('/') as [
    keyof typeof runtimeCommand,
    string,
  ]
  // if (index)
  //   framework += '/index'

  const name = framework.replace('/index', '')

  if (title) {
    console.log('\n', name)
    console.log(' >', runtime, framework, '\n')
  }

  // const file = existsSync(`./src/${runtime}/${framework}.ts`)
  //   ? `src/${runtime}/${framework}.ts`
  //   : `src/${runtime}/${framework}.js`
  const file = `./bench/frameworks/${framework}.ts`

  const server = Bun.spawn({
    cmd: [...runtimeCommand[runtime].split(' '), file],
    env: {
      ...Bun.env,
      NODE_ENV: 'production',
    },
  })

  return async () => {
    server.kill()
    await sleep(0.3)

    try {
      // await fetch('http://127.0.0.1:3000')
      // await sleep(0.6)
      // await fetch('http://127.0.0.1:3000')

      // await killPort(3000)
      await Bun.$`nix run nixpkgs#killport -- 3000`
    }
    catch {
      // Empty
    }
  }
}

// try {
//   if (lstatSync('results').isDirectory())
//     rimraf.sync('results')
// }
// catch {}
await Bun.$`rm -rf ./results`
mkdirSync('results')
writeFileSync('results/results.md', '')
const resultFile = Bun.file('results/results.md')
const result = resultFile.writer()

const main = async () => {
  try {
    await fetch('http://127.0.0.1:3000')
    await killPort(3000)
  }
  catch {
    // Empty
  }

  // const runtimes = <string[]>[]

  // let frameworks = readdirSync('src')
  //   .flatMap((runtime) => {
  //     if (!lstatSync(`src/${runtime}`).isDirectory())
  //       return

  //     if (!existsSync(`results/${runtime}`))
  //       mkdirSync(`results/${runtime}`)

  //     return readdirSync(`src/${runtime}`)
  //       .filter(
  //         a =>
  //           a.endsWith('.ts')
  //           || a.endsWith('.js')
  //           || !a.includes('.'),
  //       )
  //       .map(a =>
  //         a.includes('.')
  //           ? `${runtime}/${a.replace(/.(j|t)s$/, '')}`
  //           : `${runtime}/${a}/index`,
  //       )
  //       .filter(
  //         a =>
  //           !blacklists.includes(a as (typeof blacklists)[number]),
  //       )
  //   })
  //   .filter(x => x)
  //   .sort()
  const frameworks = [
    'bun/elysia',
    'bun/hono',
    'bun/itty-router-auto',
    'bun/itty-router',
    'bun/lemmih-bun',
    'bun/lemmih',
  ]

  // Overwrite test here
  // frameworks = whitelists?.length ? whitelists : frameworks

  console.log(`${frameworks.length} frameworks`)
  for (const framework of frameworks) console.log(`- ${framework}`)

  console.log('\nTest:')
  for (const target of frameworks) {
    const kill = spawn(target, false)

    const [runtime, framework] = target.split('/')
    await sleep(0.1)

    // if (runtimes.includes(runtime)) {
    //   const folder = `results/${runtime}`

    //   if (!lstatSync(folder).isDirectory())
    //     rimraf(folder)
    // }

    try {
      await test()

      console.log(`✅ ${framework} (${runtime})`)
    }
    catch (error) {
      console.log(`❌ ${framework} (${runtime})`)
      console.log('  ', (error as Error)?.message || error)

      frameworks.splice(frameworks.indexOf(target), 1)
    }
    finally {
      await kill()
    }
  }

  const estimateTime = frameworks.length * (commands.length * time + 1)

  console.log()
  console.log(`${frameworks.length} frameworks`)
  for (const framework of frameworks) console.log(`- ${framework}`)

  console.log(`\nEstimate time: ${secToMin(estimateTime)} min`)

  // process.exit()

  result.write(
    `
|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
`,
  )

  for (const target of frameworks) {
    const kill = spawn(target)

    const [runtime, framework] = target.split('/') as [
      keyof typeof runtimeCommand,
      string,
    ]

    const name = framework.replace('/index', '')

    // const frameworkResultFile = Bun.file(`results/${runtime}/${name}.txt`)
    const frameworkResultFile = Bun.file(`results/${name}.txt`)
    const frameworkResult = frameworkResultFile.writer()

    result.write(`| ${name} | ${runtime} `)

    // Wait .3 second for server to bootup
    await sleep(0.4)

    let content = ''
    const total = []

    for (const command of commands) {
      frameworkResult.write(`${command}\n`)

      console.log(command)

      const res = Bun.spawn({
        cmd: command.split(' '),
        env: Bun.env,
      })

      const stdout = await new Response(res.stdout).text()
      console.log(stdout)

      const results = catchNumber.exec(stdout)
      if (results?.[1] == null)
        continue

      content += `| ${format(results[1])} `
      total.push(toNumber(results[1]))

      // eslint-disable-next-line ts/restrict-template-expressions
      frameworkResult.write(`${results}\n`)
    }

    content
      = `| ${format(
        total.reduce((a, b) => +a + +b, 0) / commands.length,
      )} ${
        content
      }|\n`

    result.write(content)
    await result.flush()

    await kill()
  }
}

const arrange = () => {
  const table = readFileSync('results/results.md', {
    encoding: 'utf-8',
  })

  const orders = []

  const [title, divider, ...rows] = table.split('\n')
  for (const row of rows) {
    const data = row
      .replace(/ /g, '')
      .split('|')
      .filter(a => a)

    if (data.length !== commands.length + 3)
      continue

    const [name, runtime, total] = data
    orders.push({
      name,
      row,
      runtime,
      total: toNumber(total!),
    })
  }

  const content = [
    title,
    divider,
    ...orders.toSorted((a, b) => b.total - a.total).map(a => a.row),
  ].join('\n')

  console.log(content)
  writeFileSync('results/results.md', content)

  process.exit(0)
}

// eslint-disable-next-line ts/no-misused-promises
process.on('beforeExit', async () => {
  await killPort(3000)
})

await main().then(arrange)
