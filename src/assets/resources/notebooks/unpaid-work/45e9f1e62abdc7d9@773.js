// https://observablehq.com/@donmccurdy/unpaid-work@773
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["VIZ5_2020_April - Unpaid Work.csv",new URL("./files/a368475f89c75557fdbc68ac8be390c362fd32255a91c30e632096b97c5f6bda4fc51fcecd8be211b306d3fefb961e85396049ae1d3f3940e12d065c5892431a",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Unpaid Work

[Week 14, 2020](https://data.world/makeovermonday/2020w14) of [#MakeoverMonday](https://data.world/makeovermonday). I intended for this to be a bit of practice with different styles of visualization; it ended up being mostly a deep-dive into [dataframe.js](https://gmousse.gitbooks.io/dataframe-js/#dataframe-js), which I hadn't used before. Most time was spent data cleaning, discovering and resolving a few issues mentioned below. Got a bit more comfortable with dataframe.js by the end of the visualization, but probably should have just formatted the data in another tool before bringing it into JavaScript, in retrospect.

- Original visualization: [Unpaid work: Allocation of time and time-use](https://unstats.un.org/unsd/gender/timeuse/index.html)
- Data source: [UN Stats](https://unstats.un.org/unsd/gender/timeuse/index.html)
`
)});
  main.variable(observer("summary")).define("summary", ["md","dfPercent"], function(md,dfPercent){return(
md`## Share of paid and unpaid work

On an average day, in an average country worldwide, women spend ${

  Math.round(100 *
             (dfPercent.stat.mean('WomenPaidTime') + dfPercent.stat.mean('WomenUnpaidTime')) / 
             (dfPercent.stat.mean('MenPaidTime') + dfPercent.stat.mean('MenUnpaidTime'))) - 100

}% more time working then men. Despite that, women's work is disproportionately unpaid labor(${

  Math.round(100 *
             dfPercent.stat.mean('WomenUnpaidTime') /
             (dfPercent.stat.mean('WomenPaidTime') + dfPercent.stat.mean('WomenUnpaidTime')))

}% of total hours), such as domestic and care efforts. Men's work, by contrast, is only rarely unpaid (${

  Math.round(100 *
             dfPercent.stat.mean('MenUnpaidTime') /
             (dfPercent.stat.mean('MenPaidTime') + dfPercent.stat.mean('MenUnpaidTime')))

}% of total hours).

*For the purposes of this [UNSD study](https://unstats.un.org/unsd/gender/timeuse/index.html), subsistence labor is counted as paid labor. These statistics are related to SDG indicator 5.4.1 – "Time spent on unpaid domestic and care work, by sex, age and location."*
`
)});
  main.variable(observer()).define(["md","dfPercent"], function(md,dfPercent){return(
md`| | Men (avg) | Women (avg) |
|-|-----|-------|
| Paid | ${ dfPercent.stat.mean('MenPaidTime').toFixed(2) } hours | ${ dfPercent.stat.mean('WomenPaidTime').toFixed(2) } hours |
| Unpaid | ${ dfPercent.stat.mean('MenUnpaidTime').toFixed(2) } hours | ${ dfPercent.stat.mean('WomenUnpaidTime').toFixed(2) } hours |

***`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`<center><h3>Share of paid and unpaid work, by gender</h3></center>`
)});
  main.variable(observer("main")).define("main", ["createGenderPercentChart"], function(createGenderPercentChart){return(
createGenderPercentChart('Women')
)});
  main.variable(observer("createGenderPercentChart")).define("createGenderPercentChart", ["dfPercent","createBarChart","PALETTE"], function(dfPercent,createBarChart,PALETTE){return(
function createGenderPercentChart(gender) {
  const _df = dfPercent
    .sortBy('WomenPaidPercent');

  return createBarChart({

    labels: _df.select('Country', 'Code', 'Flag')
      .dropDuplicates()
      .toCollection()
      .map((d) => d.Country + ' ' + d.Flag),

    datasets: [
      {
        label: 'Unpaid (Men)',
        data: _df.toCollection().map((d) => d.MenUnpaidPercent),
        backgroundColor: PALETTE[2],
      },
      {
        label: 'Paid (Men)',
        data: _df.toCollection().map((d) => d.MenPaidPercent),
        backgroundColor: PALETTE[4],
      },
      {
        label: 'Paid (Women)',
        data: _df.toCollection().map((d) => d.WomenPaidPercent),
        backgroundColor: PALETTE[5],
      },
      {
        label: 'Unpaid (Women)',
        data: _df.toCollection().map((d) => d.WomenUnpaidPercent),
        backgroundColor: PALETTE[3]
      }
    ]

  }, '%');
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Hours`
)});
  main.variable(observer()).define(["createGenderChart"], function(createGenderChart){return(
createGenderChart('Men')
)});
  main.variable(observer()).define(["createGenderChart"], function(createGenderChart){return(
createGenderChart('Women')
)});
  main.variable(observer("createGenderChart")).define("createGenderChart", ["df","PALETTE","createBarChart"], function(df,PALETTE,createBarChart){return(
function createGenderChart(gender) {
  const _df = df
    .filter((d) => d.get('Gender') === gender)
    .sortBy('Country');
  const header = _df.select('Country', 'Code', 'Flag').dropDuplicates().toCollection();
  const paidDataset = {label: 'Paid', data: [], backgroundColor: PALETTE[1]};
  const unpaidDataset = {label: 'Unpaid', data: [], backgroundColor: PALETTE[2]};
  const datasets = _df.toCollection()
    .forEach((d) => {
      if (d.TimeUse.startsWith('Paid')) {
        paidDataset.data.push(d.AvgTime);
        return;
      }
      unpaidDataset.data.push(d.AvgTime);
    });
  return createBarChart({
    labels: header.map((d) => d.Country + ' ' + d.Flag),
    datasets: [paidDataset, unpaidDataset]
  }, 'hours');
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Notes

**Resources:**

- Country names, codes, and flag emoji: [country-emoji](https://github.com/meeDamian/country-emoji)
- [DataFrame.js](https://gmousse.gitbooks.io/dataframe-js/#dataframe-js)

**Fixed:**
- [x] ~~Omit a bad study in Argentina.~~
- [x] ~~Omit Malaysia, with no useable data.~~
- [x] ~~Data got corrupted, had to re-run from the top.~~
- [x] ~~Labels for last ~2 countries don't seem to fit on the page.~~`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data cleaning`
)});
  main.variable(observer()).define(["df"], function(df){return(
df.show(15)
)});
  main.variable(observer("df")).define("df", ["dfCleaned"], function(dfCleaned){return(
dfCleaned
)});
  main.variable(observer("dfPercent")).define("dfPercent", ["dfCleaned"], function(dfCleaned)
{
  const paidTime = (group, gender) => group
      .filter((d) => d.get('Gender') === gender && d.get('TimeUse') === 'Paid')
      .getRow(0).get('AvgTime');
  const unpaidTime = (group, gender) => group
      .filter((d) => d.get('Gender') === gender && d.get('TimeUse') === 'Unpaid')
      .getRow(0).get('AvgTime');
  const totalTime = (group, gender) => group
      .filter((d) => d.get('Gender') === gender)
      .stat.sum('AvgTime');

  const _df = dfCleaned
    .groupBy('Country')
    .aggregate((g) => ({
      Country: g.getRow(0).get('Country'),
      Code: g.getRow(0).get('Code'),
      Flag: g.getRow(0).get('Flag'),
      MenPaidTime: paidTime(g, 'Men'),
      MenUnpaidTime: unpaidTime(g, 'Men'),
      MenPaidPercent: 100 * paidTime(g, 'Men') / totalTime(g, 'Men'),
      MenUnpaidPercent: 100 * unpaidTime(g, 'Men') / totalTime(g, 'Men'),
      WomenPaidTime: paidTime(g, 'Women'),
      WomenUnpaidTime: unpaidTime(g, 'Women'),
      WomenPaidPercent: 100 * paidTime(g, 'Women') / totalTime(g, 'Women'),
      WomenUnpaidPercent: 100 * unpaidTime(g, 'Women') / totalTime(g, 'Women'),
     }), 'GroupStats')
    .map((d) => d
         .set('Country', d.get('GroupStats').Country)
         .set('Code', d.get('GroupStats').Code)
         .set('Flag', d.get('GroupStats').Flag)
         .set('MenPaidTime', Number(d.get('GroupStats').MenPaidTime.toFixed(2)))
         .set('MenUnpaidTime', Number(d.get('GroupStats').MenUnpaidTime.toFixed(2)))
         .set('MenPaidPercent', Number(d.get('GroupStats').MenPaidPercent.toFixed(2)))
         .set('MenUnpaidPercent', Number(d.get('GroupStats').MenUnpaidPercent.toFixed(2)))
         .set('WomenPaidTime', Number(d.get('GroupStats').WomenPaidTime.toFixed(2)))
         .set('WomenUnpaidTime', Number(d.get('GroupStats').WomenUnpaidTime.toFixed(2)))
         .set('WomenPaidPercent', Number(d.get('GroupStats').WomenPaidPercent.toFixed(2)))
         .set('WomenUnpaidPercent', Number(d.get('GroupStats').WomenUnpaidPercent.toFixed(2)))
         .delete('GroupStats'));

  return _df;
}
);
  main.variable(observer("dfCleaned")).define("dfCleaned", ["dfRaw"], function(dfRaw)
{
  let _df = dfRaw
    // Omit the partial 18+ study in Argentina.
    .filter((d) => d.get('Country') !== 'Argentina' || d.get('Age') !== '18+')
    // Omit Malaysia, which has no paid data.
    .filter((d) => d.get('Country') !== 'Malaysia')
  
    // Filter to prefer studies focused on adults.
    .sortBy('Age', 'DESC')
    .dropDuplicates('Country', 'TimeUse', 'Gender', 'Area', 'Year')
  
    // Filter to prefer more recent studies.
    .sortBy('Year', 'DESC')
    .dropDuplicates('Country', 'TimeUse', 'Gender', 'Area')
    .withColumn('RowKey', (d) => [d.get('Country'), d.get('TimeUse'), d.get('Gender')].join(':'));
  
  // Group rows that are equivalent other than Area; compute average time for that group.
  let _groupAvg = _df
    .sortBy('Area', 'DESC')
    .groupBy('RowKey')
    .aggregate((d) => d.stat.mean('AvgTime'), '_AvgTime')
  
  // Re-associate the average times with original rows, and format.
  return _df
    .innerJoin(_groupAvg, ['RowKey', 'RowKey'])
    .drop('AvgTime')
    .dropDuplicates('RowKey')
    .rename('_AvgTime', 'AvgTime')
    .select('Country', 'Code', 'Flag', 'Year', 'Gender', 'TimeUse', 'AvgTime');
}
);
  main.variable(observer("dfRaw")).define("dfRaw", ["d3","FileAttachment","countryEmoji","DF"], async function(d3,FileAttachment,countryEmoji,DF)
{
  let rows = d3.csvParse(await FileAttachment('VIZ5_2020_April - Unpaid Work.csv').text());
  
  // Name normalization.
  const nameConversions = ({
    'Iran (Islamic Republic of)': 'Iran',
    'China, Hong Kong Special Administrative Region': 'Hong Kong',
    'Republic of Korea': 'Korea, Republic of',
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
    'The former Yugoslav Republic of Macedonia': 'Macedonia',
    'United Republic of Tanzania': 'Tanzania',
    'Republic of Moldova': 'Moldova',
    'Bolivia (Plurinational State of)': 'Bolivia',
    'Lao People\'s Democratic Republic': 'Lao',
    'United States of America': 'United States',
    'R�union': 'Reunion'
  });
  
  // Normalize country names, giving us two-letter codes and flags.
  rows.forEach((row) => {
    row.Country = nameConversions[row.Country] || row.Country;
    row.Code = countryEmoji.code(row.Country);
    row.Flag = countryEmoji.flag(row.Code);
    if (!row.Code) throw new Error('Could not find country: ' + row.Country);
  });
  
  rows.forEach((row) => {
    row['Time use'] = row['Time use'].startsWith('Paid') ? 'Paid' : 'Unpaid';
  });
  
  return new DF.DataFrame(rows)
    .drop('Survey Availability')
    .rename('Time use', 'TimeUse')
    .rename('Average Time (hours)', 'AvgTime')
    .dropMissingValues(['AvgTime']);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Helpers`
)});
  main.variable(observer("createBarChart")).define("createBarChart", ["Chart","commas"], function(Chart,commas){return(
function createBarChart(data, units = '') {
  const canvasEl = document.createElement('canvas');
  canvasEl.height = 500;
  const ctx = canvasEl.getContext('2d');
  const chart = new Chart(ctx, {
      type: 'horizontalBar',
      data,
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            beginAtZero: true,
            ticks: {
              display: false,
              // callback: (value) => commas(value) + `${units}`
            }
          }],
          yAxes: [{
            beginAtZero: true,
            stacked: true,
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label;
              const v = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return label + ': ' + commas(v) + `${units}`;
            }
          }
        }
      }
  });
  return canvasEl;
}
)});
  main.variable(observer("commas")).define("commas", function(){return(
function commas(x) {
    return x;//.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Dependencies`
)});
  main.variable(observer("PALETTE")).define("PALETTE", function(){return(
['#ffffcc','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84']
)});
  main.variable(observer("Chart")).define("Chart", ["require"], async function(require)
{
  const _Chart = await require('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.js');
  // _Chart.defaults.global.tooltipTemplate = '<%= commas(value) %>';
  _Chart.defaults.global.scaleLabel = "<%=parseInt(value).toLocaleString()%>";
  _Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%=value.toLocaleString()%>";
  return _Chart;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("DF")).define("DF", ["require"], function(require){return(
require('https://bundle.run/dataframe-js@1.4.3')
)});
  main.variable(observer("countryEmoji")).define("countryEmoji", ["require"], function(require){return(
require('https://bundle.run/country-emoji@1.5.0')
)});
  return main;
}
