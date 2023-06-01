import React, { Component } from 'react';

class SubmitSuccess extends Component {
  render(){
    return(
      <div>
        <h1>Termin bestätigt</h1>
        <p>Dein Termin wurde erfolgreich reserviert. Du erhältst in den nächsten Minuten eine automatische Bestätigungsmail mit weiteren Informationen zur Beratung.</p>
        <p>Solltest du keine Mail erhalten, kontaktiere bitte schreibzentrum@dlist.uni-frankfurt.de.</p>
      </div>
    )
  }
}

export default SubmitSuccess;
