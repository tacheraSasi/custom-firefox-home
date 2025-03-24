async function search(prompt) {
    const results = document.getElementById("results");
    results.innerHTML = "<span>Searching...</span>";
    
    try {
        const response = await fetch("/api/search", {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: prompt,
        });
        const json = await response.json();
        
        results.innerHTML = "";
        json.forEach(([path, rank]) => {
            let item = document.createElement("span");
            item.textContent = path;
            item.addEventListener("click", () => {
                // Add your click handler here
                console.log("Selected:", path);
            });
            results.appendChild(item);
        });
        
        if (json.length === 0) {
            results.innerHTML = "<span>No results found</span>";
        }
    } catch (error) {
        results.innerHTML = "<span>Error fetching results</span>";
        console.error("Search error:", error);
    }
}

const query = document.getElementById("query");
let timeoutId;

function debounceSearch(func, delay = 300) {
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedSearch = debounceSearch(search);

query.addEventListener("input", (e) => {
    if (e.target.value.trim()) {
        debouncedSearch(e.target.value);
    } else {
        document.getElementById("results").innerHTML = "";
    }
});