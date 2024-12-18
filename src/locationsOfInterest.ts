export default [
  {
    date: new Date(2023, 10, 1),
    dateString: "Nov 1",
    label: "November 1, 2023",
    info: `
        <p>
          Because the TEMPO instrument measures sunlight reflected and scattered from Earth’s 
        surface and atmosphere, it can’t “see” through the clouds&mdash;so these
        areas appear blank on the map.
        </p>
        <p>
          But right away you’ll see that there 
        are high concentrations of NO<sub>2</sub> around many urban centers, 
        and sometimes along major highways.
        </p>
        `,
    locations: [
      {
        latlng: [34.359786, -111.700124],
        zoom: 7,
        text: "Arizona Urban Traffic and Fires",
        time: "2023-11-01T14:22:00.000Z",
        description:
          "<p>NO<sub>2</sub> increases during daily rush hour. In Phoenix, notice the high levels of NO<sub>2</sub> early in the morning, dip down during the day, then start to build back up during the evening commute.</p><p>Fires can be seen between Phoenix and Flagstaff. These are most easily identified as hot spots of NO<sub>2</sub> that appear quickly.</p>",
      },
      {
        latlng: [36.1716, -115.1391],
        zoom: 7,
        text: "Las Vegas: Fairly Constant Levels All Day",
        time: "2023-11-01T14:22:00.000Z",
        description:
          "<p>In this data Las Vegas has less daily variation than many other cities.</p>",
      },
    ],
  },
  {
    date: new Date(2023, 10, 3),
    dateString: "Nov 3",
    label: "November 3, 2023",
    info: `
        Levels of NO<sub>2</sub> change quickly from day to day, 
        and even from hour to hour as wind transports 
        plumes of pollution.
        `,
    locations: [
      {
        latlng: [36.215934, -119.7775],
        zoom: 6,
        text: "California Traffic and Agriculture",
        time: "2023-11-03T14:22:00.000Z",
        description:
          "<p>Los Angeles clearly stands out. NO<sub>2</sub> values are even higher than the maximum of our color bar. You can clearly see the highways including Route 10 between San Bernardino and Mexicali and Route 15 leading from San Bernardino towards Las Vegas. A significant amount of NO<sub>2</sub> in California&rsquo;s central valley is a byproduct of agricultural activity there. Excess fertilizer in the soil gets broken down by microbes to produce nitrogen oxides which are very reactive. Emissions that don&rsquo;t come from combustion are typically much harder to see, but the Central Valley is an area where TEMPO data may reveal this agricultural source of pollution.</p>",
      },
      {
        latlng: [41.85726, -80.531177],
        zoom: 5,
        text: "Northeast: Large Emissions Plumes",
        time: "2023-11-03T12:22:00.000Z",
        description:
          "<p>Air pollution is often transported, or moved, over great distances. In this data set large plumes can be seen over the Northeast. If you look closely you can see that many of these plumes appear to originate out of cities in the midwest including Nashville, St. Louis, and Memphis.</p>",
      },
    ],
  },
  {
    date: new Date(2024, 2, 28),
    dateString: "Mar 28",
    label: "March 28, 2024",
    info: `
        Breathing air with a high concentration of NO<sub>2</sub>, 
        and the resulting smog it forms when it reacts with other pollutants, 
        can irritate human respiratory systems. 
        People with asthma, as well as children and the elderly, 
        are generally at greater risk for the health effects of air pollution. 
        TEMPO data can help communities make informed 
        decisions and take action to improve air quality.
        `,
    locations: [
      {
        latlng: [31.938392, -99.095785],
        zoom: 6,
        text: "Texas Oil and Gas Production",
        time: "2024-03-28T13:04:00.000Z",
        description:
          "<p>The Permian basin, near Odessa, has two large plumes of NO2. This is the largest oil and gas producing area in the USA. You can also see here how pollution from a source in one state (Texas) can be transported across state lines to New Mexico.</p>",
      },
      {
        latlng: [31.331933, -91.575283],
        zoom: 8,
        text: "LA/MS Fires",
        time: "2024-03-28T16:44:00.000Z",
        description:
          "<p>Two fires can be seen popping up south and east of Alexandria. These are most easily identified as hot spots of NO2 that appear quickly.</p>",
      },
    ],
  }, // Mar 28
];
