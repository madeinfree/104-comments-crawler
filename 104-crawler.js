import config from './config.json'

import Koa from 'koa'

require('es6-promise').polyfill()
require('isomorphic-fetch')

const jobnoReg = /\??jobno=([a-z0-9]*)\&?/g
const jobNameFirst = /<h1>.*.<\/h1>/g
const jobName = /(<h1>)[^abc]*\s{1}[^<]./g
const jobNameUseLogo = /<h1>[^abc]*.*<a/g
const jobStringName = /jobsource=".*<\/a>/g

const app = new Koa()

let arr = [];

app.use(async (ctx, next) => {
  arr.length = 0
  let first, first2Json, first2JsonResult, first2JsonResultResult1, second, last
  first = await fetch(`http://www.104.com.tw/jobbank/custjob/index.php?j=${ctx.request.query.c}&page=${ctx.request.query.p}`).then((res) => res)
  // first2Json = await first.json().then((result) => { return result })
  // await first2Json.json().then((result) => { first2JsonResult = result } )
  first2JsonResultResult1 = await first.text().then((result) => result)
  // console.log(first2JsonResultResult1)
  //name number
  const nos = first2JsonResultResult1.match(jobnoReg)

  //Compony name
  var nameMatch = undefined;
  const nameMatchFirst = first2JsonResultResult1.match(jobNameFirst)

  if(nameMatchFirst[0].indexOf('href') !== -1) {
    nameMatch = nameMatchFirst[0].match(jobNameUseLogo)
  } else {
    nameMatch = nameMatchFirst[0].match(jobName)
  }

  const StringNameMatch = first2JsonResultResult1.match(jobStringName)
  const name = nameMatch[0].split('<h1>')[1]
  const name2 = name.split('</h1>')[0]

  const jobNos = nos.map((no) => {
    return no.split('=')[1].slice(0,5)
  })

  const allJobStringName = StringNameMatch.map((stringName) => {
    const stringName2 = stringName.split('title="')[1]
    return stringName2.split('"')[0]
  })
  const mergeJobNoAndJobName = jobNos.map((no, index) => {
    return {
      jobNo: jobNos[index],
      jobName: allJobStringName[index]
    }
  })


  for(let i = 0; i < mergeJobNoAndJobName.length ; i++) {
    let name = mergeJobNoAndJobName[i].jobName
    let jobNo = mergeJobNoAndJobName[i].jobNo
    let apiUrl = `${config['api']['job']}?company_name=${encodeURI(name2.trim())}&job_name=${encodeURI(name)}&e04_job_no=${jobNo}&eeee_job_no=null`;
    let respond = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    let respondJson = await respond.json()
    let result = await fetch(`${config['api']['comments']}`, {
      headers: {
        "Content-Type": "application/json",
        "x-job-id": respondJson.id
      }
    })
    const rr = await result.json()
    if(rr[0] !== undefined && !res.errorMessage) {
      arr.push(rr[0])
    } else {
      console.log('error or timeout')
    }
  }

  await setBody(ctx, next, arr)
})

const setBody = (ctx, next, arr) => {
  ctx.status = 200
  ctx.body = arr
}

app.listen('10004')
