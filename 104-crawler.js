require('es6-promise').polyfill()
require('isomorphic-fetch')

const jobnoReg = /\??jobno=([a-z0-9]*)\&?/g
const jobNameFirst = /<h1>.*.<\/h1>/g
const jobName = /(<h1>)[^abc]*\s{1}[^<]./g
const jobNameUseLogo = /<h1>[^abc]*.*<a/g
const jobStringName = /jobsource=".*<\/a>/g

fetch(`http://www.104.com.tw/jobbank/custjob/index.php?j=${process.env.ID_104}&page=${process.env.PAGE_104}`)
  .then((res) => {
    res.text().then((result) => {
      //name number
      const nos = result.match(jobnoReg)

      //Compony name
      var nameMatch = undefined;
      const nameMatchFirst = result.match(jobNameFirst)
      if(nameMatchFirst[0].indexOf('href') !== -1) {
        nameMatch = nameMatchFirst[0].match(jobNameUseLogo)
      } else {
        nameMatch = nameMatchFirst[0].match(jobName)
      }
      const StringNameMatch = result.match(jobStringName)
      const name = nameMatch[0].split('<h1>')[1]
      const name2 = name.split('</h1>')[0]
      const jobNos = nos.map((no) => {
        return no.split('=')[1].slice(0,5)
      })
      const allJobStringName = StringNameMatch.map((stringName) => {
        const stringName2 = stringName.split('title="')[1]
        return stringName2.split('"')[0]
      })
      // console.log(name.trim(), allJobStringName[0], jobNos[0])
      allJobStringName.forEach((n, index) => {
        console.log(`fetch-${index}: `, `${process.env.API_104}?company_name=${name2.trim()}&job_name=${allJobStringName[index].trim()}&e04_job_no=${jobNos[index].trim()}&eeee_job_no=null`)
        fetchId(index, name2.trim(), allJobStringName[index], jobNos[index])
      })
    })
  })

const fetchId = (index, name, jobName, jobno) => {
  fetch(`${process.env.API_104}?company_name=${encodeURI(name)}&job_name=${encodeURI(jobName)}&e04_job_no=${jobno}&eeee_job_no=null`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      res.json().then((result) => {
        fetch(`${process.env.API_C_104}`, {
          headers: {
            "Content-Type": "application/json",
            "x-job-id": result.id
          }
        }).then((res) => {
          console.log(`fetch-${index}`, result.id)
          res.json().then((r) => {
            console.log(r)
          })
        }, (err) => console.log(err))
      })
    }, (err) => {
      console.log(err)
    })
}
