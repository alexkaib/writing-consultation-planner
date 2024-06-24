import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import config from '../../../config.json';
import styles from './TypeInfo.module.css';

import Input from '../../UI/Input/Input';

const typeInfo = props => {
  const audienceOptions = config.audiences.map(audience => (
    {value: audience, label: langStrings[props.language][audience]}
  ));

  return (
    <div className={styles.TypeInfoBox}>
    <div className={styles.MultiBox}>
      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].display_name_de}
        elementConfig={{
          id: 'name_de',
          type: 'text',
          value: props.typeInfo.name_de,
          maxLength: 30,
          placeholder: langStrings[props.language].display_name_de,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].display_name_en}
        elementConfig={{
          id: 'name_en',
          type: 'text',
          value: props.typeInfo.name_en,
          maxLength: 30,
          placeholder: langStrings[props.language].display_name_en,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='select'
        label={'Zielgruppe'}
        id='audience'
        options={audienceOptions}
        defaultValue={props.typeInfo.audience}
        onChange={props.inputHandler}
        value={props.typeInfo.audience}/>
      </div>

      <div className={styles.MediumText}>
      <Input
        language={props.language}
        inputtype='textarea'
        label={langStrings[props.language].display_info_de}
        elementConfig={{
          id: 'info_de',
          type: 'text',
          value: props.typeInfo.info_de,
          maxLength: 200,
          placeholder: langStrings[props.language].display_info_de,
          onChange: props.inputHandler
        }}/>
      </div>

      <div className={styles.MediumText}>
      <Input
        language={props.language}
        inputtype='textarea'
        label={langStrings[props.language].display_info_en}
        elementConfig={{
          id: 'info_en',
          type: 'text',
          value: props.typeInfo.info_en,
          maxLength: 200,
          placeholder: langStrings[props.language].display_info_en,
          onChange: props.inputHandler
        }}/>
      </div>

      <div className={styles.MultiBox}>
        <Input
          language={props.language}
          inputtype='inputWithText'
          additionalText={langStrings[props.language].days_before_appointment}
          label={langStrings[props.language].min_reg_window}
          elementConfig={{
            id: 'min_date',
            type: 'number',
            value: props.typeInfo.min_date,
            onChange: props.inputHandler
          }}/>

        <Input
          language={props.language}
          inputtype='inputWithText'
          additionalText={langStrings[props.language].days_before_appointment}
          label={langStrings[props.language].max_reg_window}
          elementConfig={{
            id: 'max_date',
            type: 'number',
            value: props.typeInfo.max_date,
            onChange: props.inputHandler
          }}/>
      </div>
      {/*
        <div className={styles.FormAndText}>
        <Input
          language={props.language}
          inputtype='input'
          label={"Max. Termine pro Tutor*in"}
          elementConfig={{
            id: 'maxSlotsPerTutor',
            type: 'number',
            value: props.info.maxSlotsPerTutor,
            onChange: props.inputHandler
          }}/>
          <p>pro Woche</p>
        </div>
        */}
      <div className={styles.LongText}>
      <Input
        language={props.language}
        inputtype='textarea'
        label={langStrings[props.language].confirmation_mail}
        elementConfig={{
          id: 'confirmation_mail',
          type: 'text',
          value: props.typeInfo.confirmation_mail,
          maxLength: 2000,
          placeholder: langStrings[props.language].confirmation_mail,
          onChange: props.inputHandler
        }}/>
      </div>
      {/*
      <div className={styles.MultiBox}>
      <Input
        inputtype='select'
        id='sendCalendarInvite'
        label={langStrings[props.language].send_cal_invite}
        options={[
          {value: true, label: langStrings[props.language].yes},
          {value: false, label: langStrings[props.language].no}
        ]}
        onChange={props.inputHandler}
        />
      </div>
      */}
      <div className={styles.LongText}>
      <Input
        language={props.language}
        inputtype='textarea'
        label={langStrings[props.language].evaluation_mail}
        elementConfig={{
          id: 'eval_mail',
          type: 'text',
          value: props.typeInfo.eval_mail,
          maxLength: 2000,
          placeholder: langStrings[props.language].evaluation_mail,
          onChange: props.inputHandler
        }}/>
      </div>
    </div>
  )
}

export default typeInfo;
