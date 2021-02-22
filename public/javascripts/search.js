const searchBar = document.getElementById('searchBar');
console.log(searchBar);
searchBar.addEventListener('keyup', (e) => {
    console.log(e.target.value);
});
console.log(place);