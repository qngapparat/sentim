const { grd } = require('./connectors/guardian')

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
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      millis: d.getTime(), // use this temporarily
      // TODO daytime??
      section: r.sectionName.toLowerCase()
    }
  })

  console.log(rs)
}

main()

