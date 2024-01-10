// app/javascript/packs/search.js
// import "axios"; // Import Axios based on the import map configuration

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('search_p');
  const searchResults = document.getElementById('searchResults');
  const suggestionDropdown = document.getElementById('suggestionDropdown');

  let debounceTimeout;

  // Function to handle immediate display of results
  function displayResults(query) {
    searchResults.innerHTML = `<p>${query}</p>`;
  }

  // Function to handle suggestion dropdown
  function displaySuggestions(suggestions) {
    suggestionDropdown.innerHTML = suggestions.map(suggestion => `<div>${suggestion}</div>`).join('');
    suggestionDropdown.style.display = suggestions.length > 0 ? 'block' : 'none';
  }

  // Use debouncing to delay the search execution
  function debouncedSearch(query) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      try {
        // Send the search query to the server using Axios
        const response = await axios.post('/search_queries', { query }, {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'json',
        });


        // Ensure there is a response before attempting to parse it
        const result = response.data;
        // displayResults(result.query);
        autoComplete(searchInput, result);
        // displaySuggestions(result.suggestions);
      } catch (error) {
        console.log(error);
      }
    }, 300); // Adjust the delay time as needed
  }

  // Event listener for debounced search
  searchInput.addEventListener('input', (event) => {
    event.preventDefault();
    const query = event.target.value.trim();
    debouncedSearch(query);
  });

});

const inp = document.getElementById("search_p");


const autoComplete = (input, arr) => {
  input.addEventListener("input", function(e) {
    e.preventDefault()
    let container_list,
      i,
      ul,
      list,
      val = this.value;

    closeAutoComplete();

    // create an element with a class "container_list"
    container_list = document.createElement("div");
    container_list.className = "container_list";
    ul = document.createElement("ul");
    ul.className = "container_list-wrapper";
    container_list.appendChild(ul);
    this.parentNode.appendChild(container_list);

    // when there's no value on the input, remove the list
    if (input.value.trim() == "") {
      container_list.parentNode.removeChild(container_list);
    }

    for (i = 0; i < arr.length; i++) {
      list = document.createElement("li");
      let data__list = arr[i].query;
      let data__value = arr[i].query;
      list.innerHTML = data__list;

      list.addEventListener("click", function(e) {
        input.value = data__value;
        closeAutoComplete();
      });
      // append "li" to the "ul"
      ul.appendChild(list);
    }
  }); // input

  // experimenting
  const btn = document.querySelector(".btn-submit");
  const btn__reset = document.querySelector('.reset__button');
  const article = document.querySelectorAll("article");
  const section = document.querySelector("section");
  btn__reset.addEventListener('click', function() {
    article.forEach(posts => {
      posts.parentElement.style.display = "block";
    });
    window.scrollTo({
            top: document.body.offsetTop,
            left: 0,
            behavior: "smooth"
     });
  });
  // when the search button is clicked
  btn.addEventListener("click", function(e) {
    e.preventDefault();

    var filter = input.value;
    // loop
    for (let j = 0; j < article.length; j++) {
        var item = article[j];
        var itemText = item.innerHTML;
      //   var index = itemText.indexOf(filter);
      //   if (index >= 0) {
      //    itemText = itemText.substring(0,index) + "<span class='highlight'>" + itemText.substring(index,index+ filter.length) + "</span>" + itemText.substring(index + filter.length);
      //    item.innerHTML = itemText;
      // }
      window.scrollTo({
            top: section.offsetTop,
            left: 0,
            behavior: "smooth"
      });
      // var regex = new RegExp('\\b(' + filter + ')\\b', 'ig');
      // itemText = itemText.replace(regex, '<span class="highlight">$1</span>');
      // item.innerHTML = itemText;

      if (itemText.indexOf(filter) > -1) {
        item.parentElement.style.display = "block";
      } else {
        item.parentElement.style.display = "none";
      }

      // $(".category").each(function(){
      //   let filled = false;
      //   $(this).children("article").each(function(){
      //     if($(this).is(":visible"))
      //       filled = true;
      //   });
      //   if(!filled)
      //     $(this).hide();
      // });

    }
  });

  // close the list
  function closeAutoComplete(element) {
    let a = document.getElementsByClassName("container_list");
    for (let i = 0; i < a.length; i++) {
      if (element != a[i] && element != input) {
        a[i].parentNode.removeChild(a[i]);
      }
    }
  }

};
