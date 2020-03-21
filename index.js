const { grd } = require('./connectors/guardian')
const csvParser = require('json2csv').Parser
const fs = require('fs')

function grdSchemaToMySchema(json) {
  let rs = json.response.results
  rs = rs.map(r => {
    const d = new Date(r.webPublicationDate)
    return {
      // TODO map month to SINE      
      // TODO NOTE months are 1-indexed: 1 is JANUARY
      title: r.webTitle,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      millis: d.getTime(), // use this temporarily
      // TODO daytime??
      category: r.sectionName.toLowerCase()
    }
  })
  return rs
}

function writeCSV(fields, values, path, isFirst) {
  const json2csvParser = new csvParser({ 
    fields: fields,  
    header: isFirst // write header only on first run
  })
  const csv = json2csvParser.parse(values)

  if(isFirst) {
    fs.writeFileSync(path, csv)
  } 
  else {
    fs.writeFileSync(path, '\n', { flag: 'a'})
    fs.writeFileSync(path, csv, { flag: 'a'})
  }
  console.log(`Wrote ${values.length} values to ${path}, ${isFirst}`)
}

async function fetchandstore(currPage) {
  // Fetch JSON
  const json = await grd.get({
    'q': 'market',
    'page-size': 50,
    'page': currPage
  })
  // Convert it
  const myjson = grdSchemaToMySchema(json)
  const csvfields = ['title', 'category', 'year', 'month', 'day', 'millis']
  const csvvalues = myjson       
  // Append to CSV
  writeCSV(csvfields, csvvalues, './python/qmarketin500.csv', currPage === 1)
}


async function main() {
  for(let page = 1; page < 3000; page++) {
    await fetchandstore(page)
  }
}


// [ 1, 2, 3, ...]

main()