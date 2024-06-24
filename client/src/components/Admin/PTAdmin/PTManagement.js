import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import Button from '../../UI/Button/Button';

import styles from './PTManagement.module.css';
// test values
/*
const ptInfo = [
  [1, 'John Doe', "doejoe@test.de", "Amerikanistik", "pt_role"],
  [2, 'Mary Mayor', "mm-uni@gmail.com", "Wirtschaftswissenschaften", "pt_role"],
  [3, 'Teddy Quentin', "bla@bla.com", "Ethnologie", "pt_role"],
];
*/
const ptManagement = props => {

  return (
    <div className={styles.Container}>

      <div className={styles.Box}>
        <h2>{langStrings[props.language]["pt_management_heading"]}</h2>
        <p>{langStrings[props.language]["pt_management_desc"]}</p>
        <table>
        <thead>
          <tr>
            <th>{langStrings[props.language]['name']}</th>
            <th>{langStrings[props.language]['email']}</th>
            <th>{langStrings[props.language]['subject']}</th>
            <th>{langStrings[props.language]['role']}</th>
          </tr>
        </thead>
        <tbody>
          {
            props.tutors.map(row => (
              <tr
                key={row['ptId']}
                className={styles.TutorRows}
                onClick={() => props.editTutorHandler(row)}>

                <td>{row['firstName']} {row['lastName']}</td>
                <td>{row['email']}</td>
                <td>{row['subjects']}</td>
                <td>{langStrings[props.language][row['role']]}</td>
                <td><Button>{langStrings[props.language]['edit']}</Button></td>
              </tr>
            ))
          }
        </tbody>
        </table>
        <Button buttonHandler={props.addTutorHandler}>{langStrings[props.language]['add_tutor']}</Button>
      </div>

    </div>
  )
}

export default ptManagement;
