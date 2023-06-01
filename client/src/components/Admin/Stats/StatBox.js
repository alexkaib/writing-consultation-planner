import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

import styles from './StatBox.module.css';

const statBox = (props) => {
  const month_dict = {
    1: "Januar",
    2: "Februar",
    3: "März",
    4: "April",
    5: "Mai",
    6: "Juni",
    7: "Juli",
    8: "August",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Dezember",
  }

  for (var i = 0; i < props.stats.length; i++) {
    props.stats[i].month = month_dict[props.stats[i].month];
  }

  return (
    <AuxComp>
    <div className={styles.Container}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={props.stats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis type="number" domain={['auto', 80]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="offered" name="angeboten" stroke="#ccc" />
          <Line type="monotone" dataKey="appointments" name="gebucht" stroke="#8884d8" />
          <Line type="monotone" dataKey="protocols" name="protokolliert" stroke="#82ca9d" />
          <Line type="monotone" dataKey="noshows" name="nicht erschienene RS" stroke="#ff8e47" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </AuxComp>
  );
}

export default statBox;
