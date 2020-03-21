const { grd } = require('./connectors/guardian')
const csvParser = require('json2csv').Parser 
const fs = require('fs')

async function main() {
  // get articles
  const json = await grd.get({ q: 'market' })

  // => [{ title, date, year, month, day, section }]

  // TODO NOTE months are 1-indexed: 1 is JANUARY
  let rs = json.response.results
  rs = rs.map(r => {
    const d = new Date(r.webPublicationDate)
    return {
      // TODO map month to SINE
      title: r.webTitle,
      // year: d.getFullYear(),
      // month: d.getMonth() + 1,
      // day: d.getDate(),
      // millis: d.getTime(), // use this temporarily
      // TODO daytime??
      section: r.sectionName.toLowerCase()
    }
  })

  const csvfields = ['title', 'section']
  const csvvalues = rs 

  const json2csvParser = new csvParser({ fields: csvfields });
  const csv = json2csvParser.parse(csvvalues)

  console.log(csv)
  fs.writeFileSync('./python/demoin.csv', csv)
  console.log("Wrote csv to python/demoin.csv")
}

main()

