const haku = new XMLHttpRequest(); // New XMLHttp request object

//References to HTML
const theatreSelect = document.getElementById('theatre');
const movieList = document.getElementById('lista');

//Listener, which gets ID from dropdown menu
theatreSelect.addEventListener('change', function() {
  const theaterId = this.value;

  // URL which gets data according to selected theater ID
  const url = `https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`;

  //Makes GET request to it
  haku.open('GET', url, true);


  //Function on load
  haku.onload = function() {
    if (this.status === 200) { //Checks if request is successfull
      const response = haku.responseXML; //XML response
      const movies = response.getElementsByTagName('Show'); //Array of movie nodes

      //Placeholder empty string for nodes
      let movieHtml = '';

      //Loop for extraction
      for (let i = 0; i < movies.length; i++) {
        const title = movies[i].getElementsByTagName('Title')[0].childNodes[0].nodeValue; //Movie title
        const imageUrl = movies[i].getElementsByTagName('EventSmallImagePortrait')[0].childNodes[0].nodeValue; //Movie poster/image
        const startTime = movies[i].getElementsByTagName('dttmShowStart')[0].childNodes[0].nodeValue; //Movie start time

        // Formats time to be user friendly as well as in european/finnish format
        const start = new Date(startTime).toLocaleString('fi-FI', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });

        //Movie data to previously created string
        movieHtml += `<div><h3>${title}</h3><p>Start Time: ${start}</p><img src="${imageUrl}" alt="${title}"></div>`;
      }

      // Display in html
      movieList.innerHTML = movieHtml;
    } else {
      console.error('Error: ' + this.status); //Fullfilling else - would print error to console
    }
  };

  haku.send(); //Get request
});

// Theater GET request
haku.open('GET', 'https://www.finnkino.fi/xml/TheatreAreas/', true);

//Function on load
haku.onload = function() {
  if (this.status === 200) { //Request successfull?
    const response = haku.responseXML; //XML response
    const theatreAreas = response.getElementsByTagName('TheatreArea'); //Area nodes

    //Loop through nodes
    for (let i = 0; i < theatreAreas.length; i++) {
      const option = document.createElement('option'); 
      option.text = theatreAreas[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue;
      option.value = theatreAreas[i].getElementsByTagName('ID')[0].childNodes[0].nodeValue;
      theatreSelect.add(option); //Creates options to dropdown menu
    }
  } else {
    console.error('Error: ' + this.status); //Placeholder for if/else - would log error to console
  }
};

haku.send(); 