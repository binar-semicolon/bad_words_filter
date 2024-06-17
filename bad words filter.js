document.getElementById('textInput').addEventListener('input', function(event) {
  let inputText = event.target.value; 
  
  // Fetch data from JSON
  fetch('badwords.json')
    .then(response => response.json())
    .then(data => {
      let badwords = data.badwords;
      // do filters
      badwords.forEach(filter => {
        // Modify the regex to allow space characters
        let regex = new RegExp('\\b' + escapeRegExp(filter) + '\\b', 'gi');
         // Replace every occurrence of filter with a star (*)
        inputText = inputText.replace(regex, '*'.repeat(filter.length));
      });
      
      event.target.value = inputText;
    })
    .catch(error => console.error('Error fetching JSON:', error));
});

// Function to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
