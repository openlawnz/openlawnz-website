const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get("q");
const court = urlParams.get("court") || '';
const caseLocation = urlParams.get("location") || '';
let searchResultsTable;

function paginate(totalItems, currentPage, pageSize, maxPages) {
	// calculate total pages
	let totalPages = Math.ceil(totalItems / pageSize);

	// ensure current page isn't out of range
	if (currentPage < 1) {
		currentPage = 1;
	} else if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	let startPage, endPage;
	if (totalPages <= maxPages) {
		// total pages less than max so show all pages
		startPage = 1;
		endPage = totalPages;
	} else {
		// total pages more than max so calculate start and end pages
		let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
		let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
		if (currentPage <= maxPagesBeforeCurrentPage) {
			// current page near the start
			startPage = 1;
			endPage = maxPages;
		} else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
			// current page near the end
			startPage = totalPages - maxPages + 1;
			endPage = totalPages;
		} else {
			// current page somewhere in the middle
			startPage = currentPage - maxPagesBeforeCurrentPage;
			endPage = currentPage + maxPagesAfterCurrentPage;
		}
	}

	// calculate start and end item indexes
	let startIndex = (currentPage - 1) * pageSize;
	let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

	// create an array of pages to ng-repeat in the pager control
	let pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);

	// return object with all pager properties required by the view
	return {
		totalItems: totalItems,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: totalPages,
		startPage: startPage,
		endPage: endPage,
		startIndex: startIndex,
		endIndex: endIndex,
		pages: pages,
	};
}


function setPagination(count, currentPage) {

	const pagination = paginate(count, currentPage, 10, Math.round(count / 10))
	let paginationPages;

	if (pagination.totalPages >= 5) {
		paginationPages = pagination.pages.slice(0,2);

		if (currentPage > 1 && currentPage < pagination.pages.length - 1) {
			[currentPage -1, currentPage, currentPage + 1].forEach(x => {
				if(!paginationPages.includes(x)) paginationPages.push(x)
			})
		}

		pagination.pages.slice(pagination.pages.length - 2, pagination.pages.length).forEach(x => {
			if(!paginationPages.includes(x)) paginationPages.push(x)
		})
	} else {
		paginationPages = [ ...Array(pagination.pages.length).keys() ]
	}

	const paginationContent = paginationPages.map(x => {
		const className = (x == currentPage) ? 'class="current-page"' : ''
		return (
			`
				<li><a ${className} href="javascript:search(${x})">${x}</a></li>
			`
		)
	})
	if (currentPage > 1) paginationContent.unshift(`<li><a href="javascript:search(${currentPage - 1})">Previous Page</a></li>`)
	if (currentPage < pagination.totalPages) paginationContent.push(`<li><a href="javascript:search(${currentPage + 1})">Next Page</a></li>`)


	document.getElementById("paginationContent").innerHTML = paginationContent.join('');


}
async function getSearch(query, purifiedLocation, caseLocation, page) {
	offset = page < 1 ? 1 : page
	
	const searchResults = await fetch(`/search?q=${query}&p=${(offset - 1) * 10}&court='${purifiedLocation}'&location='${caseLocation}'`)

	const { count, results } = await searchResults.json();
	if(!results) return

	setPagination(count, page)
	
	if(results.length === 0) {
		searchResultsTable.style.display = 'none';
	} else {
		searchResultsTable.style.display = 'block';
	}
	const searchTableContent = results.map(({caseCitation, caseName, caseDate, highlights}) => {
		const highlightText = highlights.caseText[0];
		return (
			`
			<tr>
				<td><a href="single-case.html?case=${caseCitation.id}">${caseName}</a></td>
				<td>${caseCitation.citation}</td>
				<td class="date-column">${caseDate.substring(0,10)}</td>
				<td>${highlightText.length > 300 ? highlightText.substring(0,300) + '...' : highlightText}</td>
			</tr>
			`
		)
	})
	document.getElementById("search-results-table-body").innerHTML = searchTableContent.join('')
}

function search(page) {
	const purifiedSearchQuery = DOMPurify.sanitize(searchQuery);
	const purifiedCourt = DOMPurify.sanitize(court);
	const purifiedLocation = DOMPurify.sanitize(caseLocation);

	document.getElementById("q-advanced").value = purifiedSearchQuery;
	document.getElementById("court").value = purifiedCourt;
	document.getElementById("location").value = purifiedLocation;

	getSearch(purifiedSearchQuery, purifiedCourt, purifiedLocation, page)
}

window.onload = () => {
	const queryEl = document.getElementById("query");
	searchResultsTable = document.getElementById("search-results-table");

	if (searchQuery) {
		const purifiedSearchQuery = DOMPurify.sanitize(searchQuery);
		queryEl.innerText = purifiedSearchQuery;

		queryEl.classList.remove("hidden");
		document.getElementById("search-body").classList.remove("hidden");
		document.getElementById("top-search").value = purifiedSearchQuery;

		search(1)

	} else {
		document.getElementById("no-query").classList.remove("hidden");
	}
};
