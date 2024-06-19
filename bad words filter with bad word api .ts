// API key endpoint
const apiKey: string = "rXGRfZn78cXshgcn87zLM8karS73LiN1";
// API endpoint for bad words
const badwordsapi: string = "https://api.apilayer.com/bad_words?censor_character=*";

let delayTimer: NodeJS.Timeout | null;
let lastFilteredContent: string = "";

// Function to delay filtering content after user input
function delayFilterContent(value: string): void {
  if (delayTimer) {
    clearTimeout(delayTimer);
  }
  delayTimer = setTimeout(() => {
    if (value !== lastFilteredContent) {
      lastFilteredContent = value;
      // Perform filtering after delay
      performFiltering(value);
    }
    // Delay of 500 milliseconds (0.5 seconds)
  }, 500);
}

// Function to perform content filtering using the API
function performFiltering(content: string): void {
  const myHeaders: Headers = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // Set the API key in request headers
  myHeaders.append("apikey", apiKey);

  const raw: string = JSON.stringify({ "content": content });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Make a fetch request to the bad words API
  fetch(badwordsapi, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Convert content to lowercase for comparison
      let filteredContent: string = content.toLowerCase();

      // Replace bad words with asterisks in filtered content
      result.bad_words_list.forEach((item: { original: string }) => {
        const originalWord: string = item.original.toLowerCase();
        const censoredWord: string = '*'.repeat(originalWord.length);
        const regex: RegExp = new RegExp(`\\b${escapeRegExp(originalWord)}\\b`, "gi");
        filteredContent = filteredContent.replace(regex, censoredWord);
      });

      // Update input value with filtered content if changes detected
      if (filteredContent !== content.toLowerCase()) {
        const contentInput: HTMLInputElement | null = document.getElementById("contentInput") as HTMLInputElement;
        if (contentInput) {
          contentInput.value = filteredContent;
        }
        // Alert for inappropriate language detection
        alert("Please refrain from using inappropriate language.");
      }
    })
    // Log any errors encountered
    .catch(error => console.error('Error:', error));
}

// Function to escape special characters in regex
function escapeRegExp(string: string): string {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
